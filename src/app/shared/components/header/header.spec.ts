import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header';
import { provideRouter, RouterLink, RouterLinkActive } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const mockNavLinks = [
    { label: 'Inicio', route: '/' },
    { label: 'Nosotros', route: '/nosotros' },
    { label: 'Contacto', route: '/contacto' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('navLinks', mockNavLinks);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header element', () => {
    const header = fixture.debugElement.query(By.css('header'));
    expect(header).toBeTruthy();
    expect(header.nativeElement.classList).toContain('header');
  });

  it('should render logo link', () => {
    const logoLink = fixture.debugElement.query(By.css('a[routerLink="/"]'));
    expect(logoLink).toBeTruthy();
    expect(logoLink.nativeElement.getAttribute('aria-label')).toBe('SCESI Inicio');
  });

  it('should have navigation container', () => {
    const nav = fixture.debugElement.query(By.css('nav[aria-label="Navegación principal"]'));
    expect(nav).toBeTruthy();
  });

  it('should render CTA button when showCta is true', () => {
    fixture.componentRef.setInput('showCta', true);
    fixture.componentRef.setInput('ctaLabel', 'Contactar');
    fixture.componentRef.setInput('ctaRoute', '/contacto');
    fixture.detectChanges();

    const cta = fixture.debugElement.query(By.css('.cta-button'));
    expect(cta).toBeTruthy();
    expect(cta.nativeElement.textContent).toContain('Contactar');
  });

  it('should not render CTA button when showCta is false', () => {
    fixture.componentRef.setInput('showCta', false);
    fixture.detectChanges();

    const cta = fixture.debugElement.query(By.css('.cta-button'));
    expect(cta).toBeNull();
  });

  it('should render mobile menu toggle button', () => {
    const toggle = fixture.debugElement.query(By.css('button[aria-label="Abrir menú"]'));
    expect(toggle).toBeTruthy();
  });

  it('should toggle mobile menu on button click', () => {
    expect(component.mobileMenuOpen()).toBe(false);
    
    const toggle = fixture.debugElement.query(By.css('button[aria-label="Abrir menú"]'));
    toggle.nativeElement.click();
    fixture.detectChanges();
    
    expect(component.mobileMenuOpen()).toBe(true);
  });

  it('should have correct aria attributes on mobile menu button', () => {
    const toggle = fixture.debugElement.query(By.css('button[aria-label="Abrir menú"]'));
    expect(toggle.nativeElement.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.nativeElement.getAttribute('aria-controls')).toBe('mobile-menu');
  });
});