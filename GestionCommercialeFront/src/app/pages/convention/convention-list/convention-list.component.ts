import { Component, OnInit } from '@angular/core';
import { ConventionService } from '../../../services/convention.service';
import { ClientService } from '../../../services/client.service';
import { ApplicationService } from '../../../services/application.service';
import { Convention } from '../../../models/convention.model';
import { Client } from '../../../models/client.model';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'app-convention-list',
  standalone: false,
  templateUrl: './convention-list.component.html',
  styleUrls: ['./convention-list.component.css']
})
export class ConventionListComponent implements OnInit {
  conventions: (Convention & { clientName: string, applicationName: string })[] = []; // Add extra properties to Convention type
  filteredConventions: any[] = [];
  clients: Client[] = [];
  applications: Application[] = [];
  searchValue: string = '';
  selectedFilter: string = 'code';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  pageSizeOptions: number[] = [5, 10, 20];

  constructor(
    private conventionService: ConventionService,
    private clientService: ClientService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.conventionService.getAllConventions().subscribe(conventions => {
      this.clientService.getAllClients().subscribe(clients => {
        this.applicationService.getAllApplications().subscribe(applications => {
          this.clients = clients;
          this.applications = applications;

        
          this.conventions = conventions.map(convention => ({
            ...convention,
            clientName: this.clients.find(c => c.id === convention.client.id)?.intitule || 'Unknown',
            applicationName: this.applications.find(a => a.id === convention.application.id)?.intitule || 'Unknown'
          }) as Convention & { clientName: string, applicationName: string }); 
          this.conventions.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

          this.filteredConventions = this.filterConventions(); 
        });
      });
    });
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    this.currentPage = 1;
    this.filteredConventions = this.filterConventions();
  }

  clearFilter(): void {
    this.searchValue = '';
    this.filteredConventions = this.filterConventions();
  }
  applyFilter(): void {
    this.filteredConventions = this.filterConventions();  
  }
  

  filterConventions(): any[] {
    const value = this.searchValue.toLowerCase();

    return this.conventions.filter(convention => {
      let fieldValue = '';

      
      if (this.selectedFilter === 'clientName') {
        fieldValue = convention.clientName?.toLowerCase() || '';
      } else if (this.selectedFilter === 'applicationName') {
        fieldValue = convention.applicationName?.toLowerCase() || '';
      } else {
        const v = (convention as any)[this.selectedFilter];
      fieldValue = v != null ? v.toString().toLowerCase() : '';
        
      }

      
      return fieldValue.includes(value);
    });
  }

  sortTable(column: string): void {

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredConventions.sort((a, b) => {
      const valueA = (a[column] || '').toString().toLowerCase();
      const valueB = (b[column] || '').toString().toLowerCase();
      return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  }

  paginatedConventions(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredConventions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePageSize(size: number): void {
    this.itemsPerPage = size;
    this.currentPage = 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  totalPages(): number {
    return Math.ceil(this.filteredConventions.length / this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  deleteConvention(uuid: string): void {
    if (confirm('Are you sure you want to delete this Convention?')) {
      this.conventionService.deleteConvention(uuid).subscribe(() => {
        this.conventions = this.conventions.filter(convention => convention.uuid !== uuid);
        this.filteredConventions = [...this.conventions]; // Update filtered conventions
      });
    }
  }

 
  printFiltered(): void {
    const term = this.searchValue.trim();
    if (!term) return;
  
    if (this.selectedFilter === 'applicationName') {
      const app = this.applications.find(a => a.intitule.toLowerCase() === term.toLowerCase());
      if (!app) return;
      this.conventionService.printByApplication(app.id).subscribe(blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      });
  
    } else if (this.selectedFilter === 'clientName') {
      const cli = this.clients.find(c => c.intitule.toLowerCase() === term.toLowerCase());
      if (!cli) return;
      this.conventionService.printByClient(cli.id!).subscribe(blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      });
  
    } else if (this.selectedFilter === 'code') {
      const code = term;
      this.conventionService.printByCode(code).subscribe({
        next: blob => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: err => alert(`Erreur lors de l’impression de la convention « ${code} »`)
      });
    }
  }
  
  isExpired(endDate: string): boolean {
    return new Date(endDate) < new Date();
  }
  

  private downloadPdf(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  canPrint(): boolean {
    return ['applicationName', 'clientName', 'code'].includes(this.selectedFilter)
      && !!this.searchValue.trim();
  }
}
