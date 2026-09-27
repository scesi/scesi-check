import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface FooterLink {
  label: string;
  route?: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer bg-dark-blue text-white">
      <div class="container mx-auto px-5 md:px-12 py-12 lg:py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div class="footer-brand lg:col-span-1">
            <a routerLink="/" class="block mb-6" aria-label="SCESI Inicio">
              <img 
                src="/logo-white.svg" 
                alt="SCESI Logo" 
                class="h-10 w-auto max-w-[75px]"
                width="75"
                height="40"
              >
            </a>
            <p class="text-off-white text-body text-sm leading-relaxed">
              {{ brandDescription() }}
            </p>
          </div>

          @for (section of sections(); track section.title) {
            <nav class="footer-section" aria-labelledby="footer-section-{{ section.title }}">
              <h3 id="footer-section-{{ section.title }}" class="text-card font-semibold mb-4 text-white">
                {{ section.title }}
              </h3>
              <ul class="space-y-3" role="list">
                @for (link of section.links; track link.label) {
                  <li>
                    @if (link.external && link.route) {
                      <a
                        [href]="link.route"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-text-muted hover:text-white transition-colors text-sm"
                      >
                        {{ link.label }}
                      </a>
                    } @else if (link.route) {
                      <a
                        [routerLink]="link.route"
                        class="text-text-muted hover:text-white transition-colors text-sm"
                      >
                        {{ link.label }}
                      </a>
                    } @else {
                      <span class="text-text-muted text-sm">{{ link.label }}</span>
                    }
                  </li>
                }
              </ul>
            </nav>
          }
        </div>

        <div class="footer-bottom mt-12 pt-8 border-t border-white/10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-text-muted text-sm">
              {{ copyright() }}
            </p>

            @if (socialLinks().length > 0) {
              <div class="flex items-center gap-6" role="list" aria-label="Redes sociales">
                @for (social of socialLinks(); track social.label) {
                  <a
                    [href]="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-text-muted hover:text-white transition-colors"
                    aria-label="{{ social.label }}"
                  >
                    <span class="sr-only">{{ social.label }}</span>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path [attr.d]="social.icon"></path>
                    </svg>
                  </a>
                }
              </div>
            }

            @if (legalLinks().length > 0) {
              <nav class="flex flex-wrap items-center justify-center gap-4 md:order-3 md:w-full" aria-label="Enlaces legales">
                @for (link of legalLinks(); track link.label) {
                  <a
                    [routerLink]="link.route"
                    class="text-text-muted hover:text-white transition-colors text-sm"
                  >
                    {{ link.label }}
                  </a>
                }
              </nav>
            }
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  brandDescription = input('Sistema de control y gestión integral para instituciones educativas.');
  
  sections = input<FooterSection[]>([
    {
      title: 'Enlaces rápidos',
      links: [
        { label: 'Inicio', route: '/' },
        { label: 'Nosotros', route: '/nosotros' },
        { label: 'Servicios', route: '/servicios' },
        { label: 'Contacto', route: '/contacto' }
      ]
    },
    {
      title: 'Administración',
      links: [
        { label: 'Panel de control', route: '/admin/dashboard' },
        { label: 'Usuarios', route: '/admin/users' },
        { label: 'Configuración', route: '/admin/settings' }
      ]
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Centro de ayuda', route: '/ayuda' },
        { label: 'Documentación', route: '/docs' },
        { label: 'Reportar problema', route: '/soporte' }
      ]
    }
  ]);

  socialLinks = input<SocialLink[]>([
    {
      label: 'Twitter',
      url: 'https://twitter.com/scesi',
      icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'
    },
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/company/scesi',
      icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0z'
    },
    {
      label: 'GitHub',
      url: 'https://github.com/scesi',
      icon: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'
    }
  ]);

  legalLinks = input<FooterLink[]>([
    { label: 'Política de privacidad', route: '/privacidad' },
    { label: 'Términos de uso', route: '/terminos' },
    { label: 'Cookies', route: '/cookies' }
  ]);

  copyright = input('© 2024 SCESI. Todos los derechos reservados.');
}