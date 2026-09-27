import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it, beforeEach } from 'vitest';

import { AdminDashboardComponent } from './dashboard';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the dashboard title and summary cards', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    const cards = fixture.debugElement.queryAll(By.css('[data-testid="stat-card"]'));

    expect(title.nativeElement.textContent).toContain('Panel de control');
    expect(cards.length).toBeGreaterThan(0);
  });
});
