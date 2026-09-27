import { Component, input, output, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavLink {
  label: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header" [class.scrolled]="isScrolled()">
      <div class="container mx-auto flex items-center justify-between h-full px-5 md:px-12">
        <a routerLink="/" class="flex-shrink-0" aria-label="SCESI Inicio">
          <img 
            src="/logo.svg" 
            alt="SCESI Logo" 
            class="h-10 w-auto max-w-[75px]"
            width="75"
            height="40"
          >
        </a>

        <nav class="hidden lg:flex items-center gap-8" aria-label="Navegación principal">
          @for (link of navLinks(); track link.route) {
            <a
              [routerLink]="link.route"
              routerLinkActive="text-white"
              [routerLinkActiveOptions]="{ exact: getExactValue(link.exact) }"
              class="nav-link text-nav text-text-muted hover:text-white transition-colors duration-300 relative"
            >
              {{ link.label }}
            </a>
          }
        </nav>

        <div class="hidden lg:flex items-center gap-4">
          @if (showCta()) {
            <a 
              [routerLink]="ctaRoute()" 
              class="cta-button text-btn px-4 py-2"
            >
              {{ ctaLabel() }}
            </a>
          }
        </div>

        <button
          class="lg:hidden flex items-center justify-center p-2 rounded-md text-text-muted hover:text-white hover:bg-white/10 transition-colors"
          (click)="toggleMobileMenu()"
          [attr.aria-expanded]="mobileMenuOpen()"
          aria-controls="mobile-menu"
          aria-label="Abrir menú">
          @if (!mobileMenuOpen()) {
            <svg id="menu-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          } @else {
            <svg id="close-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          }
        </button>
      </div>

      @if (mobileMenuOpen()) {
        <div id="mobile-menu" class="navbar lg:hidden bg-overlay">
          <nav class="flex flex-col items-center pt-6 pb-8 space-y-6" aria-label="Menú móvil">
            @for (link of navLinks(); track link.route) {
              <a
                [routerLink]="link.route"
                routerLinkActive="text-white"
                [routerLinkActiveOptions]="{ exact: getExactValue(link.exact) }"
                class="nav-link text-nav text-text-muted hover:text-white transition-colors duration-300 text-center w-full px-4 py-2"
                (click)="closeMobileMenu()"
              >
                {{ link.label }}
              </a>
            }
            @if (showCta()) {
              <a
                [routerLink]="ctaRoute()"
                class="cta-button text-btn px-6 py-3 w-full text-center"
                (click)="closeMobileMenu()"
              >
                {{ ctaLabel() }}
              </a>
            }
          </nav>
        </div>
      }
    </header>
  `
})
export class HeaderComponent {
  navLinks = input<NavLink[]>([]);
  showCta = input(false);
  ctaLabel = input('Contactar');
  ctaRoute = input('/contacto');

  mobileMenuOpen = signal(false);
  isScrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 10);
  }

  getExactValue(exact?: boolean): boolean {
    return exact ?? false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
    document.body.style.overflow = this.mobileMenuOpen() ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }
}