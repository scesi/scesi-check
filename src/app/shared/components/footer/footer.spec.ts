import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FooterComponent } from './footer';
import { provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render footer element', () => {
    const footer = fixture.debugElement.query(By.css('footer'));
    expect(footer).toBeTruthy();
    expect(footer.nativeElement.classList).toContain('footer');
    expect(footer.nativeElement.classList).toContain('bg-dark-blue');
  });

  it('should render brand logo', () => {
    const logoLink = fixture.debugElement.query(By.css('.footer-brand a[routerLink="/"]'));
    expect(logoLink).toBeTruthy();
    expect(logoLink.nativeElement.getAttribute('aria-label')).toBe('check Inicio');
  });

  it('should render brand description', () => {
    const description = fixture.debugElement.query(By.css('.footer-brand p'));
    expect(description).toBeTruthy();
    expect(description.nativeElement.textContent).toContain('Sistema de control');
  });

  it('should render footer sections with links', () => {
    const sections = fixture.debugElement.queryAll(By.css('.footer-section'));
    expect(sections.length).toBe(3);
    
    const firstSection = sections[0];
    expect(firstSection.nativeElement.textContent).toContain('Enlaces rápidos');
    
    const links = firstSection.queryAll(By.css('a'));
    expect(links.length).toBe(4);
    expect(links[0].nativeElement.textContent).toContain('Inicio');
    expect(links[1].nativeElement.textContent).toContain('Nosotros');
  });

  it('should render social links', () => {
    const socialLinks = fixture.debugElement.queryAll(By.css('[role="list"] a[href^="https"]'));
    expect(socialLinks.length).toBe(3);
  });

  it('should render legal links', () => {
    const legalLinks = fixture.debugElement.queryAll(By.css('[aria-label="Enlaces legales"] a'));
    expect(legalLinks.length).toBe(3);
    expect(legalLinks[0].nativeElement.textContent).toContain('Política de privacidad');
    expect(legalLinks[1].nativeElement.textContent).toContain('Términos de uso');
    expect(legalLinks[2].nativeElement.textContent).toContain('Cookies');
  });

  it('should render copyright text', () => {
    const copyright = fixture.debugElement.query(By.css('.footer-bottom p'));
    expect(copyright).toBeTruthy();
    expect(copyright.nativeElement.textContent).toContain('© 2026 check');
  });

  it('should have external links with correct attributes', () => {
    const customSections = [
      {
        title: 'Externos',
        links: [
          { label: 'GitHub', route: 'https://github.com', external: true }
        ]
      }
    ];
    fixture.componentRef.setInput('sections', customSections);
    fixture.detectChanges();

    const externalLink = fixture.debugElement.query(By.css('a[href="https://github.com"]'));
    expect(externalLink).toBeTruthy();
    expect(externalLink.nativeElement.getAttribute('target')).toBe('_blank');
    expect(externalLink.nativeElement.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should allow custom brand description', () => {
    fixture.componentRef.setInput('brandDescription', 'Descripción personalizada');
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.css('.footer-brand p'));
    expect(description.nativeElement.textContent).toContain('Descripción personalizada');
  });

  it('should allow custom sections', () => {
    const customSections = [
      {
        title: 'Personalizado',
        links: [{ label: 'Link 1', route: '/link1' }]
      }
    ];
    fixture.componentRef.setInput('sections', customSections);
    fixture.detectChanges();

    const section = fixture.debugElement.query(By.css('.footer-section'));
    expect(section.nativeElement.textContent).toContain('Personalizado');
    expect(section.nativeElement.textContent).toContain('Link 1');
  });
});