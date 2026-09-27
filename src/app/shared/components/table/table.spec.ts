import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableComponent, TableColumn, TableAction } from './table';
import { vi, describe, it, expect, beforeEach } from 'vitest';

interface TestRow {
  id: number;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

describe('TableComponent', () => {
  let component: TableComponent<TestRow>;
  let fixture: ComponentFixture<TableComponent<TestRow>>;

  const mockColumns: TableColumn<TestRow>[] = [
    { key: 'name', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'status', header: 'Estado', sortable: false },
    { key: 'createdAt', header: 'Creado', sortable: true }
  ];

  const mockData: TestRow[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@test.com', status: 'Activo', createdAt: '2024-01-15' },
    { id: 2, name: 'María García', email: 'maria@test.com', status: 'Inactivo', createdAt: '2024-01-16' },
    { id: 3, name: 'Carlos López', email: 'carlos@test.com', status: 'Activo', createdAt: '2024-01-17' }
  ];

  const mockActions: TableAction<TestRow>[] = [
    { label: 'Editar', variant: 'secondary', action: vi.fn() },
    { label: 'Eliminar', variant: 'danger', action: vi.fn() }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent<TestRow>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('actions', mockActions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table element', () => {
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
    expect(table.nativeElement.classList).toContain('table');
  });

  it('should render header with column names', () => {
    const headers = fixture.debugElement.queryAll(By.css('th'));
    expect(headers.length).toBe(5); // 4 columns + 1 actions
    expect(headers[0].nativeElement.textContent).toContain('Nombre');
    expect(headers[1].nativeElement.textContent).toContain('Email');
    expect(headers[2].nativeElement.textContent).toContain('Estado');
    expect(headers[3].nativeElement.textContent).toContain('Creado');
    expect(headers[4].nativeElement.textContent).toContain('Acciones');
  });

  it('should render data rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(3);
  });

  it('should display cell values correctly', () => {
    const firstRow = fixture.debugElement.query(By.css('tbody tr'));
    const cells = firstRow.queryAll(By.css('td'));
    expect(cells[0].nativeElement.textContent).toContain('Juan Pérez');
    expect(cells[1].nativeElement.textContent).toContain('juan@test.com');
    expect(cells[2].nativeElement.textContent).toContain('Activo');
  });

  it('should show loading state when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const loading = fixture.debugElement.query(By.css('.table-loading'));
    expect(loading).toBeTruthy();
    expect(loading.nativeElement.textContent).toContain('Cargando...');
  });

  it('should show empty state when no data', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();

    const empty = fixture.debugElement.query(By.css('.table-empty'));
    expect(empty).toBeTruthy();
    expect(empty.nativeElement.textContent).toContain('No hay datos disponibles');
  });

  it('should sort by column when clicked', () => {
    const nameHeader = fixture.debugElement.query(By.css('th.sortable'));
    expect(nameHeader).toBeTruthy();
    
    nameHeader.nativeElement.click();
    fixture.detectChanges();
    
    expect(component.sortColumn()).toBe('name');
    expect(component.sortDirection()).toBe('asc');
  });

  it('should toggle sort direction on second click', () => {
    const nameHeader = fixture.debugElement.query(By.css('th.sortable'));
    
    nameHeader.nativeElement.click();
    fixture.detectChanges();
    expect(component.sortDirection()).toBe('asc');
    
    nameHeader.nativeElement.click();
    fixture.detectChanges();
    expect(component.sortDirection()).toBe('desc');
  });

  it('should paginate data', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Usuario ${i + 1}`,
      email: `user${i + 1}@test.com`,
      status: 'Activo',
      createdAt: '2024-01-15'
    }));
    
    fixture.componentRef.setInput('data', largeData);
    fixture.componentRef.setInput('pagination', { enabled: true, pageSize: 10, pageSizes: [5, 10, 25, 50] });
    fixture.detectChanges();

    const pagination = fixture.debugElement.query(By.css('.table-pagination'));
    expect(pagination).toBeTruthy();
    
    const pageInfo = fixture.debugElement.query(By.css('.pagination-info'));
    expect(pageInfo.nativeElement.textContent).toContain('1 - 10 de 25');
  });

  it('should navigate to next page', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Usuario ${i + 1}`,
      email: `user${i + 1}@test.com`,
      status: 'Activo',
      createdAt: '2024-01-15'
    }));
    
    fixture.componentRef.setInput('data', largeData);
    fixture.componentRef.setInput('pagination', { enabled: true, pageSize: 10, pageSizes: [5, 10, 25, 50] });
    fixture.detectChanges();

    const nextBtn = fixture.debugElement.queryAll(By.css('.pagination-controls button'))[2];
    nextBtn.nativeElement.click();
    fixture.detectChanges();

    expect(component.currentPage()).toBe(2);
  });

  it('should render action buttons', () => {
    const firstRow = fixture.debugElement.query(By.css('tbody tr'));
    const actionButtons = firstRow.queryAll(By.css('td:last-child button'));
    expect(actionButtons.length).toBe(2);
  });

  it('should call action when button clicked', () => {
    const editAction = vi.fn();
    const actions: TableAction<TestRow>[] = [
      { label: 'Editar', action: editAction }
    ];
    
    fixture.componentRef.setInput('actions', actions);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    
    expect(editAction).toHaveBeenCalledWith(mockData[0]);
  });

  it('should not render sortable indicator for non-sortable columns', () => {
    const statusHeader = fixture.debugElement.queryAll(By.css('th'))[2];
    expect(statusHeader.nativeElement.classList).not.toContain('sortable');
  });

  it('should render selection checkbox when selectable', () => {
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();

    const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
    expect(checkboxes.length).toBe(4); // header + 3 rows
  });

  it('should toggle row selection', () => {
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();

    const firstCheckbox = fixture.debugElement.queryAll(By.css('tbody input[type="checkbox"]'))[0];
    firstCheckbox.nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedRows().length).toBe(1);
    expect(component.selectedRows()[0].id).toBe(1);
  });

  it('should show selection bar when rows selected', () => {
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();

    const firstCheckbox = fixture.debugElement.queryAll(By.css('tbody input[type="checkbox"]'))[0];
    firstCheckbox.nativeElement.click();
    fixture.detectChanges();

    const selectionBar = fixture.debugElement.query(By.css('.selection-bar'));
    expect(selectionBar).toBeTruthy();
    expect(selectionBar.nativeElement.textContent).toContain('1 seleccionados');
  });

  it('should toggle select all', () => {
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();

    const headerCheckbox = fixture.debugElement.query(By.css('thead input[type="checkbox"]'));
    headerCheckbox.nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedRows().length).toBe(3);
  });

  it('should apply custom render function', () => {
    const customColumns: TableColumn<TestRow>[] = [
      { 
        key: 'status', 
        header: 'Estado', 
        render: (row, value) => `<span class="badge badge-${value === 'Activo' ? 'success' : 'danger'}">${value}</span>`
      }
    ];

    fixture.componentRef.setInput('columns', customColumns);
    fixture.detectChanges();

    const firstRow = fixture.debugElement.query(By.css('tbody tr'));
    const statusCell = firstRow.queryAll(By.css('td'))[0];
    expect(statusCell.nativeElement.innerHTML).toContain('badge-success');
  });

  it('should track by id by default', () => {
    expect(component.trackBy()(mockData[0])).toBe(1);
  });
});