import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CardAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  action: () => void;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="card">
      @if (image()) {
        <div class="card-image-wrapper">
          <img
            [src]="image()"
            [alt]="imageAlt()"
            class="card-image"
            loading="lazy"
          >
        </div>
      }

      <div class="card-content">
        @if (title() || subtitle()) {
          <header class="card-header">
            @if (subtitle()) {
              <span class="card-subtitle">{{ subtitle() }}</span>
            }
            @if (title()) {
              <h3 class="card-title">{{ title() }}</h3>
            }
          </header>
        }

        @if (description()) {
          <p class="card-text">{{ description() }}</p>
        }

        <ng-content></ng-content>

        @if (actions().length > 0) {
          <footer class="card-footer">
            @for (action of actions(); track action.label) {
              <button
                type="button"
                class="btn btn-{{ action.variant || 'primary' }} btn-sm"
                (click)="action.action()">
                {{ action.label }}
              </button>
            }
          </footer>
        }
      </div>
    </article>
  `
})
export class CardComponent {
  image = input<string>('');
  imageAlt = input<string>('');
  title = input<string>('');
  subtitle = input<string>('');
  description = input<string>('');
  actions = input<CardAction[]>([]);
}