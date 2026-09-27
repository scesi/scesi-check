import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronUp,
  LucideLoaderCircle,
} from '@lucide/angular';

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T, value: unknown) => string;
}

export interface TableAction<T> {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  action: (row: T) => void;
}

type SortableValue = string | number | Date | boolean;

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronUp,
    LucideLoaderCircle,
  ],
  template: `
    <div class="table-container">
      @if (loading()) {
        <div class="table-loading">
          <svg lucideLoaderCircle [size]="24" class="animate-spin"></svg>
          <span>{{ loadingText() }}</span>
        </div>
      } @else if (data().length === 0) {
        <div class="table-empty">
          <p>{{ emptyText() }}</p>
        </div>
      } @else {
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                @if (selectable()) {
                  <th class="w-12">
                    <input
                      type="checkbox"
                      [checked]="allSelected()"
                      [indeterminate]="indeterminate()"
                      (change)="toggleSelectAll($event)"
                      class="checkbox"
                    >
                  </th>
                }
                @for (column of columns(); track column.key) {
                  <th
                    [style.width]="column.width"
                    [class.sortable]="column.sortable"
                    [class.sorted-asc]="sortColumn() === column.key && sortDirection() === 'asc'"
                    [class.sorted-desc]="sortColumn() === column.key && sortDirection() === 'desc'"
                    (click)="column.sortable && onSort(column.key)"
                  >
                    <div class="th-content">
                      <span>{{ column.header }}</span>
                      @if (column.sortable) {
                        <div class="sort-icons">
                          <svg lucideChevronUp [size]="12" class="sort-icon"></svg>
                          <svg lucideChevronDown [size]="12" class="sort-icon"></svg>
                        </div>
                      }
                    </div>
                  </th>
                }
                @if (actions().length > 0) {
                  <th class="w-32 text-right">Acciones</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of displayedData(); track $index) {
                <tr [class.selected]="isSelected(row)">
                  @if (selectable()) {
                    <td class="w-12">
                      <input
                        type="checkbox"
                        [checked]="isSelected(row)"
                        (change)="toggleRowSelection(row, $event)"
                        class="checkbox"
                      >
                    </td>
                  }
                  @for (column of columns(); track column.key) {
                    <td>
                      @if (column.render) {
                        <span [innerHTML]="column.render(row, getValue(row, column.key))"></span>
                      } @else {
                        {{ getValue(row, column.key) }}
                      }
                    </td>
                  }
                  @if (actions().length > 0) {
                    <td class="text-right">
                      <div class="flex items-center justify-end gap-2">
                        @for (action of actions(); track action.label) {
                          <button
                            type="button"
                            class="btn btn-{{ action.variant || 'ghost' }} btn-sm"
                            (click)="action.action(row)"
                          >
                            <span>{{ action.label }}</span>
                          </button>
                        }
                      </div>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (pagination().enabled) {
          <div class="table-pagination">
            <div class="pagination-info">
              Mostrando {{ paginationStart() }} - {{ paginationEnd() }} de {{ totalItems() }}
            </div>
            <div class="pagination-controls">
              <button
                class="btn btn-ghost btn-sm"
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
              >
                <svg lucideChevronLeft [size]="16"></svg>
              </button>
              @for (page of pageNumbers(); track page) {
                <button
                  class="btn btn-{{ page === currentPage() ? 'primary' : 'ghost' }} btn-sm"
                  (click)="goToPage(page)"
                >
                  {{ page }}
                </button>
              }
              <button
                class="btn btn-ghost btn-sm"
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
              >
                <svg lucideChevronRight [size]="16"></svg>
              </button>
            </div>
          </div>
        }

        @if (selectable() && selectedRows().length > 0) {
          <div class="selection-bar">
            <span>{{ selectedRows().length }} seleccionados</span>
            <ng-content select="[slot=selection-actions]"></ng-content>
          </div>
        }
      }
    </div>
  `
})
export class TableComponent<T extends { id: string | number }> {
  data = input<T[]>([]);
  columns = input<TableColumn<T>[]>([]);
  actions = input<TableAction<T>[]>([]);
  selectable = input(false);
  loading = input(false);
  loadingText = input('Cargando...');
  emptyText = input('No hay datos disponibles');
  trackBy = input<(row: T) => string | number>(row => row.id);

  pagination = input({
    enabled: true,
    pageSize: 10,
    pageSizes: [5, 10, 25, 50]
  });

  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  selectedIds = signal<Set<string | number>>(new Set());

  displayedData = computed(() => {
    let result = [...this.data()];
    
    // Sort
    const sortCol = this.sortColumn();
    const sortDir = this.sortDirection();
    if (sortCol) {
      result.sort((a, b) => {
        const aVal = this.getSortableValue(a, sortCol);
        const bVal = this.getSortableValue(b, sortCol);
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Paginate
    const { enabled, pageSize } = this.pagination();
    if (enabled) {
      const start = (this.currentPage() - 1) * pageSize;
      result = result.slice(start, start + pageSize);
    }
    
    return result;
  });

  totalItems = computed(() => this.data().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pagination().pageSize));
  
  paginationStart = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.pagination().pageSize + 1;
  });
  
  paginationEnd = computed(() => {
    return Math.min(this.currentPage() * this.pagination().pageSize, this.totalItems());
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });

  selectedRows = computed(() => {
    const selected = this.selectedIds();
    return this.data().filter(row => selected.has(row.id));
  });

  allSelected = computed(() => {
    const displayed = this.displayedData();
    if (displayed.length === 0) return false;
    return displayed.every(row => this.selectedIds().has(row.id));
  });

  indeterminate = computed(() => {
    const displayed = this.displayedData();
    const selected = displayed.filter(row => this.selectedIds().has(row.id));
    return selected.length > 0 && selected.length < displayed.length;
  });

  getValue(row: T, key: string): unknown {
    return key.split('.').reduce((obj: unknown, k) => (obj as Record<string, unknown>)?.[k], row);
  }

  getSortableValue(row: T, key: string): SortableValue {
    const value = this.getValue(row, key);
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'boolean') return value ? 1 : 0;
    return value as SortableValue;
  }

  onSort(key: string): void {
    if (this.sortColumn() === key) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(key);
      this.sortDirection.set('asc');
    }
  }

  goToPage(page: number): void {
    const total = this.totalPages();
    if (page >= 1 && page <= total) {
      this.currentPage.set(page);
    }
  }

  isSelected(row: T): boolean {
    return this.selectedIds().has(row.id);
  }

  toggleRowSelection(row: T, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedIds.update(set => {
      const newSet = new Set(set);
      if (checked) {
        newSet.add(row.id);
      } else {
        newSet.delete(row.id);
      }
      return newSet;
    });
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedIds.update(set => {
      const newSet = new Set(set);
      this.displayedData().forEach(row => {
        if (checked) {
          newSet.add(row.id);
        } else {
          newSet.delete(row.id);
        }
      });
      return newSet;
    });
  }
}