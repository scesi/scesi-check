import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideCircleAlert,
  LucideCircleCheck,
  LucideDynamicIcon,
  LucideEye,
  LucideEyeOff,
  LucideLoaderCircle,
  type LucideIconData,
} from '@lucide/angular';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule,
    LucideDynamicIcon,
    LucideEye,
    LucideEyeOff,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideLoaderCircle,
  ],
  template: `
    <div class="input-wrapper" [class.focused]="focused()" [class.has-error]="error()">
      @if (label()) {
        <label class="label" [for]="id()">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="input-group" [class.input-group-with-icon]="prefixIcon() || suffixIcon() || showPasswordToggle()">
        @if (prefixIcon()) {
          <div class="input-prefix">
            <svg [lucideIcon]="prefixIcon()" [size]="18" aria-hidden="true"></svg>
          </div>
        }

        <input
          [id]="id()"
          [type]="showPassword() ? 'text' : type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [required]="required()"
          [readonly]="readonly()"
          [value]="value()"
          [attr.aria-describedby]="describedBy()"
          [attr.aria-invalid]="error() ? 'true' : 'false'"
          [attr.aria-required]="required()"
          class="input"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown.enter)="onEnter()"
          #inputRef
        >

        @if (showPasswordToggle()) {
          <button
            type="button"
            class="input-suffix"
            (click)="togglePassword()"
            [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            [attr.aria-pressed]="showPassword()"
          >
            @if (showPassword()) {
              <svg lucideEyeOff [size]="18" aria-hidden="true"></svg>
            } @else {
              <svg lucideEye [size]="18" aria-hidden="true"></svg>
            }
          </button>
        } @else if (suffixIcon()) {
          <div class="input-suffix">
            <svg [lucideIcon]="suffixIcon()" [size]="18" aria-hidden="true"></svg>
          </div>
        } @else if (loading()) {
          <div class="input-suffix">
            <svg lucideLoaderCircle [size]="18" class="animate-spin" aria-hidden="true"></svg>
          </div>
        } @else if (valid() && !pristine()) {
          <div class="input-suffix">
            <svg lucideCircleCheck [size]="18" class="text-green-500" aria-hidden="true"></svg>
          </div>
        }
      </div>

      @if (hint() && !error()) {
        <p class="input-hint">{{ hint() }}</p>
      }

      @if (error()) {
        <div class="input-error" role="alert">
          <svg lucideCircleAlert [size]="14" aria-hidden="true"></svg>
          <span>{{ error() }}</span>
        </div>
      }

      @if (maxLength()) {
        <div class="input-counter" [class.near-limit]="value().length >= maxLength()! * 0.9">
          {{ value().length }}/{{ maxLength() }}
        </div>
      }
    </div>
  `
})
export class InputComponent {
  id = input.required<string>();
  type = input<InputType>('text');
  value = input<string>('');
  placeholder = input<string>('');
  label = input<string>('');
  hint = input<string>('');
  error = input<string>('');
  disabled = input(false);
  required = input(false);
  readonly = input(false);
  loading = input(false);
  valid = input(false);
  pristine = input(true);

  prefixIcon = input<LucideIconData | null>(null);
  suffixIcon = input<LucideIconData | null>(null);
  size = input<InputSize>('md');
  maxLength = input<number | null>(null);
  showPassword = signal(false);

  valueChange = output<string>();
  blur = output<void>();
  focus = output<void>();
  enter = output<void>();

  focused = signal(false);
  dirty = signal(false);

  describedBy = computed(() => {
    const ids: string[] = [];
    if (this.hint()) ids.push(`${this.id()}-hint`);
    if (this.error()) ids.push(`${this.id()}-error`);
    return ids.length ? ids.join(' ') : undefined;
  });

  showPasswordToggle = computed(() => this.type() === 'password');

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
    this.dirty.set(true);
  }

  onFocus(): void {
    this.focused.set(true);
    this.focus.emit();
  }

  onBlur(): void {
    this.focused.set(false);
    this.blur.emit();
  }

  onEnter(): void {
    this.enter.emit();
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}