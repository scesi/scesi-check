import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardComponent, CardAction } from './card';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  const mockActions: CardAction[] = [
    { label: 'Acción 1', variant: 'primary', action: vi.fn() },
    { label: 'Acción 2', variant: 'secondary', action: vi.fn() }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card element with base classes', () => {
    const card = fixture.debugElement.query(By.css('article'));
    expect(card).toBeTruthy();
    expect(card.nativeElement.classList).toContain('card');
  });

  it('should render image when provided', () => {
    fixture.componentRef.setInput('image', '/test-image.jpg');
    fixture.componentRef.setInput('imageAlt', 'Imagen de prueba');
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('.card-image'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('/test-image.jpg');
    expect(img.nativeElement.alt).toBe('Imagen de prueba');
  });

  it('should not render image when not provided', () => {
    fixture.componentRef.setInput('image', '');
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('.card-image'));
    expect(img).toBeNull();
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('title', 'Título de la tarjeta');
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.card-title'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent).toContain('Título de la tarjeta');
  });

  it('should render subtitle when provided', () => {
    fixture.componentRef.setInput('subtitle', 'Subtítulo');
    fixture.componentRef.setInput('title', 'Título');
    fixture.detectChanges();

    const subtitle = fixture.debugElement.query(By.css('.card-subtitle'));
    expect(subtitle).toBeTruthy();
    expect(subtitle.nativeElement.textContent).toContain('Subtítulo');
  });

  it('should render description when provided', () => {
    fixture.componentRef.setInput('description', 'Descripción de la tarjeta');
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.css('.card-text'));
    expect(description).toBeTruthy();
    expect(description.nativeElement.textContent).toContain('Descripción de la tarjeta');
  });

  it('should render header with title and subtitle', () => {
    fixture.componentRef.setInput('title', 'Título');
    fixture.componentRef.setInput('subtitle', 'Subtítulo');
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.card-header'));
    expect(header).toBeTruthy();
    expect(header.nativeElement.textContent).toContain('Subtítulo');
    expect(header.nativeElement.textContent).toContain('Título');
  });

  it('should not render header when no title or subtitle', () => {
    fixture.componentRef.setInput('title', '');
    fixture.componentRef.setInput('subtitle', '');
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.card-header'));
    expect(header).toBeNull();
  });

  it('should render actions when provided', () => {
    fixture.componentRef.setInput('actions', mockActions);
    fixture.detectChanges();

    const footer = fixture.debugElement.query(By.css('.card-footer'));
    expect(footer).toBeTruthy();

    const buttons = footer.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Acción 1');
    expect(buttons[1].nativeElement.textContent).toContain('Acción 2');
  });

  it('should not render footer when no actions', () => {
    fixture.componentRef.setInput('actions', []);
    fixture.detectChanges();

    const footer = fixture.debugElement.query(By.css('.card-footer'));
    expect(footer).toBeNull();
  });

  it('should render projected content', () => {
    const testContent = 'Contenido proyectado';
    fixture = TestBed.createComponent(CardComponent);
    fixture.componentRef.setInput('description', testContent);
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.card-content'));
    expect(content).toBeTruthy();
  });

  it('should apply correct button variants', () => {
    const actions: CardAction[] = [
      { label: 'Primario', variant: 'primary', action: vi.fn() },
      { label: 'Secundario', variant: 'secondary', action: vi.fn() },
      { label: 'Ghost', variant: 'ghost', action: vi.fn() }
    ];
    fixture.componentRef.setInput('actions', actions);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.card-footer button'));
    expect(buttons[0].nativeElement.classList).toContain('btn-primary');
    expect(buttons[1].nativeElement.classList).toContain('btn-secondary');
    expect(buttons[2].nativeElement.classList).toContain('btn-ghost');
  });

  it('should call action when button clicked', () => {
    const actionFn = vi.fn();
    fixture.componentRef.setInput('actions', [{ label: 'Click', action: actionFn }]);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.card-footer button'));
    button.nativeElement.click();
    expect(actionFn).toHaveBeenCalled();
  });

  it('should have card content wrapper', () => {
    const content = fixture.debugElement.query(By.css('.card-content'));
    expect(content).toBeTruthy();
  });

  it('should apply hover effects via card class', () => {
    const card = fixture.debugElement.query(By.css('article'));
    expect(card.nativeElement.classList).toContain('card');
  });
});