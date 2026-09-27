import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@envs/environment';
import { ApiResponse } from '@shared/models/api-response';
import { User, CreateUserRequest, UpdateUserRequest, UserRole } from '@shared/models/user';
import { Role, CreateRoleRequest, UpdateRoleRequest } from '@shared/models/role';
import { Event, CreateEventRequest, UpdateEventRequest } from '@shared/models/event';
import { LateFee } from '@shared/models/late-fee';
import { Attendance } from '@shared/models/attendance';
import { FingerprintEnrollment, WifiConfig } from '@shared/models/device';
import { Settings, UpdateSettingsRequest } from '@shared/models/settings';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private get<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, { params, withCredentials: true });
  }

  private post<T>(endpoint: string, body: unknown, params?: HttpParams): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, { params, withCredentials: true });
  }

  private patch<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, { withCredentials: true });
  }

  private delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, { withCredentials: true });
  }

  // Auth
  login(email: string, baseUrl: string): Observable<ApiResponse<{ emailSent: boolean; message: string }>> {
    return this.post('/auth/login', { email }, new HttpParams().set('baseUrl', baseUrl));
  }

  callback(): Observable<ApiResponse<null>> {
    return this.get('/auth/callback');
  }

  refresh(): Observable<ApiResponse<null>> {
    return this.post('/auth/refresh', {});
  }

  logout(): Observable<ApiResponse<null>> {
    return this.post('/auth/logout', {});
  }

  // Users
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.get<User[]>('/user/');
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.get<User>(`/user/${id}`);
  }

  createUser(data: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.post<User>('/user/', data);
  }

  updateUser(id: number, data: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.patch<User>(`/user/${id}`, data);
  }

  deleteUser(id: number): Observable<ApiResponse<boolean>> {
    return this.delete<boolean>(`/user/${id}`);
  }

  assignRole(userId: number, roleId: number): Observable<ApiResponse<boolean>> {
    return this.post<boolean>(`/user/${userId}/role/${roleId}`, {});
  }

  removeRole(userId: number, roleId: number): Observable<ApiResponse<boolean>> {
    return this.delete<boolean>(`/user/${userId}/role/${roleId}`);
  }

  getUserRoles(userId: number): Observable<ApiResponse<UserRole[]>> {
    return this.get<UserRole[]>(`/user/${userId}/rol/`);
  }

  // Roles
  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.get<Role[]>('/rol/');
  }

  getRole(id: number): Observable<ApiResponse<Role>> {
    return this.get<Role>(`/rol/${id}`);
  }

  createRole(data: CreateRoleRequest): Observable<ApiResponse<Role>> {
    return this.post<Role>('/rol/', data);
  }

  updateRole(id: number, data: UpdateRoleRequest): Observable<ApiResponse<Role>> {
    return this.patch<Role>(`/rol/${id}`, data);
  }

  deleteRole(id: number): Observable<ApiResponse<boolean>> {
    return this.delete<boolean>(`/rol/${id}`);
  }

  // Events
  getEvents(): Observable<ApiResponse<Event[]>> {
    return this.get<Event[]>('/event/');
  }

  getEvent(id: number): Observable<ApiResponse<Event>> {
    return this.get<Event>(`/event/${id}`);
  }

  createEvent(data: CreateEventRequest): Observable<ApiResponse<Event>> {
    return this.post<Event>('/event/', data);
  }

  updateEvent(id: number, data: UpdateEventRequest): Observable<ApiResponse<Event>> {
    return this.patch<Event>(`/event/${id}`, data);
  }

  deleteEvent(id: number): Observable<ApiResponse<boolean>> {
    return this.delete<boolean>(`/event/${id}`);
  }

  // Settings
  getSettings(): Observable<ApiResponse<Settings>> {
    return this.get<Settings>('/settings');
  }

  updateSettings(data: UpdateSettingsRequest): Observable<ApiResponse<Settings>> {
    return this.patch<Settings>('/settings', data);
  }

  // Attendance
  uploadAttendanceCsv(file: File): Observable<ApiResponse<boolean>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/attendance/upload-csv`, formData, { withCredentials: true });
  }

  // Late Fees
  getLateFees(): Observable<ApiResponse<LateFee[]>> {
    return this.get<LateFee[]>('/late-fee/');
  }

  toggleLateFee(id: number): Observable<ApiResponse<boolean>> {
    return this.patch<boolean>(`/late-fee/${id}`, {});
  }

  downloadLateFeesPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/late-fee/pdf`, { responseType: 'blob', withCredentials: true });
  }

  // Device - Fingerprint
  enrollFingerprint(userId: number): Observable<ApiResponse<FingerprintEnrollment>> {
    return this.post<FingerprintEnrollment>(`/user/${userId}/fingerprint`, {});
  }

  deleteFingerprint(userId: number, finger: number): Observable<ApiResponse<boolean>> {
    return this.delete<boolean>(`/user/${userId}/fingerprint/${finger}`);
  }

  deleteAllFingerprints(userId: number): Observable<ApiResponse<boolean>> {
    return this.delete<boolean>(`/user/${userId}/fingerprint`);
  }

  // Device - WiFi
  addWifi(ssid: string, pass: string): Observable<ApiResponse<WifiConfig>> {
    const body = new HttpParams().set('ssid', ssid).set('pass', pass);
    return this.http.post<ApiResponse<WifiConfig>>(`${this.baseUrl}/user/wifi`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    });
  }

  deleteWifi(ssid: string): Observable<ApiResponse<boolean>> {
    return this.delete<boolean>(`/user/wifi/${ssid}`);
  }

  listWifi(): Observable<ApiResponse<WifiConfig>> {
    return this.get<WifiConfig>('/user/wifi');
  }
}