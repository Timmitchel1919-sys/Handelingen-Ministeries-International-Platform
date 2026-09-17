import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';

import { PageHeader } from '@/components/layout/PageHeader';
import { getFirebaseFirestore } from '@/lib/firebase';
import { useAuth } from '@/features/auth/AuthContext';
import type { Member } from '@/types/member';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function MemberProfilePage() {
  const { t } = useTranslation();
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadMember() {
      if (!user?.churchId || !memberId) return;
      try {
        setLoading(true);
        const db = getFirebaseFirestore();
        if (!db) throw new Error('Firestore not initialized');
        
        const snap = await getDoc(doc(db, 'members', memberId));
        if (!snap.exists()) {
          throw new Error(t('hrm.members.notFound', { defaultValue: 'Member not found.' }));
        }

        const data = snap.data() as Member;
        data.id = snap.id;

        if (data.churchId !== user.churchId) {
          throw new Error(t('hrm.members.notFound', { defaultValue: 'Member not found.' }));
        }

        setMember(data);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    loadMember();
  }, [user?.churchId, memberId, t]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error.message} onRetry={() => navigate('/hrm/members')} />;
  if (!member) return null;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={`${member.personal.firstName} ${member.personal.lastName}`}
        description={member.contact.email}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-4">
          <Badge tone={member.membership.status === 'active' ? 'success' : 'neutral'}>
            {member.membership.status}
          </Badge>
          <span className="text-sm font-medium text-[var(--color-text)]/60 capitalize">
            {member.membership.memberType}
          </span>
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => navigate('/hrm/members')}>
            Back to Directory
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Personal Information
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[var(--color-text)]/60">Date of Birth</dt>
                <dd className="font-medium">{member.personal.dateOfBirth}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text)]/60">Gender</dt>
                <dd className="font-medium capitalize">{member.personal.gender}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text)]/60">Marital Status</dt>
                <dd className="font-medium capitalize">{member.personal.maritalStatus}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Contact & Address
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[var(--color-text)]/60">Phone</dt>
                <dd className="font-medium">{member.contact.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text)]/60">Country</dt>
                <dd className="font-medium">{member.address.country}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text)]/60">District</dt>
                <dd className="font-medium">{member.address.district}</dd>
              </div>
            </dl>
          </Card>

          {member.emergencyContacts && member.emergencyContacts.length > 0 && (
            <Card className="p-6 md:col-span-2">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Emergency Contacts
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {member.emergencyContacts.map((contact, i) => (
                  <div key={i} className="rounded-lg bg-[var(--color-surface-raised)] p-4 border border-[var(--color-border)]">
                    <div className="font-bold">{contact.firstName} {contact.lastName}</div>
                    <div className="text-sm text-[var(--color-text)]/80 mt-1 capitalize">{contact.relationship}</div>
                    <div className="text-sm mt-2">{contact.phone}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

