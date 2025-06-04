import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConventionFormComponent } from './pages/convention/convention-form/convention-form.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { ClientUpdateComponent } from './pages/clients/client-update/client-update.component';
import { ClientFormComponent } from './pages/clients/client-form/client-form.component';
import { ClientListComponent } from './pages/clients/client-list/client-list.component';
import { AppCardsComponent } from './pages/Applications/app-cards/app-cards.component';
import { AppFormComponent } from './pages/Applications/app-form/app-form.component';
import { AppUpdateComponent } from './pages/Applications/app-update/app-update.component';
import { MenuUiComponent } from './pages/menu-ui/menu-ui.component';
import { ConventionListComponent } from './pages/convention/convention-list/convention-list.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { UserUpdateComponent } from './pages/users/user-update/user-update.component';
import { ConventionUpdateComponent } from './pages/convention/convention-update/convention-update.component';
import { FactureListComponent } from './pages/Factures/facture-list/facture-list.component';
import { FactureFormComponent } from './pages/Factures/facture-form/facture-form.component';
import { FactureUpdateComponent } from './pages/Factures/facture-update/facture-update.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard/admin-dashboard.component';
import { ConventionsChartComponent } from './pages/admin-dashboard/admin-dashboard/conventions-chart.component';
import { InvoiceStatusChartComponent } from './pages/admin-dashboard/admin-dashboard/invoice-status-chart.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ClientsByRegionChartComponent } from './pages/admin-dashboard/clients-by-region-chart/clients-by-region-chart.component';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserProfileComponent } from './pages/users/user-profile/user-profile.component';
import { ConventionsByMonthChartComponent } from './pages/admin-dashboard/admin-dashboard/conventions-chart-by-month';
import { FacturesRevenueChartComponent } from './pages/admin-dashboard/admin-dashboard/factures-revenue-chart.component';

@NgModule({

  declarations: [
    ConventionUpdateComponent,
    ConventionFormComponent,
    UserListComponent,
    UserFormComponent,
    ClientUpdateComponent,
    ClientFormComponent,
    AppComponent,
    ClientListComponent,
    AppCardsComponent,
    AppFormComponent,
    AppUpdateComponent,
    MenuUiComponent,
    ConventionListComponent,
    NavbarComponent,
    UserUpdateComponent,
    FactureListComponent,
    FactureFormComponent,
    FactureUpdateComponent,
    MainLayoutComponent,
    PublicLayoutComponent,
    AdminDashboardComponent,
    ClientsByRegionChartComponent,
    UserProfileComponent
    
  
    
  
    


  ],
  imports: [
    
   
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ConventionsChartComponent,
    InvoiceStatusChartComponent,
    BrowserAnimationsModule,
    CommonModule,
    ChartjsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    ConventionsByMonthChartComponent,
    FacturesRevenueChartComponent
    
  
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
