import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input';
import { LucideMail } from '@lucide/angular';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'test-input');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input element', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Email');
  });

  it('should show required indicator on label', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.textContent).toContain('*');
  });

  it('should apply placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Ingrese email');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.placeholder).toBe('Ingrese email');
  });

  it('should apply disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBe(true);
  });

  it('should apply readonly state', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.readOnly).toBe(true);
  });

  it('should emit valueChange on input', () => {
    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    
    input.nativeElement.value = 'test@example.com';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith('test@example.com');
  });

  it('should emit blur event', () => {
    const emitSpy = vi.spyOn(component.blur, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    
    input.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit focus event', () => {
    const emitSpy = vi.spyOn(component.focus, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    
    input.nativeElement.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit enter event on Enter key', () => {
    const emitSpy = vi.spyOn(component.enter, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    
    input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should show error message', () => {
    fixture.componentRef.setInput('error', 'Email inválido');
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('.input-error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent).toContain('Email inválido');
  });

  it('should show hint when no error', () => {
    fixture.componentRef.setInput('hint', 'Ingrese su email');
    fixture.detectChanges();

    const hint = fixture.debugElement.query(By.css('.input-hint'));
    expect(hint).toBeTruthy();
    expect(hint.nativeElement.textContent).toContain('Ingrese su email');
  });

  it('should hide hint when error exists', () => {
    fixture.componentRef.setInput('hint', 'Ingrese su email');
    fixture.componentRef.setInput('error', 'Email inválido');
    fixture.detectChanges();

    const hint = fixture.debugElement.query(By.css('.input-hint'));
    expect(hint).toBeNull();
  });

  it('should toggle password visibility', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    const toggleBtn = fixture.debugElement.query(By.css('.input-suffix'));
    expect(toggleBtn).toBeTruthy();

    toggleBtn.nativeElement.click();
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.type).toBe('text');
  });

  it('should show prefix icon when provided', () => {
    fixture.componentRef.setInput('prefixIcon', LucideMail.icon);
    fixture.detectChanges();

    const prefix = fixture.debugElement.query(By.css('.input-prefix'));
    expect(prefix).toBeTruthy();
  });

  it('should show loading spinner when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.input-suffix .animate-spin'));
    expect(spinner).toBeTruthy();
  });

  it('should show success icon when valid and not pristine', () => {
    fixture.componentRef.setInput('valid', true);
    fixture.componentRef.setInput('pristine', false);
    fixture.detectChanges();

    const successIcon = fixture.debugElement.query(By.css('.input-suffix .text-green-500'));
    expect(successIcon).toBeTruthy();
  });

  it('should show character counter', () => {
    fixture.componentRef.setInput('maxLength', 10);
    fixture.componentRef.setInput('value', 'abc');
    fixture.detectChanges();

    const counter = fixture.debugElement.query(By.css('.input-counter'));
    expect(counter).toBeTruthy();
    expect(counter.nativeElement.textContent).toContain('3/10');
  });

  it('should apply error class to wrapper', () => {
    fixture.componentRef.setInput('error', 'Error');
    fixture.detectChanges();

    const wrapper = fixture.debugElement.query(By.css('.input-wrapper'));
    expect(wrapper.nativeElement.classList).toContain('has-error');
  });

  it('should apply focused class on focus', () => {
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    const wrapper = fixture.debugElement.query(By.css('.input-wrapper'));
    expect(wrapper.nativeElement.classList).toContain('focused');
  });

  it('should have correct aria attributes', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('hint', 'Ingrese email');
    fixture.componentRef.setInput('error', 'Inválido');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
    expect(input.nativeElement.getAttribute('aria-describedby')).toContain('test-input-hint');
    expect(input.nativeElement.getAttribute('aria-describedby')).toContain('test-input-error');
  });
});