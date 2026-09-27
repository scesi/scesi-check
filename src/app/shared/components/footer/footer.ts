import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

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
      <div class="container mx-auto px-5 md:px-12 py-8 lg:py-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-text-muted text-sm">
            {{ copyright() }}
          </p>

          <nav class="flex flex-wrap items-center justify-center gap-4" aria-label="Enlaces de administración">
            @for (link of adminLinks(); track link.label) {
              <a
                [routerLink]="link.route"
                class="text-text-muted hover:text-white transition-colors text-sm"
              >
                {{ link.label }}
              </a>
            }
          </nav>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  copyright = input('© 2026 check. Todos los derechos reservados.');

  adminLinks = input<FooterLink[]>([
    { label: 'Panel de control', route: '/admin/dashboard' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'Configuración', route: '/admin/settings' }
  ]);
}