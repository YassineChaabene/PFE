import { Component } from '@angular/core';
import { Application } from '../../../models/application.model';
import { ApplicationService } from '../../../services/application.service';
@Component({
  selector: 'app-app-cards',
  standalone: false,
  templateUrl: './app-cards.component.html',
  styleUrl: './app-cards.component.css'
})
export class AppCardsComponent {
  applications :Application[]=[]
  selectedFilter: string = 'intitule';
  filteredApplications: Application[] = [];
  priceFilter: number = 0; // Valeur initiale du slider
  maxPrice: number = 0; 
  constructor(private applicationService: ApplicationService) {}
  
  
  // Pagination
   pageSizeOptions: (number | string)[] = [5, 10, 20, 'All'];
   itemsPerPage: number = 5; // Default is 5
   currentPage: number = 1;

   //sorting
   sortColumn: keyof Application | '' = '';
   sortDirection: 'asc' | 'desc' = 'asc';
 
  
  searchValue: string = '';
  ngOnInit(): void {
    this.getApplications();
    
  }
  
  getApplications(): void {
    this.applicationService.getAllApplications().subscribe(
      (data) => {
        this.applications = data;
        this.filteredApplications = [...data];


         // Initialise le filtre au prix max
      },
      (error) => {
        console.error('Error fetching Applications', error);
      }
      
    );
  }
  
  setFilter(filterType: string): void {
    this.selectedFilter = filterType;
    this.applyFilter();
  }
  applyFilter(): void {
    const value = this.searchValue.toLowerCase();
  
    this.filteredApplications = this.applications.filter(application => {
      const matchText =
        !this.searchValue ||
        (this.selectedFilter === 'abreviation' && application.abreviation.toLowerCase().includes(value)) ||
        (this.selectedFilter === 'intitule' && application.intitule.toLowerCase().includes(value)) ||
        (this.selectedFilter === 'description' && application.description.toLowerCase().includes(value)) ||
        (this.selectedFilter === 'responsable' && application.responsable.nom.toLowerCase().includes(value));

  
     

  
      return matchText ;
    });
  }
  
      clearFilter(): void {
        this.searchValue = '';
        this.filteredApplications = [...this.applications];
        this.priceFilter = this.maxPrice;
        
      }
      deleteApplication(uuid: string): void {
        if (confirm('êtes vous sur?')) {
          this.applicationService.deleteApplication(uuid).subscribe(() => {
            this.applications = this.applications.filter(application => application.uuid !== uuid);
            this.filteredApplications = this.filteredApplications.filter(application => application.uuid !== uuid);
          });
        }
      }
      sortTable(column: keyof Application): void {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortDirection = 'asc';
        }
    
        this.filteredApplications.sort((a, b) => {
          const A = String(a[column] ?? '').toLowerCase();
          const B = String(b[column] ?? '').toLowerCase();
          if (A < B) return this.sortDirection === 'asc' ? -1 : 1;
          if (A > B) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
        this.currentPage = 1;
      }
    

      paginatedApplication(): Application[] {
            // If itemsPerPage matches the total filtered clients, show all
            // (This happens if the user selects "All")
            if (this.itemsPerPage === this.filteredApplications.length) {
              return this.filteredApplications;
            }
        
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredApplications.slice(startIndex, startIndex + this.itemsPerPage);
          }
        
          changePage(page: number): void {
            if (page >= 1 && page <= this.totalPages()) {
              this.currentPage = page;
            }
          }
        
          totalPages(): number {
            return Math.ceil(this.filteredApplications.length / this.itemsPerPage);
          }
        
          totalPagesArray(): number[] {
            return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
          }
        
          changePageSize(size: number | string): void {
            if (size === 'All') {
              // Show all clients by setting itemsPerPage = filteredClients.length
              this.itemsPerPage = this.filteredApplications.length;
            } else {
              this.itemsPerPage = Number(size);
            }
            this.currentPage = 1; // Reset to first page
          }

  
}
