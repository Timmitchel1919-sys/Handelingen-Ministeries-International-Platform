import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { Table } from '@/components/ui/Table';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

import { getFirebaseFirestore } from '@/lib/firebase';
import { useAuth } from '@/features/auth/AuthContext';
import { attendanceService } from '@/services/attendance-service';
import { eventService } from '@/services/event-service';

import type { AttendanceRecord, VisitorInfo, AttendanceStatus, ChurchEvent } from '@/types/event';
import type { Member } from '@/types/member';

export function EventAttendancePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Member tab state
  const [memberSearch, setMemberSearch] = useState('');
  
  // Visitor tab state
  const [visitorForm, setVisitorForm] = useState<VisitorInfo>({ firstName: '', lastName: '', email: '', phone: '' });
  const [visitorStatus, setVisitorStatus] = useState<AttendanceStatus>('PRESENT');
  
  const statuses: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'CHECKED_IN'];

  const loadData = async () => {
    if (!user?.churchId || !eventId) return;
    try {
      setLoading(true);
      
      const [fetchedEvent, fetchedRecords] = await Promise.all([
        eventService.getEventById(user.churchId, eventId),
        attendanceService.getEventAttendance(eventId)
      ]);
      setEvent(fetchedEvent);
      setRecords(fetchedRecords.items as AttendanceRecord[]);

      const db = getFirebaseFirestore();
      if (db) {
        const q = query(
          collection(db, 'members'),
          where('churchId', '==', user.churchId)
        );
        const snap = await getDocs(q);
        setMembers(snap.docs.map(d => ({ ...d.data(), id: d.id } as Member)));
      }
    } catch (err) {
      console.error(err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.churchId, eventId]);

  const handleRecordMember = async (memberId: string, status: AttendanceStatus) => {
    if (!user?.churchId || !eventId) return;
    try {
      await attendanceService.recordMemberAttendance(user.churchId, eventId, memberId, status, user.id);
      await loadData();
    } catch (err) {
      console.error('Failed to record member attendance:', err);
    }
  };

  const handleRecordVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.churchId || !eventId || !visitorForm.firstName || !visitorForm.lastName) return;
    try {
      await attendanceService.recordVisitorAttendance(user.churchId, eventId, visitorForm, visitorStatus, user.id);
      setVisitorForm({ firstName: '', lastName: '', email: '', phone: '' });
      await loadData();
    } catch (err) {
      console.error('Failed to record visitor attendance:', err);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await attendanceService.deleteAttendance(id);
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete attendance record:', err);
    }
  };

  const handleUpdateRecordStatus = async (id: string, newStatus: AttendanceStatus) => {
    try {
      await attendanceService.updateAttendance(id, { status: newStatus });
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Failed to update attendance status:', err);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error.message} onRetry={loadData} />;
  if (!event) return <ErrorState description="Event not found" onRetry={loadData} />;

  const filteredMembers = members.filter(m => {
    const fullName = `${m.personal.firstName} ${m.personal.lastName}`.toLowerCase();
    return fullName.includes(memberSearch.toLowerCase());
  });

  const memberAttendanceCount = records.filter(r => r.memberId).length;
  const visitorAttendanceCount = records.filter(r => r.visitorInfo).length;
  const totalCount = records.length;

  return (
    <PageContainer title={t('attendance.title', 'Attendance')}>
      <PageHeader
        title={t('attendance.title', 'Attendance') + `: ${event.title}`}
        description={t('events.details', 'Event Details')}
        actions={
          <Button variant="outline" onClick={() => navigate(`/events/${eventId}`)}>
            {t('common.cancel', 'Back')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-[var(--color-primary)]">{totalCount}</span>
          <span className="text-sm text-[var(--color-text-muted)]">{t('attendance.total', 'Total Attendance')}</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-blue-600">{memberAttendanceCount}</span>
          <span className="text-sm text-[var(--color-text-muted)]">{t('attendance.members', 'Members')}</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-green-600">{visitorAttendanceCount}</span>
          <span className="text-sm text-[var(--color-text-muted)]">{t('attendance.visitors', 'Visitors')}</span>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <Tabs
          items={[
            {
              key: 'members',
              label: t('attendance.members', 'Members'),
              content: (
                <div className="p-4 space-y-4">
                  <Input
                    type="search"
                    placeholder={t('attendance.searchMember', 'Search member...')}
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                  <div className="max-h-96 overflow-y-auto border border-[var(--color-border)] rounded-md">
                    {filteredMembers.length > 0 ? (
                      <ul className="divide-y divide-[var(--color-border)]">
                        {filteredMembers.map(m => {
                          const existingRecord = records.find(r => r.memberId === m.id);
                          return (
                            <li key={m.id} className="p-4 flex items-center justify-between">
                              <div>
                                <p className="font-medium">{m.personal.firstName} {m.personal.lastName}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{m.contact.email}</p>
                              </div>
                              <div className="flex gap-2">
                                {existingRecord ? (
                                  <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                                    ✓ {t(`attendance.status.${existingRecord.status}`, existingRecord.status)}
                                  </span>
                                ) : (
                                  <>
                                    <Button size="sm" variant="outline" onClick={() => handleRecordMember(m.id, 'PRESENT')}>
                                      {t('attendance.status.PRESENT', 'Present')}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleRecordMember(m.id, 'ABSENT')}>
                                      {t('attendance.status.ABSENT', 'Absent')}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="p-4 text-sm text-[var(--color-text-muted)]">{t('common.noResults', 'No results found')}</p>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: 'visitors',
              label: t('attendance.visitors', 'Visitors'),
              content: (
                <form onSubmit={handleRecordVisitor} className="p-4 space-y-4 max-w-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t('attendance.firstName', 'First Name')}
                      value={visitorForm.firstName}
                      onChange={(e) => setVisitorForm({ ...visitorForm, firstName: e.target.value })}
                      required
                    />
                    <Input
                      label={t('attendance.lastName', 'Last Name')}
                      value={visitorForm.lastName}
                      onChange={(e) => setVisitorForm({ ...visitorForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label={t('attendance.email', 'Email')}
                    type="email"
                    value={visitorForm.email || ''}
                    onChange={(e) => setVisitorForm({ ...visitorForm, email: e.target.value })}
                  />
                  <Input
                    label={t('attendance.phone', 'Phone')}
                    type="tel"
                    value={visitorForm.phone || ''}
                    onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                  />
                  <Select
                    label={t('common.status', 'Status')}
                    value={visitorStatus}
                    onChange={(e) => setVisitorStatus(e.target.value as AttendanceStatus)}
                    options={statuses.map(s => ({
                      value: s,
                      label: t(`attendance.status.${s}`, s)
                    }))}
                  />
                  <Button type="submit">{t('attendance.submitVisitor', 'Record Visitor Attendance')}</Button>
                </form>
              ),
            },
            {
              key: 'records',
              label: t('attendance.records', 'Records'),
              content: (
                <div className="p-4">
                  <Table<AttendanceRecord>
                    columns={[
                      {
                        key: 'name',
                        header: t('common.name', 'Name'),
                        render: (r) => {
                          if (r.memberId) {
                            const m = members.find(m => m.id === r.memberId);
                            return m ? `${m.personal.firstName} ${m.personal.lastName}` : 'Unknown Member';
                          }
                          if (r.visitorInfo) {
                            return `${r.visitorInfo.firstName} ${r.visitorInfo.lastName} (Visitor)`;
                          }
                          return 'Unknown';
                        }
                      },
                      {
                        key: 'status',
                        header: t('common.status', 'Status'),
                        render: (r) => (
                          <Select
                            value={r.status}
                            onChange={(e) => handleUpdateRecordStatus(r.id, e.target.value as AttendanceStatus)}
                            options={statuses.map(s => ({
                              value: s,
                              label: t(`attendance.status.${s}`, s)
                            }))}
                          />
                        )
                      },
                      {
                        key: 'checkInTime',
                        header: 'Check-In Time',
                        render: (r) => r.checkInTime ? new Date(r.checkInTime).toLocaleString() : '-'
                      },
                      {
                        key: 'actions',
                        header: '',
                        render: (r) => (
                          <Button variant="outline" size="sm" onClick={() => handleDeleteRecord(r.id)}>
                            {t('common.delete', 'Delete')}
                          </Button>
                        )
                      }
                    ]}
                    rows={records}
                    getRowKey={(r) => r.id}
                    emptyContent={
                      <div className="p-8 text-center text-sm text-[var(--color-text)]/60">
                        {t('attendance.noRecords', 'No attendance records found.')}
                      </div>
                    }
                  />
                </div>
              ),
            }
          ]}
        />
      </Card>
    </PageContainer>
  );
}
