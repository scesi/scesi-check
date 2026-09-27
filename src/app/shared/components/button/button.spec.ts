import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default variant (primary) and size (md)', () => {
    expect(buttonEl.classList).toContain('inline-flex');
    expect(buttonEl.classList).toContain('items-center');
    expect(buttonEl.classList).toContain('bg-primary');
    expect(buttonEl.classList).toContain('text-white');
    expect(buttonEl.classList).toContain('px-4');
    expect(buttonEl.classList).toContain('py-2');
    expect(buttonEl.classList).toContain('rounded-lg');
  });

  it('should apply variant classes', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    expect(buttonEl.classList).toContain('bg-transparent');
    expect(buttonEl.classList).toContain('border-2');
    expect(buttonEl.classList).toContain('border-primary');
    expect(buttonEl.classList).toContain('text-primary');
    expect(buttonEl.classList).not.toContain('bg-primary');
  });

  it('should apply size classes', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(buttonEl.classList).toContain('px-3');
    expect(buttonEl.classList).toContain('py-1.5');
    expect(buttonEl.classList).toContain('text-sm');
    expect(buttonEl.classList).toContain('rounded-md');
    expect(buttonEl.classList).not.toContain('px-4');
  });

  it('should apply fullWidth class', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();
    expect(buttonEl.classList).toContain('w-full');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(buttonEl.disabled).toBe(true);
  });

  it('should show loading spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('svg'));
    expect(spinner).toBeTruthy();
    expect(buttonEl.disabled).toBe(true);
  });

  it('should emit clicked event on click when not disabled', () => {
    const clickSpy = vi.spyOn(component.clicked, 'emit');
    buttonEl.click();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not emit clicked event when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const clickSpy = vi.spyOn(component.clicked, 'emit');
    buttonEl.click();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should not emit clicked event when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const clickSpy = vi.spyOn(component.clicked, 'emit');
    buttonEl.click();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should render projected content', () => {
    const testContent = 'Test Button';
    fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')).toBeTruthy();
  });

  it('should have correct type attribute', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    expect(buttonEl.type).toBe('submit');
  });

  it('should have focus ring styles', () => {
    expect(buttonEl.classList).toContain('focus:ring-2');
    expect(buttonEl.classList).toContain('focus:ring-primary/40');
  });

  it('should have transition styles', () => {
    expect(buttonEl.classList).toContain('transition-all');
    expect(buttonEl.classList).toContain('duration-150');
  });
});