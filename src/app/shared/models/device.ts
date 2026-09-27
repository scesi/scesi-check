export interface FingerprintEnrollment {
  action: 'enroll';
  user_id: number;
  finger: number;
  ok: boolean;
  detail: string;
  count: number;
  max: number;
  fingers: number[];
}

export interface WifiConfig {
  action: 'wifi_add' | 'wifi_list' | 'wifi_remove';
  ssid?: string;
  ok: boolean;
  detail: string;
  ssids: string[];
}