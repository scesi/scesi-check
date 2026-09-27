import { Component, input, output, effect, viewChild, ElementRef, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSize } from '@shared/types/modal.types';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center" (click)="onBackdropClick($event)">
        <div
          class="bg-overlay/50 backdrop-blur-sm w-full h-full fixed inset-0 test-backdrop"
          aria-hidden="true"
        ></div>

        <dialog
          #dialogRef
          [class]="dialogClasses()"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="title() ? 'modal-title' : null"
          [attr.aria-describedby]="description() ? 'modal-description' : null">
          
          <div class="flex flex-col h-full">
            @if (showHeader()) {
              <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
                <h2 id="modal-title" class="text-lg font-semibold text-text">
                  {{ title() }}
                </h2>
                @if (closable()) {
                  <button
                    type="button"
                    class="text-text-muted hover:text-text transition-colors p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    (click)="close()"
                    aria-label="Cerrar modal">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                }
              </header>
            }

            <div 
              id="modal-description"
              class="flex-1 overflow-y-auto p-6 bg-white"
              [class.p-0]="!showBodyPadding()">
              <ng-content></ng-content>
            </div>

            @if (showFooter()) {
              <footer class="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-white">
                <ng-content select="[slot=footer]"></ng-content>
              </footer>
            }
          </div>
        </dialog>
      </div>
    }
  `
})
export class ModalComponent {
  isOpen = input(false);
  title = input('');
  description = input('');
  size = input<ModalSize>('md');
  closable = input(true);
  showHeader = input(true);
  showFooter = input(true);
  showBodyPadding = input(true);
  closeOnBackdrop = input(true);
  closeOnEscape = input(true);

  closed = output<void>();
  confirmed = output<void>();

  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogRef');
  private focusableElements: HTMLElement[] = [];
  private lastFocusedElement: HTMLElement | null = null;

  dialogClasses = computed(() => {
    const base = 'bg-white rounded-xl shadow-lg max-h-[90vh] w-full flex flex-col';
    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      fullscreen: 'max-w-[90vw] max-h-[90vh] m-2'
    };
    return `${base} ${sizeClasses[this.size()]}`;
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.openDialog();
      } else {
        this.closeDialog();
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen() && this.closeOnEscape() && this.closable()) {
      this.close();
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.close();
    }
  }

  protected close(): void {
    this.closed.emit();
  }

  protected confirm(): void {
    this.confirmed.emit();
    this.close();
  }

  private openDialog(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (dialog) {
      this.lastFocusedElement = document.activeElement as HTMLElement;
      dialog.showModal();
      this.trapFocus(dialog);
      this.focusFirstElement(dialog);
      document.body.style.overflow = 'hidden';
    }
  }

  private closeDialog(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (dialog) {
      dialog.close();
      this.restoreFocus();
      document.body.style.overflow = '';
    }
  }

  private trapFocus(dialog: HTMLDialogElement): void {
    this.focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

    dialog.addEventListener('keydown', this.handleTabKey.bind(this));
  }

  private handleTabKey(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || this.focusableElements.length === 0) return;

    const first = this.focusableElements[0];
    const last = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusFirstElement(dialog: HTMLDialogElement): void {
    const autofocus = dialog.querySelector<HTMLElement>('[autofocus]');
    if (autofocus) {
      autofocus.focus();
    } else if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  private restoreFocus(): void {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
    this.focusableElements = [];
  }
}