import { where, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { AttendanceRecord } from '@/types/event';

const repo = new FirestoreRepository<Omit<AttendanceRecord, 'id'>>('attendanceRecords');

export const attendanceService = {
  async getEventAttendance(eventId: string, constraints: QueryConstraint[] = []) {
    return repo.list([
      where('eventId', '==', eventId),
      ...constraints
    ], 100);
  },

  async recordAttendance(data: Omit<AttendanceRecord, 'id' | 'recordedAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    return repo.create({
      ...data,
      recordedAt: now,
      updatedAt: now,
    });
  },

  async updateAttendance(id: string, data: Partial<Omit<AttendanceRecord, 'id' | 'recordedAt' | 'recordedBy' | 'eventId' | 'churchId' | 'memberId'>>) {
    return repo.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },
};
