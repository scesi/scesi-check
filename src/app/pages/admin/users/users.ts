import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
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

        <app-button size="sm">Nuevo usuario</app-button>
      </div>

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
    </section>
  `
})
export class UserManagementComponent {
  readonly searchControl = new FormControl('');

  readonly users = signal<UserRow[]>([
    { id: 1, name: 'Ana', lastName: 'García', email: 'ana.garcia@check.com', role: 'Administrador', active: true, lastLogin: 'Hace 2 h' },
    { id: 2, name: 'Luis', lastName: 'Mendoza', email: 'luis.mendoza@check.com', role: 'Supervisor', active: true, lastLogin: 'Hoy 08:40' },
    { id: 3, name: 'Carla', lastName: 'Rojas', email: 'carla.rojas@check.com', role: 'Operador', active: false, lastLogin: 'Hace 5 días' },
    { id: 4, name: 'Mateo', lastName: 'Silva', email: 'mateo.silva@check.com', role: 'Operador', active: true, lastLogin: 'Hace 1 d' },
    { id: 5, name: 'Elena', lastName: 'Bustos', email: 'elena.bustos@check.com', role: 'Supervisor', active: true, lastLogin: 'Ayer 18:10' },
    { id: 6, name: 'Diego', lastName: 'Navarro', email: 'diego.navarro@check.com', role: 'Operador', active: false, lastLogin: 'Hace 12 días' },
    { id: 7, name: 'Sofía', lastName: 'Pérez', email: 'sofia.perez@check.com', role: 'Administrador', active: true, lastLogin: 'Hoy 09:15' },
    { id: 8, name: 'Javier', lastName: 'Luna', email: 'javier.luna@check.com', role: 'Operador', active: true, lastLogin: 'Hace 3 h' }
  ]);

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

  private editUser(row: UserRow): void {
    // UI-only placeholder for the user management view.
    return;
  }

  private toggleUser(row: UserRow): void {
    this.users.update(items => items.map(item => item.id === row.id ? { ...item, active: !item.active } : item));
  }
}
