export type LateFeeType = 'LATE_ARRIVAL' | 'EARLY_DEPARTURE' | 'ABSENCE';

export interface LateFee {
  id: number;
  amountFee: string;
  createdDate: string;
  typeLateFeeEntity: LateFeeType;
  attendanceId: number;
}