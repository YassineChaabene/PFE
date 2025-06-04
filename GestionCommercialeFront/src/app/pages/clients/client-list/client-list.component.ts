import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: false,
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];

  searchValue = '';
  selectedFilter = 'intitule';

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSizeOptions: (number | 'All')[] = [5, 10, 20, 'All'];
  itemsPerPage: number | 'All' = 5;
  currentPage = 1;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.getClients();
  }

  private getClients(): void {
    this.clientService.getAllClients().subscribe({
      next: data => {
        this.clients = data;
        this.filteredClients = [...data];
      },
      error: err => console.error('Error fetching clients', err)
    });
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    const v = this.searchValue.trim().toLowerCase();
    if (!v) {
      this.filteredClients = [...this.clients];
    } else {
      this.filteredClients = this.clients.filter(c => {
        const val = (c as any)[this.selectedFilter]?.toString().toLowerCase() || '';
        return val.includes(v);
      });
    }
    this.currentPage = 1;
  }

  clearFilter(): void {
    this.searchValue = '';
    this.applyFilter();
  }

  deleteClient(uuid: string): void {
    if (!confirm('Delete this client?')) return;
    this.clientService.deleteClient(uuid).subscribe(() => {
      this.clients = this.clients.filter(c => c.uuid !== uuid);
      this.applyFilter();
    });
  }

  sortTable(column: keyof Client): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredClients.sort((a, b) => {
      const A = (a[column] ?? '').toString().toLowerCase();
      const B = (b[column] ?? '').toString().toLowerCase();
      if (A < B) return this.sortDirection === 'asc' ? -1 : 1;
      if (A > B) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  paginatedClients(): Client[] {
    if (this.itemsPerPage === 'All') return this.filteredClients;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredClients.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    const pages = this.totalPages();
    if (page >= 1 && page <= pages.length) {
      this.currentPage = page;
    }
  }

  totalPages(): number[] {
    const count =
      this.itemsPerPage === 'All'
        ? 1
        : Math.ceil(
            this.filteredClients.length /
              (this.itemsPerPage as number)
          );
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  changePageSize(size: number | 'All'): void {
    this.itemsPerPage = size;
    this.currentPage = 1;
  }
}
