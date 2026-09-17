import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { PageHeader } from '@/components/layout/PageHeader';
import { getFirebaseFirestore } from '@/lib/firebase';
import { useAuth } from '@/features/auth/AuthContext';
import type { Member } from '@/types/member';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

export function MemberDirectoryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadMembers() {
      if (!user?.churchId) return;
      try {
        setLoading(true);
        const db = getFirebaseFirestore();
        if (!db) throw new Error('Firestore not initialized');
        
        const q = query(
          collection(db, 'members'),
          where('churchId', '==', user.churchId)
        );
        const snap = await getDocs(q);
        
        const docs = snap.docs.map((d) => {
          const data = d.data() as Member;
          data.id = d.id;
          return data;
        });

        setMembers(docs);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, [user?.churchId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error.message} onRetry={() => window.location.reload()} />;

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={t('hrm.members.title', { defaultValue: 'Member Directory' })}
        description={t('hrm.members.description', { defaultValue: 'Manage approved members.' })}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <Table<Member>
          columns={[
            {
              key: 'name',
              header: t('common.name'),
              render: (m) => (
                <div>
                  <div className="font-medium">{m.personal.firstName} {m.personal.lastName}</div>
                  <div className="text-xs text-[var(--color-text)]/60">{m.contact.email}</div>
                </div>
              ),
            },
            {
              key: 'type',
              header: t('hrm.memberType', { defaultValue: 'Type' }),
              render: (m) => <span className="capitalize">{m.membership.memberType || '-'}</span>,
            },
            {
              key: 'status',
              header: t('common.status'),
              render: (m) => (
                <Badge tone={m.membership.status === 'active' ? 'success' : 'neutral'}>
                  {m.membership.status}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: (m) => (
                <div className="flex justify-end">
                  <NavLink to={`/hrm/members/${m.id}`} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
                    View
                  </NavLink>
                </div>
              ),
            },
          ]}
          rows={members}
          getRowKey={(m) => m.id}
          emptyContent={
            <div className="p-8 text-center text-sm text-[var(--color-text)]/60">
              {t('hrm.members.empty', { defaultValue: 'No members found.' })}
            </div>
          }
        />
      </div>
    </div>
  );
}
