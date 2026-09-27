import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { describe, expect, it, beforeEach } from 'vitest';

import { AdminLoginComponent } from './login';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AdminLoginComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the login heading and email field', () => {
    const heading = fixture.debugElement.query(By.css('h1'));
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));

    expect(heading.nativeElement.textContent).toContain('Acceso administrativo');
    expect(emailInput).toBeTruthy();
  });
});
