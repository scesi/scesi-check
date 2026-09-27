import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    document.body.style.overflow = '';
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render when isOpen is false', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('dialog'));
    expect(modal).toBeNull();
  });

  it('should render when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('dialog'));
    expect(modal).toBeTruthy();
  });

  it('should apply size classes', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('dialog')).nativeElement;
    expect(dialog.classList).toContain('max-w-lg');
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Título del Modal');
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('#modal-title'));
    expect(title.nativeElement.textContent).toContain('Título del Modal');
  });

  it('should not render header when showHeader is false', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('showHeader', false);
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('header'));
    expect(header).toBeNull();
  });

  it('should render close button when closable is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const closeBtn = fixture.debugElement.query(By.css('button[aria-label="Cerrar modal"]'));
    expect(closeBtn).toBeTruthy();
  });

  it('should not render close button when closable is false', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('closable', false);
    fixture.detectChanges();
    const closeBtn = fixture.debugElement.query(By.css('button[aria-label="Cerrar modal"]'));
    expect(closeBtn).toBeNull();
  });

  it('should emit closed event when close button clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const closeSpy = vi.spyOn(component.closed, 'emit');
    const closeBtn = fixture.debugElement.query(By.css('button[aria-label="Cerrar modal"]'));
    closeBtn.nativeElement.click();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should emit closed event when backdrop clicked and closeOnBackdrop is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('closeOnBackdrop', true);
    fixture.detectChanges();
    const closeSpy = vi.spyOn(component.closed, 'emit');
    const container = fixture.debugElement.query(By.css('.fixed.inset-0'));
    container.nativeElement.click();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should not emit closed event when backdrop clicked and closeOnBackdrop is false', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('closeOnBackdrop', false);
    fixture.detectChanges();
    const closeSpy = vi.spyOn(component.closed, 'emit');
    const container = fixture.debugElement.query(By.css('.fixed.inset-0'));
    container.nativeElement.click();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should render footer content when showFooter is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('showFooter', true);
    fixture.detectChanges();
    const footer = fixture.debugElement.query(By.css('footer'));
    expect(footer).toBeTruthy();
  });

  it('should not render footer when showFooter is false', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('showFooter', false);
    fixture.detectChanges();
    const footer = fixture.debugElement.query(By.css('footer'));
    expect(footer).toBeNull();
  });

  it('should have correct aria attributes', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Test Modal');
    fixture.componentRef.setInput('description', 'Test Description');
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('dialog')).nativeElement;
    expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title');
    expect(dialog.getAttribute('aria-describedby')).toBe('modal-description');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('role')).toBe('dialog');
  });

  it('should render projected content', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const dialogContent = fixture.debugElement.query(By.css('.flex-1'));
    expect(dialogContent).toBeTruthy();
  });

  it('should apply fullscreen size class', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('size', 'fullscreen');
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('dialog')).nativeElement;
    expect(dialog.classList).toContain('max-w-[90vw]');
    expect(dialog.classList).toContain('max-h-[90vh]');
  });

  it('should have backdrop overlay', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const backdrop = fixture.debugElement.query(By.css('.test-backdrop'));
    expect(backdrop).toBeTruthy();
  });
});