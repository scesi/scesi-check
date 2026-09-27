import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="computedClasses()"
      (click)="onClick($event)">
      @if (loading()) {
        <span class="flex items-center justify-center" aria-hidden="true">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </span>
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  loading = input(false);
  fullWidth = input(false);

  clicked = output<MouseEvent>();

  protected computedClasses = computed(() => {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClass = this.getVariantClass();
    const sizeClass = this.getSizeClass();
    const widthClass = this.fullWidth() ? 'w-full' : '';

    return [base, variantClass, sizeClass, widthClass].filter(Boolean).join(' ');
  });

  private getVariantClass(): string {
    switch (this.variant()) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary-hover -translate-y-0.5 hover:-translate-y-0.5 active:translate-y-0';
      case 'secondary':
        return 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white';
      case 'ghost':
        return 'bg-transparent text-text hover:text-primary';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 -translate-y-0.5 hover:-translate-y-0.5 active:translate-y-0';
      default:
        return '';
    }
  }

  private getSizeClass(): string {
    switch (this.size()) {
      case 'sm':
        return 'px-3 py-1.5 text-sm rounded-md';
      case 'md':
        return 'px-4 py-2 text-base rounded-lg';
      case 'lg':
        return 'px-6 py-3 text-lg rounded-xl';
      default:
        return '';
    }
  }

  protected onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}