import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Twitter, Linkedin, Github } from 'lucide-angular';

export interface FooterLink {
  label: string;
  route?: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <footer class="footer bg-dark-blue text-white">
      <div class="container mx-auto px-5 md:px-12 py-12 lg:py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div class="footer-brand lg:col-span-1">
            <a routerLink="/" class="block mb-6" aria-label="check Inicio">
              <img 
                src="/logo-white.svg" 
                alt="check Logo" 
                class="h-10 w-auto max-w-18.75"
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

            <div class="flex items-center gap-6" role="list" aria-label="Redes sociales">
              <a
                href="https://twitter.com/check"
                target="_blank"
                rel="noopener noreferrer"
                class="text-text-muted hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <lucide-angular [img]="Twitter" [size]="20" aria-hidden="true"></lucide-angular>
              </a>
              <a
                href="https://linkedin.com/company/check"
                target="_blank"
                rel="noopener noreferrer"
                class="text-text-muted hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <lucide-angular [img]="Linkedin" [size]="20" aria-hidden="true"></lucide-angular>
              </a>
              <a
                href="https://github.com/check"
                target="_blank"
                rel="noopener noreferrer"
                class="text-text-muted hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <lucide-angular [img]="Github" [size]="20" aria-hidden="true"></lucide-angular>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  brandDescription = input('Sistema de control y gestión integral.');
  
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

  legalLinks = input<FooterLink[]>([
    { label: 'Política de privacidad', route: '/privacidad' },
    { label: 'Términos de uso', route: '/terminos' },
    { label: 'Cookies', route: '/cookies' }
  ]);

  copyright = input('© 2026 check. Todos los derechos reservados.');

  Twitter = Twitter;
  Linkedin = Linkedin;
  Github = Github;
}