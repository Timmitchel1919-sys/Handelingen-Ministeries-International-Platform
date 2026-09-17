import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { PageHeader } from '@/components/layout/PageHeader';
import { getFirebaseFirestore } from '@/lib/firebase';
import { useAuth } from '@/features/auth/AuthContext';
import type { MemberRegistration } from '@/types/registration';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { approveRegistration, rejectRegistration } from '@/services/hrm-service';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

export function RegistrationIntakePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<MemberRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadRegistrations() {
      if (!user?.churchId) return;
      try {
        setLoading(true);
        const db = getFirebaseFirestore();
        if (!db) throw new Error('Firestore not initialized');
        
        // We might need a composite index for churchId + status + createdAt if we sort. 
        // For now let's just query by churchId and filter locally to avoid index creation for now.
        const q = query(
          collection(db, 'memberRegistrations'),
          where('churchId', '==', user.churchId)
        );
        const snap = await getDocs(q);
        
        const docs = snap.docs.map((d) => {
          const data = d.data() as MemberRegistration;
          data.id = d.id;
          return data;
        });

        // Filter out drafts and sorts locally
        const pending = docs
          .filter(r => r.status === 'verified' || r.status === 'under_review' || r.status === 'correction_requested' || r.status === 'submitted')
          .sort((a, b) => b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.() || 0);

        setRegistrations(pending);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    loadRegistrations();
  }, [user?.churchId]);

  const handleApprove = async (reg: MemberRegistration) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to approve this registration?')) return;
    
    try {
      await approveRegistration(reg.id, user.id);
      setRegistrations(prev => prev.filter(r => r.id !== reg.id));
    } catch (err) {
      console.error(err);
      alert('Failed to approve registration: ' + (err as Error).message);
    }
  };

  const handleReject = async (reg: MemberRegistration) => {
    if (!user) return;
    const reason = window.prompt('Reason for rejection:');
    if (reason === null) return;

    try {
      await rejectRegistration(reg.id, user.id, reason);
      setRegistrations(prev => prev.filter(r => r.id !== reg.id));
    } catch (err) {
      console.error(err);
      alert('Failed to reject registration: ' + (err as Error).message);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error.message} onRetry={() => window.location.reload()} />;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={t('hrm.registrations.title', { defaultValue: 'Registration Intake' })}
        description={t('hrm.registrations.description', { defaultValue: 'Review and process new member registrations.' })}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <Table<MemberRegistration>
          columns={[
            {
              key: 'name',
              header: t('common.name'),
              render: (reg) => (
                <div>
                  <div className="font-medium">{reg.firstName} {reg.lastName}</div>
                  <div className="text-xs text-[var(--color-text)]/60">{reg.email}</div>
                </div>
              ),
            },
            {
              key: 'type',
              header: t('hrm.memberType', { defaultValue: 'Type' }),
              render: (reg) => <span className="capitalize">{reg.memberType || '-'}</span>,
            },
            {
              key: 'status',
              header: t('common.status'),
              render: (reg) => (
                <Badge tone={reg.status === 'verified' ? 'success' : 'warning'}>
                  {reg.status}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: (reg) => (
                <div className="flex items-center gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => handleApprove(reg)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleReject(reg)} className="text-[#a82d42] hover:bg-[#fff1f3] hover:text-[#a82d42]">
                    Reject
                  </Button>
                </div>
              ),
            },
          ]}
          rows={registrations}
          getRowKey={(reg) => reg.id}
          emptyContent={
            <div className="p-8 text-center text-sm text-[var(--color-text)]/60">
              {t('hrm.registrations.empty', { defaultValue: 'No pending registrations found.' })}
            </div>
          }
        />
      </div>
    </div>
  );
}
