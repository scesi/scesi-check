export interface Attendance {
  id: number;
  userId: number;
  eventId: number;
  checkInTime: string;
  checkOutTime?: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT';
}