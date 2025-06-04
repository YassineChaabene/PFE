import { Component, OnInit } from '@angular/core';
import { Facture } from '../../../models/facture.model';
import { Convention } from '../../../models/convention.model';
import { FactureService } from '../../../services/facture.service';
import { ConventionService } from '../../../services/convention.service';

@Component({
  standalone: false,
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css']
})
export class FactureListComponent implements OnInit {
  factures: (Facture & { conventionCode: string })[] = [];
  filteredFactures: (Facture & { conventionCode: string })[] = [];
  searchValue: string = '';
  selectedFilter: string = 'reference';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 20];
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  conventions: Convention[] = [];

  constructor(
    private factureService: FactureService,
    private conventionService: ConventionService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }
  
  fetchData(): void {
    this.conventionService.getAllConventions().subscribe(conventions => {
      this.factureService.getAllFactures().subscribe(factures => {
        this.factures = factures.map(facture => ({
          ...facture,
          conventionCode: conventions.find(c => c.uuid === facture.conventionUuid)?.code || 'Unknown'
        }));
        this.factures.sort((a, b) =>
          new Date(b.dateEmission).getTime() - new Date(a.dateEmission).getTime()
        );

        this.filteredFactures = [...this.factures];
        
      });
    });
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  clearFilter(): void {
    this.searchValue = '';
    this.applyFilter();
  }

  applyFilter(): void {
    const value = this.searchValue.toLowerCase();
    this.filteredFactures = this.factures.filter(facture => {
      const fieldValue =
        this.selectedFilter === 'conventionCode'
          ? facture.conventionCode?.toLowerCase()
          : facture[this.selectedFilter as keyof Facture]?.toString().toLowerCase();
      return fieldValue?.includes(value);
    });
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredFactures.sort((a, b) => {
      const valA = (a[column as keyof typeof a] || '').toString().toLowerCase();
      const valB = (b[column as keyof typeof b] || '').toString().toLowerCase();
      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  paginatedFactures(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFactures.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  totalPages(): number {
    return Math.ceil(this.filteredFactures.length / this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  changePageSize(size: number): void {
    this.itemsPerPage = size;
    this.currentPage = 1;
  }

  deleteFacture(uuid: string): void {
    if (confirm('Voulez vous vraiment supprimer cette facture ?')) {
      this.factureService.deleteFacture(uuid).subscribe(() => {
        this.factures = this.factures.filter(f => f.uuid !== uuid);
        this.filteredFactures = [...this.factures];
      });
    }
  }
  printFacture(uuid: string): void {
    this.factureService.printFacture(uuid).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }
}
