import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FooterComponent } from './footer';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

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

  it('should render copyright text', () => {
    const copyright = fixture.debugElement.query(By.css('p'));
    expect(copyright).toBeTruthy();
    expect(copyright.nativeElement.textContent).toContain('© 2026 check');
  });

  it('should render admin links', () => {
    const links = fixture.debugElement.queryAll(By.css('[aria-label="Enlaces de administración"] a'));
    expect(links.length).toBe(3);
    expect(links[0].nativeElement.textContent).toContain('Panel de control');
    expect(links[1].nativeElement.textContent).toContain('Usuarios');
    expect(links[2].nativeElement.textContent).toContain('Configuración');
  });

  it('should allow custom copyright', () => {
    fixture.componentRef.setInput('copyright', '© 2026 Custom. Derechos reservados.');
    fixture.detectChanges();

    const copyright = fixture.debugElement.query(By.css('p'));
    expect(copyright.nativeElement.textContent).toContain('© 2026 Custom');
  });

  it('should allow custom admin links', () => {
    const customLinks = [
      { label: 'Dashboard', route: '/admin' },
      { label: 'Reportes', route: '/admin/reports' }
    ];
    fixture.componentRef.setInput('adminLinks', customLinks);
    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.css('[aria-label="Enlaces de administración"] a'));
    expect(links.length).toBe(2);
    expect(links[0].nativeElement.textContent).toContain('Dashboard');
    expect(links[1].nativeElement.textContent).toContain('Reportes');
  });

  it('should have correct structure', () => {
    const footer = fixture.debugElement.query(By.css('footer'));
    expect(footer).toBeTruthy();
    
    const container = footer.query(By.css('.container'));
    expect(container).toBeTruthy();
  });
});