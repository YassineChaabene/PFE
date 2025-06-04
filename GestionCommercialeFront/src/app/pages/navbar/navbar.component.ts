import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConventionService } from '../../services/convention.service';
import { Convention } from '../../models/convention.model';
import { AuthService } from '../../services/auth.service';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  notifications: Convention[] = [];
  showNotifications = false;
  loading = false;
  showBell = false;
  userName = '';
  nbconventions = 0;
  parentTitle: string = '';
childTitle: string = '';

  constructor(
    private router: Router,
    private conventionService: ConventionService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.showBell = this.router.url.includes('/app/conventions');
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.showBell = e.urlAfterRedirects.includes('/app/conventions');
      });

    this.conventionService.getExpiringSoon().subscribe({
      next: list => {
        this.notifications = list;
        this.nbconventions = list.length;
      },
      error: () => {
        this.notifications = [];
      }

    });

  
    const nameFromToken = this.authService.getNameFromToken();
    this.userName = nameFromToken ?? '';
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setCurrentTitle(this.router.url);
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  get unreadCount(): number {
    return this.notifications.length;
  }
  sendEmail(to: string, code: string, endDate: string) {
    this.conventionService.sendAlertEmail(to, code, endDate).subscribe({
      next: () => {
        this.snackBar.open('✅ Email envoyé avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: () => {
        this.snackBar.open('❌ Échec de l\'envoi de l\'email', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
  

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
 

setCurrentTitle(url: string): void {
  if (url.includes('dashboard')) {
    this.parentTitle = 'Tableau de bord';
    this.childTitle = '';

  } else if (url.includes('clients/add')) {
    this.parentTitle = 'Gestion des clients';
    this.childTitle = 'Ajout d’un client';
  } else if (url.includes('client-update')) {
    this.parentTitle = 'Gestion des clients';
    this.childTitle = 'Modification d’un client';
  } else if (url.includes('clients')) {
    this.parentTitle = 'Gestion des clients';
    this.childTitle = '';

  } else if (url.includes('applications/add')) {
    this.parentTitle = 'Gestion des applications';
    this.childTitle = 'Ajout d’une application';
  } else if (url.includes('application-update')) {
    this.parentTitle = 'Gestion des applications';
    this.childTitle = 'Modification d’une application';
  } else if (url.includes('applications')) {
    this.parentTitle = 'Gestion des applications';
    this.childTitle = '';

  } else if (url.includes('conventions/add')) {
    this.parentTitle = 'Gestion des conventions';
    this.childTitle = 'Ajout d’une convention';
  } else if (url.includes('convention-update')) {
    this.parentTitle = 'Gestion des conventions';
    this.childTitle = 'Modification d’une convention';
  } else if (url.includes('conventions')) {
    this.parentTitle = 'Gestion des conventions';
    this.childTitle = '';

  } else if (url.includes('factures/add')) {
    this.parentTitle = 'Gestion des factures';
    this.childTitle = 'Ajout d’une facture';
  } else if (url.includes('facture-update')) {
    this.parentTitle = 'Gestion des factures';
    this.childTitle = 'Modification d’une facture';
  } else if (url.includes('factures')) {
    this.parentTitle = 'Gestion des factures';
    this.childTitle = '';

  } else if (url.includes('users/add')) {
    this.parentTitle = 'Gestion des utilisateurs';
    this.childTitle = 'Ajout d’un utilisateur';
  } else if (url.includes('user-update')) {
    this.parentTitle = 'Gestion des utilisateurs';
    this.childTitle = 'Modification d’un utilisateur';
  } else if (url.includes('users')) {
    this.parentTitle = 'Gestion des utilisateurs';
    this.childTitle = '';

  } else {
    this.parentTitle = '';
    this.childTitle = '';
  }
}

}

