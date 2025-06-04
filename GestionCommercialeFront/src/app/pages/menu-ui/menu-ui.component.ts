import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  link: string;
  roles: string[];
}

@Component({
  standalone: false,
  selector: 'app-menu-ui',
  templateUrl: './menu-ui.component.html',
  styleUrls: ['./menu-ui.component.css']
})
export class MenuUiComponent implements OnInit {
  role = '';
  menu: MenuItem[] = [];
  visibleMenu: MenuItem[] = [];
  isCollapsed = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.handleResize();
    this.menu = [
      { label: 'Clients',         icon: 'bi bi-people',            link: '/app/clients',      roles: ['USER', 'SUPERUSER'] },
      { label: 'Applications',    icon: 'bi bi-app-indicator',     link: '/app/applications', roles: ['USER', 'SUPERUSER'] },
      { label: 'Conventions',     icon: 'bi bi-file-earmark-text', link: '/app/conventions',  roles: ['USER', 'SUPERUSER'] },
      { label: 'Factures',        icon: 'bi bi-cash-stack',        link: '/app/factures',     roles: ['USER', 'SUPERUSER'] },
      { label: 'Tableau de bord', icon: 'bi bi-speedometer2',      link: '/app/dashboard',    roles: ['ADMIN'] },
      { label: 'Utilisateurs',    icon: 'bi bi-shield-lock',       link: '/app/users',        roles: ['ADMIN', 'SUPERUSER'] },
      { label: 'Profile',    icon: 'fas fa-user-circle me-1',       link: '/app/user/profile',        roles: ['ADMIN', 'SUPERUSER','USER'] },
    ];

    const roleFromToken = this.authService.getUserRoleFromToken();

    if (roleFromToken) {
      this.role = roleFromToken.toUpperCase();
      this.visibleMenu = this.menu.filter(item =>
        item.roles.map(r => r.toUpperCase()).includes(this.role)
      );
    } else {
      console.warn('No valid role found in token.');
      this.visibleMenu = [];
    }
  }
  @HostListener('window:resize')
  handleResize(): void {
    this.isCollapsed = window.innerWidth < 768;
  }
}
