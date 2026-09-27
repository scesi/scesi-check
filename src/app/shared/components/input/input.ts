import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Eye, EyeOff, CircleAlert, CircleCheck, LoaderCircle, LucideIconData } from 'lucide-angular';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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
            <lucide-angular [img]="prefixIcon()" [size]="18" aria-hidden="true"></lucide-angular>
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
            <lucide-angular [img]="showPassword() ? EyeOff : Eye" [size]="18" aria-hidden="true"></lucide-angular>
          </button>
        } @else if (suffixIcon()) {
          <div class="input-suffix">
            <lucide-angular [img]="suffixIcon()" [size]="18" aria-hidden="true"></lucide-angular>
          </div>
        } @else if (loading()) {
          <div class="input-suffix">
            <lucide-angular [img]="LoaderCircle" [size]="18" class="animate-spin" aria-hidden="true"></lucide-angular>
          </div>
        } @else if (valid() && !pristine()) {
          <div class="input-suffix">
            <lucide-angular [img]="CircleCheck" [size]="18" class="text-green-500" aria-hidden="true"></lucide-angular>
          </div>
        }
      </div>

      @if (hint() && !error()) {
        <p class="input-hint">{{ hint() }}</p>
      }

      @if (error()) {
        <div class="input-error" role="alert">
          <lucide-angular [img]="CircleAlert" [size]="14" aria-hidden="true"></lucide-angular>
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

  prefixIcon = input<LucideIconData | undefined>(undefined);
  suffixIcon = input<LucideIconData | undefined>(undefined);
  size = input<InputSize>('md');
  maxLength = input<number | null>(null);
  showPassword = signal(false);

  valueChange = output<string>();
  blur = output<void>();
  focus = output<void>();
  enter = output<void>();

  focused = signal(false);
  dirty = signal(false);

  Eye = Eye;
  EyeOff = EyeOff;
  CircleAlert = CircleAlert;
  CircleCheck = CircleCheck;
  LoaderCircle = LoaderCircle;

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