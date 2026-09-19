import { where, type QueryConstraint } from 'firebase/firestore';
import { FirestoreRepository } from './firestore-repository';
import type { AttendanceRecord, VisitorInfo } from '@/types/event';

const repo = new FirestoreRepository<Omit<AttendanceRecord, 'id'>>('attendanceRecords');

export const attendanceService = {
  async getEventAttendance(eventId: string, constraints: QueryConstraint[] = []) {
    return repo.list([
      where('eventId', '==', eventId),
      ...constraints
    ], 500); // Higher limit for attendance lists
  },

  async getDashboardAttendanceSummary(churchId: string, limitCount = 5) {
    const now = new Date().toISOString();
    return repo.list([
      where('churchId', '==', churchId),
      where('recordedAt', '<=', now)
      // Additional filters can be added or handled in UI
    ], limitCount);
  },

  /**
   * Record attendance for a known member
   */
  async recordMemberAttendance(churchId: string, eventId: string, memberId: string, status: AttendanceRecord['status'], actorUid: string) {
    const now = new Date().toISOString();
    return repo.create({
      churchId,
      eventId,
      memberId,
      visitorInfo: null,
      status,
      checkInTime: now,
      recordedBy: actorUid,
      recordedAt: now,
      updatedAt: now,
    });
  },

  /**
   * Record attendance for a visitor (not a member)
   */
  async recordVisitorAttendance(churchId: string, eventId: string, visitorInfo: VisitorInfo, status: AttendanceRecord['status'], actorUid: string) {
    const now = new Date().toISOString();
    return repo.create({
      churchId,
      eventId,
      memberId: null, // Visitor has no member ID
      visitorInfo,
      status,
      checkInTime: now,
      recordedBy: actorUid,
      recordedAt: now,
      updatedAt: now,
    });
  },

  async updateAttendance(id: string, data: Partial<Omit<AttendanceRecord, 'id' | 'recordedAt' | 'recordedBy' | 'eventId' | 'churchId'>>) {
    return repo.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async deleteAttendance(id: string) {
    return repo.remove(id);
  }
};
