import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  standalone  : false,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  searchValue: string = '';
  selectedFilter: string = 'email';

  sortColumn: string = '';
  sortDirection: boolean = true; // true = ascending, false = descending

  // Pagination
  pageSizeOptions: (number | string)[] = [5, 10, 20, 'All'];
  itemsPerPage: number = 5; // Default is 5
  currentPage: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user,
          showPassword: false // Initialize showPassword for each user
        }));
        this.filteredUsers = [...this.users];
      },
      error: (error) => console.error('Error fetching users', error)
    });
  }


  togglePasswordVisibility(user: User): void {
    if (user) {
      user.showPassword = !user.showPassword;
    }
  }

  setFilter(filterType: string): void {
    this.selectedFilter = filterType;
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchValue) {
      this.filteredUsers = [...this.users];
      return;
    }
    const value = this.searchValue.toLowerCase();

    this.filteredUsers = this.users.filter(user => {
      switch (this.selectedFilter) {
        
        case 'email':
          return user.email.toLowerCase().includes(value);
        case 'nom':
          return user.name.toLowerCase().includes(value);
        case 'role':
          return user.role?.toLowerCase().includes(value);
        default:
          return false;
      }
    });
    // Reset to first page after filtering
    this.currentPage = 1;
  }

  clearFilter(): void {
    this.searchValue = '';
    this.filteredUsers = [...this.users];
    this.currentPage = 1;
  }

  deleteUser(uuid: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(uuid).subscribe(() => {
        this.users = this.users.filter(user => user.uuid !== uuid);
        this.filteredUsers = this.filteredUsers.filter(user => user.uuid !== uuid);
      });
    }
  }

  // **Sorting Function**
  sortTable(column: keyof User): void {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection; 
    } else {
      this.sortColumn = column;
      this.sortDirection = true;
    }
  
    this.filteredUsers.sort((a, b) => {
      const valueA = String(a[column] ?? '').toLowerCase();
      const valueB = String(b[column] ?? '').toLowerCase();
  
      if (valueA < valueB) return this.sortDirection ? -1 : 1;
      if (valueA > valueB) return this.sortDirection ? 1 : -1;
      return 0;
    });
  }

  // **Pagination Methods**
  paginatedUsers(): User[] {
    // If itemsPerPage matches the total filtered users, show all
    if (this.itemsPerPage === this.filteredUsers.length) {
      return this.filteredUsers;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  changePageSize(size: number | string): void {
    if (size === 'All') {
      this.itemsPerPage = this.filteredUsers.length;
    } else {
      this.itemsPerPage = Number(size);
    }
    this.currentPage = 1; // Reset to first page
  }
}