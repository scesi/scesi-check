export interface Settings {
  id: number;
  absenceCost: string;
  lateArrivalCost: string;
  toleranceTimeMinutes: number;
  absenceThresholdMinutes: number;
  lastLateFeeGenerationDate: string;
}

export interface UpdateSettingsRequest {
  absenceCost?: string;
  lateArrivalCost?: string;
  toleranceTimeMinutes?: number;
  absenceThresholdMinutes?: number;
}
