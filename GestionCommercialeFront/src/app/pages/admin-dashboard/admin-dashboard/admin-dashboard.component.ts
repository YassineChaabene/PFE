import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { DashboardService }    from '../../../services/dashboard.service';
import { ClientService }       from '../../../services/client.service';
import { ConventionService }   from '../../../services/convention.service';
import { ApplicationService }  from '../../../services/application.service';
import { FactureService }      from '../../../services/facture.service';
import { ReferenceService }    from '../../../services/reference.service';
import { GenerationService }   from '../../../services/generation.service';

import { FactureDto }          from '../../../models/facture.dto';
import { Client }              from '../../../models/client.model';
import { Application }         from '../../../models/application.model';

type Tab = 'aperçu' | 'clients' | 'conventions'  | 'factures';

@Component({
  standalone: false,
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // Tabs
  tabs: Tab[] = ['aperçu','clients','conventions','factures'];
  selectedTab: Tab = this.tabs[0];

  loading = false;
  error = '';

  // Aperçu data
  metrics!: any;
  recentInvoices: FactureDto[] = [];
  clientsByRegion!: Record<string, number>;

  // Form selects
  codes$: Observable<string[]>;
  statuses$: Observable<string[]>;
  apps$: Observable<string[]>;
  clients$: Observable<string[]>;

  // Reactive form + results
  form: FormGroup;
  generatedSQL = '';
  sqlResults: any[] = [];

  // New maps id→intitule
  clientMap: Record<number,string>       = {};
  applicationMap: Record<number,string>  = {};

  constructor(
    private svc: DashboardService,
    private cs: ClientService,
    private as: ApplicationService,
    private convs: ConventionService,
    private fs: FactureService,
    private refSvc: ReferenceService,
    private genSvc: GenerationService
  ) {
    // Populate select lists
    this.codes$    = this.refSvc.getConventionCodes();
    this.statuses$ = this.refSvc.getStatuses();
    this.apps$     = this.refSvc.getApplications();
    this.clients$  = this.refSvc.getClients();

    // Build form
    this.form = new FormGroup({
      convention:   new FormControl('ALL'),
      status:        new FormControl(''),
      dateEmission: new FormControl(''),
      dateFin:      new FormControl(''),
      application:  new FormControl(''),
      client:       new FormControl('')
    });

    // Preload client-id → intitule map
    this.cs.getAllClients().subscribe((clients: Client[]) => {
  clients.forEach(c => {
    if (c.id != null) {
      this.clientMap[c.id] = c.intitule;
    }
  });
});


   this.as.getAllApplications().subscribe((apps: Application[]) => {
  apps.forEach(a => {
    if (a.id != null) {
      this.applicationMap[a.id] = a.intitule;
    }
  });
});
  }

  ngOnInit() {
    this.selectTab(this.selectedTab);
  }

  selectTab(tab: Tab) {
    this.selectedTab = tab;
    this.error = '';
    this.loading = true;

    if (tab === 'aperçu') {
      this.loadAllDashboardData();
    } else if (tab === 'clients') {
      this.svc.clientsByRegion().subscribe({
        next: data => { this.clientsByRegion = data; this.loading = false; },
        error: () => { this.error = 'Échec clients'; this.loading = false; }
      });
    } else if (tab === 'conventions') {
      this.loading = false;
    } else if (tab === 'factures') {
      this.svc.recentInvoices().subscribe({
        next: inv => { this.recentInvoices = inv; this.loading = false; },
        error: () => { this.error = 'Échec factures'; this.loading = false; }
      });
    }
  }

  private loadAllDashboardData() {
    this.loading = true;
    this.svc.getDashboardMetrics().subscribe({
      next: m => { this.metrics = m; this.loading = false; },
      error: () => { this.error = 'Échec metrics'; this.loading = false; }
    });
  }

  onSubmit(): void {
    this.generatedSQL = '';
    this.sqlResults   = [];
    this.loading      = true;

    const payload = {
  conv: this.form.value.convention  || 'ALL',
  stat: this.form.value.status      || null,
  dem:  this.form.value.dateEmission ? this.form.value.dateEmission : null,
  fin:  this.form.value.dateFin      ? this.form.value.dateFin      : null,
  app:  this.form.value.application || null,
  cli:  this.form.value.client      || null
};

    this.genSvc.genAndExec(payload).subscribe(res => {
       this.generatedSQL = res.sql;
       this.sqlResults   = res.rows;
        this.loading = false;
      });
     
  }


}
