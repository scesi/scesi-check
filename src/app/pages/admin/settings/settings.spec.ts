import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { SettingsPageComponent } from './settings';
import { ApiService } from '@core/services/api.service';

const settingsResponse = {
  statusCode: 200,
  message: 'Settings retrieved successfully',
  data: {
    id: 1,
    absenceCost: '2.00',
    lateArrivalCost: '20.00',
    toleranceTimeMinutes: 5,
    absenceThresholdMinutes: 30,
    lastLateFeeGenerationDate: '2024-01-15T10:30:00Z'
  }
};

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;
  let apiService: { getSettings: ReturnType<typeof vi.fn>; updateSettings: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    apiService = {
      getSettings: vi.fn().mockReturnValue(of(settingsResponse)),
      updateSettings: vi.fn().mockReturnValue(of({
        statusCode: 200,
        message: 'Settings updated successfully',
        data: {
          ...settingsResponse.data,
          absenceCost: '3.00',
          lateArrivalCost: '25.00',
          toleranceTimeMinutes: 10,
          absenceThresholdMinutes: 45
        }
      }))
    };

    await TestBed.configureTestingModule({
      imports: [SettingsPageComponent],
      providers: [{ provide: ApiService, useValue: apiService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load settings and fill the form', () => {
    expect(apiService.getSettings).toHaveBeenCalledTimes(1);
    const form = fixture.debugElement.query(By.css('form'));
    expect(form).toBeTruthy();
    expect(component.form.get('absenceCost')?.value).toBe('2.00');
    expect(component.form.get('lateArrivalCost')?.value).toBe('20.00');
    expect(component.form.get('toleranceTimeMinutes')?.value).toBe(5);
    expect(component.form.get('absenceThresholdMinutes')?.value).toBe(30);
  });

  it('should submit updated settings', () => {
    component.form.patchValue({
      absenceCost: '3.00',
      lateArrivalCost: '25.00',
      toleranceTimeMinutes: 10,
      absenceThresholdMinutes: 45
    });

    component.onSubmit();

    expect(apiService.updateSettings).toHaveBeenCalledWith({
      absenceCost: '3.00',
      lateArrivalCost: '25.00',
      toleranceTimeMinutes: 10,
      absenceThresholdMinutes: 45
    });
  });
});
