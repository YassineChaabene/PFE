import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './pages/clients/client-list/client-list.component';
import { ClientFormComponent } from './pages/clients/client-form/client-form.component';
import { ClientUpdateComponent } from './pages/clients/client-update/client-update.component';

import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './../app/pages/auth/auth.guard';
import { AppCardsComponent } from './pages/Applications/app-cards/app-cards.component';
import { AppFormComponent } from './pages/Applications/app-form/app-form.component';
import { AppUpdateComponent } from './pages/Applications/app-update/app-update.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { ConventionListComponent } from './pages/convention/convention-list/convention-list.component';
import { UserUpdateComponent } from './pages/users/user-update/user-update.component';
import { ConventionFormComponent } from './pages/convention/convention-form/convention-form.component';
import { ConventionUpdateComponent } from './pages/convention/convention-update/convention-update.component';
import { FactureListComponent } from './pages/Factures/facture-list/facture-list.component';
import { FactureFormComponent } from './pages/Factures/facture-form/facture-form.component';
import { FactureUpdateComponent } from './pages/Factures/facture-update/facture-update.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard/admin-dashboard.component';
import { UserProfileComponent } from './pages/users/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
      // Add registration, password recovery, etc.
    ]
  },
  { path: 'app',
    component: MainLayoutComponent,
    canActivate:[ AuthGuard ],  
    children: [
       // • USER routes
       {
        path: 'clients',
        component: ClientListComponent,
        data: { roles: ['USER', 'SUPERUSER'] }
      },
      {
        path: 'applications',
        component: AppCardsComponent,
        data: { roles: ['USER', 'SUPERUSER'] }
      },
      {
        path: 'conventions',
        component: ConventionListComponent,
        data: { roles: ['USER', 'SUPERUSER'] }
      },
      {
        path: 'factures',
        component: FactureListComponent,
        data: { roles: ['USER', 'SUPERUSER'] }
      },
      
      // • ADMIN routes
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        data: { roles: ['ADMIN'] }
      },
      { 
        path: 'users',
        component: UserListComponent,
        data: { roles: ['ADMIN', 'SUPERUSER'] }
      },
      { 
        path: 'user/profile',
        component: UserProfileComponent,
        data: { roles: ['ADMIN', 'SUPERUSER','USER'] }
      },

  { path: 'clients/add', component: ClientFormComponent },
  { path: 'client-update/:uuid', component: ClientUpdateComponent },
   {path:'applications/add', component: AppFormComponent},
   {path:'application-update/:uuid', component: AppUpdateComponent },
   { path: 'conventions/add', component: ConventionFormComponent },
   { path: 'users/add', component: UserFormComponent },
   {path: 'user-update/:uuid', component: UserUpdateComponent },
   { path: 'convention-update/:uuid', component: ConventionUpdateComponent},
  { path: 'factures/add', component: FactureFormComponent },
  {path: 'facture-update/:uuid', component: FactureUpdateComponent},

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
