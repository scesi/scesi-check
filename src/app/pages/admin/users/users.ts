import { CommonModule } from '@angular/common';
import { Component, ViewChild, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '@shared/components/button/button';
import { CardComponent } from '@shared/components/card/card';
import { TableColumn, TableComponent } from '@shared/components/table/table';

interface UserRow {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin: string;
  hasFine: boolean;
  fineAmount?: number;
  fineReason?: string;
  paidFine?: boolean;
}

interface AttendanceEntry {
  id: number;
  userName: string;
  eventName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Presente' | 'Tarde' | 'Falta' | 'Justificado';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, CardComponent, TableComponent],
  template: `
    <section class="space-y-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Usuarios</p>
          <h1 class="text-3xl font-semibold text-text">Gestión de usuarios</h1>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <app-button [variant]="viewMode() === 'list' ? 'secondary' : 'primary'" size="sm" (click)="setView('list')">
            Usuarios
          </app-button>
          <app-button [variant]="viewMode() === 'attendance' ? 'primary' : 'secondary'" size="sm" (click)="setView('attendance')">
            Asistencias
          </app-button>
          <app-button [variant]="viewMode() === 'fines' ? 'primary' : 'secondary'" size="sm" (click)="setView('fines')">
            Multas
          </app-button>
          <app-button variant="secondary" size="sm" (click)="generateFineReport()">
            Generar reporte
          </app-button>
          <app-button size="sm">Nuevo usuario</app-button>
        </div>
      </div>

      @if (reportMessage()) {
        <div class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {{ reportMessage() }}
        </div>
      }

      @if (viewMode() === 'attendance') {
        <app-card title="Asistencias" description="Filtra y revisa la asistencia por usuario, evento y estado del registro.">
          <div class="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="grid w-full gap-3 md:grid-cols-3">
              <div class="relative">
                <label class="mb-1 block text-sm font-medium text-text">Buscar</label>
                <input
                  [formControl]="attendanceSearchControl"
                  type="search"
                  placeholder="Nombre o evento"
                  class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-2.5 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-text">Evento</label>
                <select
                  [value]="attendanceEventFilter()"
                  (change)="attendanceEventFilter.set($any($event.target).value)"
                  class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-2.5 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="todos">Todos</option>
                  <option value="Ingreso matutino">Ingreso matutino</option>
                  <option value="Control de salida">Control de salida</option>
                  <option value="Evento especial">Evento especial</option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-text">Estado</label>
                <select
                  [value]="attendanceStatusFilter()"
                  (change)="attendanceStatusFilter.set($any($event.target).value)"
                  class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-2.5 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="todos">Todos</option>
                  <option value="Presente">Presente</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Falta">Falta</option>
                  <option value="Justificado">Justificado</option>
                </select>
              </div>
            </div>

            <app-button variant="secondary" size="sm" (click)="simulateAttendanceCsvUpload()">
              Subir CSV
            </app-button>
          </div>

          <div class="mt-5 grid gap-4 xl:grid-cols-2">
            @for (entry of filteredAttendance(); track entry.id) {
              <article class="rounded-2xl border border-[#e7e7e7] bg-off-white p-4 shadow-sm">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="text-lg font-semibold text-text">{{ entry.userName }}</h3>
                    <p class="text-sm text-text-muted">{{ entry.eventName }}</p>
                  </div>
                  <span class="rounded-full px-2.5 py-1 text-xs font-semibold" [class]="attendanceBadgeClass(entry.status)">
                    {{ entry.status }}
                  </span>
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p class="text-xs uppercase tracking-[0.18em] text-text-muted">Fecha</p>
                    <p class="mt-1 text-sm font-medium text-text">{{ entry.date }}</p>
                  </div>
                  <div>
                    <p class="text-xs uppercase tracking-[0.18em] text-text-muted">Entrada</p>
                    <p class="mt-1 text-sm font-medium text-text">{{ entry.checkIn }}</p>
                  </div>
                  <div>
                    <p class="text-xs uppercase tracking-[0.18em] text-text-muted">Salida</p>
                    <p class="mt-1 text-sm font-medium text-text">{{ entry.checkOut }}</p>
                  </div>
                </div>
              </article>
            }
          </div>

          <div class="mt-6 overflow-hidden rounded-xl border border-[#e7e7e7] bg-white">
            <table class="min-w-full text-left text-sm text-text">
              <thead class="bg-off-white text-text-muted">
                <tr>
                  <th class="px-4 py-3">Evento</th>
                  <th class="px-4 py-3">Presentes</th>
                  <th class="px-4 py-3">Tardes</th>
                  <th class="px-4 py-3">Faltas</th>
                  <th class="px-4 py-3">Justificados</th>
                </tr>
              </thead>
              <tbody>
                @for (summary of attendanceSummary(); track summary.eventName) {
                  <tr class="border-t border-[#e7e7e7]">
                    <td class="px-4 py-3 font-medium">{{ summary.eventName }}</td>
                    <td class="px-4 py-3">{{ summary.present }}</td>
                    <td class="px-4 py-3">{{ summary.late }}</td>
                    <td class="px-4 py-3">{{ summary.absent }}</td>
                    <td class="px-4 py-3">{{ summary.justified }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </app-card>
      } @else if (viewMode() === 'fines') {
        <app-card title="Usuarios con multas" description="Marca las sanciones que ya se han liquidado y genera el reporte del mes.">
          <div class="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p class="text-sm text-text-muted">
              {{ fineUsers().length }} usuarios con multas pendientes
            </p>
            <app-button variant="secondary" size="sm" (click)="generateFineReport()">
              Generar reporte
            </app-button>
          </div>

          <div class="mt-5">
            <app-table
              [data]="fineUsers()"
              [columns]="fineColumns"
              [actions]="[]"
              [selectable]="true"
              [pagination]="{ enabled: true, pageSize: 6, pageSizes: [5, 6, 10] }"
              emptyText="No se encontraron usuarios con multas pendientes."
            >
              <button
                slot="selection-actions"
                type="button"
                class="inline-flex items-center justify-center rounded-md border border-primary bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
                (click)="markSelectedFinesAsPaid()"
              >
                Hecho
              </button>
            </app-table>
          </div>
        </app-card>
      } @else {
        <app-card title="Usuarios registrados" description="Consulta y administra los accesos del sistema.">
          <div class="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="relative w-full md:max-w-md">
              <input
                [formControl]="searchControl"
                type="search"
                placeholder="Buscar por nombre o correo"
                class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-2.5 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
            </div>

            <div class="flex items-center gap-2">
              <span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {{ filteredUsers().length }} usuarios
              </span>
            </div>
          </div>

          <div class="mt-5">
            <app-table
              [data]="filteredUsers()"
              [columns]="columns"
              [actions]="actions"
              [pagination]="{ enabled: true, pageSize: 8, pageSizes: [5, 8, 10, 20] }"
              emptyText="No se encontraron usuarios con esos criterios."
            />
          </div>
        </app-card>
      }
    </section>
  `
})
export class UserManagementComponent {
  @ViewChild(TableComponent) private fineTable?: TableComponent<UserRow>;

  readonly searchControl = new FormControl('');
  readonly attendanceSearchControl = new FormControl('');
  readonly viewMode = signal<'list' | 'attendance' | 'fines'>('list');
  readonly fineMode = signal(false);
  readonly reportMessage = signal('');
  readonly attendanceEventFilter = signal('todos');
  readonly attendanceStatusFilter = signal<'todos' | 'Presente' | 'Tarde' | 'Falta' | 'Justificado'>('todos');

  readonly users = signal<UserRow[]>([
    { id: 1, name: 'Ana', lastName: 'García', email: 'ana.garcia@check.com', role: 'Administrador', active: true, lastLogin: 'Hace 2 h', hasFine: true, fineAmount: 35, fineReason: 'Llegada tarde', paidFine: false },
    { id: 2, name: 'Luis', lastName: 'Mendoza', email: 'luis.mendoza@check.com', role: 'Supervisor', active: true, lastLogin: 'Hoy 08:40', hasFine: false },
    { id: 3, name: 'Carla', lastName: 'Rojas', email: 'carla.rojas@check.com', role: 'Operador', active: false, lastLogin: 'Hace 5 días', hasFine: true, fineAmount: 50, fineReason: 'Ausencia', paidFine: false },
    { id: 4, name: 'Mateo', lastName: 'Silva', email: 'mateo.silva@check.com', role: 'Operador', active: true, lastLogin: 'Hace 1 d', hasFine: true, fineAmount: 25, fineReason: 'Salida temprana', paidFine: false },
    { id: 5, name: 'Elena', lastName: 'Bustos', email: 'elena.bustos@check.com', role: 'Supervisor', active: true, lastLogin: 'Ayer 18:10', hasFine: false },
    { id: 6, name: 'Diego', lastName: 'Navarro', email: 'diego.navarro@check.com', role: 'Operador', active: false, lastLogin: 'Hace 12 días', hasFine: true, fineAmount: 40, fineReason: 'No marcó entrada', paidFine: false },
    { id: 7, name: 'Sofía', lastName: 'Pérez', email: 'sofia.perez@check.com', role: 'Administrador', active: true, lastLogin: 'Hoy 09:15', hasFine: false },
    { id: 8, name: 'Javier', lastName: 'Luna', email: 'javier.luna@check.com', role: 'Operador', active: true, lastLogin: 'Hace 3 h', hasFine: false }
  ]);

  readonly attendanceEntries = signal<AttendanceEntry[]>([
    { id: 1, userName: 'Ana García', eventName: 'Ingreso matutino', date: '2026-09-27', checkIn: '08:04', checkOut: '17:18', status: 'Presente' },
    { id: 2, userName: 'Luis Mendoza', eventName: 'Control de salida', date: '2026-09-27', checkIn: '08:10', checkOut: '17:45', status: 'Tarde' },
    { id: 3, userName: 'Carla Rojas', eventName: 'Ingreso matutino', date: '2026-09-27', checkIn: '08:32', checkOut: '17:09', status: 'Tarde' },
    { id: 4, userName: 'Mateo Silva', eventName: 'Evento especial', date: '2026-09-27', checkIn: '09:00', checkOut: '12:00', status: 'Presente' },
    { id: 5, userName: 'Diego Navarro', eventName: 'Ingreso matutino', date: '2026-09-27', checkIn: '—', checkOut: '—', status: 'Falta' },
    { id: 6, userName: 'Elena Bustos', eventName: 'Control de salida', date: '2026-09-27', checkIn: '08:00', checkOut: '17:15', status: 'Justificado' }
  ]);

  readonly fineUsers = computed(() => this.users().filter(user => user.hasFine));

  readonly filteredUsers = computed(() => {
    const query = (this.searchControl.value ?? '').trim().toLowerCase();

    if (!query) {
      return this.users();
    }

    return this.users().filter(user => {
      const text = `${user.name} ${user.lastName} ${user.email}`.toLowerCase();
      return text.includes(query);
    });
  });

  readonly filteredAttendance = computed(() => {
    const query = (this.attendanceSearchControl.value ?? '').trim().toLowerCase();
    const eventFilter = this.attendanceEventFilter();
    const statusFilter = this.attendanceStatusFilter();

    return this.attendanceEntries().filter(item => {
      const matchesQuery = !query || `${item.userName} ${item.eventName}`.toLowerCase().includes(query);
      const matchesEvent = eventFilter === 'todos' || item.eventName === eventFilter;
      const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;

      return matchesQuery && matchesEvent && matchesStatus;
    });
  });

  readonly attendanceSummary = computed(() => {
    const summary = [
      { eventName: 'Ingreso matutino', present: 0, late: 0, absent: 0, justified: 0 },
      { eventName: 'Control de salida', present: 0, late: 0, absent: 0, justified: 0 },
      { eventName: 'Evento especial', present: 0, late: 0, absent: 0, justified: 0 }
    ];

    for (const entry of this.filteredAttendance()) {
      const item = summary.find(event => event.eventName === entry.eventName);
      if (!item) {
        continue;
      }

      if (entry.status === 'Presente') item.present += 1;
      if (entry.status === 'Tarde') item.late += 1;
      if (entry.status === 'Falta') item.absent += 1;
      if (entry.status === 'Justificado') item.justified += 1;
    }

    return summary;
  });

  readonly columns: TableColumn<UserRow>[] = [
    { key: 'name', header: 'Nombre', render: (row) => `${row.name} ${row.lastName}` },
    { key: 'email', header: 'Correo' },
    { key: 'role', header: 'Rol' },
    {
      key: 'active',
      header: 'Estado',
      render: (row) => row.active
        ? '<span class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Activo</span>'
        : '<span class="inline-flex rounded-full bg-[#f3f4f6] px-2 py-1 text-xs font-semibold text-text-muted">Inactivo</span>'
    },
    { key: 'lastLogin', header: 'Último acceso' }
  ];

  readonly fineColumns: TableColumn<UserRow>[] = [
    { key: 'name', header: 'Usuario', render: (row) => `${row.name} ${row.lastName}` },
    { key: 'email', header: 'Correo' },
    { key: 'fineAmount', header: 'Monto', render: (row) => `$${(row.fineAmount ?? 0).toFixed(2)}` },
    { key: 'fineReason', header: 'Concepto' },
    {
      key: 'paidFine',
      header: 'Estado',
      render: (row) => row.paidFine
        ? '<span class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Pagada</span>'
        : '<span class="inline-flex rounded-full bg-[#f3f4f6] px-2 py-1 text-xs font-semibold text-text-muted">Pendiente</span>'
    }
  ];

  readonly actions = [
    {
      label: 'Editar',
      variant: 'ghost' as const,
      action: (row: UserRow) => this.editUser(row)
    },
    {
      label: 'Desactivar',
      variant: 'secondary' as const,
      action: (row: UserRow) => this.toggleUser(row)
    }
  ];

  setView(mode: 'list' | 'attendance' | 'fines'): void {
    this.viewMode.set(mode);
    this.reportMessage.set('');
  }

  toggleFineMode(): void {
    this.viewMode.set(this.viewMode() === 'fines' ? 'list' : 'fines');
    this.reportMessage.set('');
  }

  generateFineReport(): void {
    const pendingUsers = this.users().filter(user => user.hasFine).length;

    if (pendingUsers === 0) {
      this.reportMessage.set('No hay multas pendientes para generar un reporte.');
      return;
    }

    this.reportMessage.set(`Reporte generado para ${pendingUsers} usuarios con multas pendientes.`);
  }

  simulateAttendanceCsvUpload(): void {
    this.reportMessage.set('Se cargó la plantilla de asistencia correctamente.');
  }

  markSelectedFinesAsPaid(): void {
    const selected = this.fineTable?.selectedRows() ?? [];

    if (selected.length === 0) {
      this.reportMessage.set('Selecciona al menos un usuario para marcar la multa como pagada.');
      return;
    }

    this.users.update(items => items.map(item => {
      const isSelected = selected.some(row => row.id === item.id);
      if (!isSelected) {
        return item;
      }

      return {
        ...item,
        hasFine: false,
        paidFine: true,
        fineAmount: 0,
        fineReason: 'Pagada',
        active: true
      };
    }));

    this.fineTable?.selectedIds.set(new Set());
    this.reportMessage.set(`${selected.length} multa${selected.length > 1 ? 's' : ''} marcada${selected.length > 1 ? 's' : ''} como pagada${selected.length > 1 ? 's' : ''}.`);
  }

  attendanceBadgeClass(status: AttendanceEntry['status']): string {
    switch (status) {
      case 'Presente':
        return 'bg-green-100 text-green-700';
      case 'Tarde':
        return 'bg-amber-100 text-amber-700';
      case 'Falta':
        return 'bg-red-100 text-red-700';
      case 'Justificado':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-[#f3f4f6] text-text-muted';
    }
  }

  private editUser(row: UserRow): void {
    // UI-only placeholder for the user management view.
    return;
  }

  private toggleUser(row: UserRow): void {
    this.users.update(items => items.map(item => item.id === row.id ? { ...item, active: !item.active } : item));
  }
}
