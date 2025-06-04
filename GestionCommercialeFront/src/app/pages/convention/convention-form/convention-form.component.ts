import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ConventionService } from '../../../services/convention.service';
import { ClientService } from '../../../services/client.service';
import { ApplicationService } from '../../../services/application.service';
import { Client } from '../../../models/client.model';
import { Application } from '../../../models/application.model';
import { ConventionRequest } from '../../../models/convention-request.model';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-convention-form',
  standalone: false,
  templateUrl: './convention-form.component.html',
  styleUrls: ['./convention-form.component.css']
})
export class ConventionFormComponent implements OnInit {
  conventionForm!: FormGroup;
  clients: Client[] = [];
  filteredClients!: Observable<Client[]>;
  clientControl = new FormControl('', Validators.required);
  applications: Application[] = [];
  filteredApplications!: Observable<Application[]>;
  applicationControl = new FormControl('', Validators.required);
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private conventionService: ConventionService,
    private clientService: ClientService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.conventionForm = this.fb.group({
      code: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      clientId: [null, Validators.required],
      applicationId: [null, Validators.required]
    }, 
    {validators: this.validateDateRange}
  );
    this.loadClients();
    this.loadApplications();
  }
  validateDateRange(group: FormGroup) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
  
    if (start && end && new Date(start) > new Date(end)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }
  

  loadClients(): void {
    this.clientService.getAllClients().subscribe((data: Client[]) => {
      this.clients = data;

      this.filteredClients = this.clientControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const filter = value ? value.toLowerCase() : '';
          return this.clients.filter(client => client.intitule.toLowerCase().includes(filter));
        })
      );
    });
  }

  loadApplications(): void {
    this.applicationService.getAllApplications().subscribe((data: Application[]) => {
      this.applications = data;
      this.filteredApplications = this.applicationControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const filter = value ? value.toLowerCase() : '';
          return this.applications.filter(application => application.intitule.toLowerCase().includes(filter));
        })
      );
    });
  }

  selectClient(client: Client): void {
    this.clientControl.setValue(client.intitule);
    this.conventionForm.patchValue({ clientId: client.id });
  }
  selectApplication(application: Application): void {
    this.applicationControl.setValue(application.intitule);
    this.conventionForm.patchValue({ applicationId: application.id });
  }

  submitForm(): void {
    if (this.conventionForm.valid) {
      const formData: ConventionRequest = {
        code: this.conventionForm.value.code,
        status: this.conventionForm.value.status,
        startDate: new Date(this.conventionForm.value.startDate).toISOString().split('T')[0],
        endDate: this.conventionForm.value.endDate
          ? new Date(this.conventionForm.value.endDate).toISOString().split('T')[0]
          : null,
        clientId: this.conventionForm.value.clientId,
        applicationId: this.conventionForm.value.applicationId
      };

      this.conventionService.addConvention(formData).subscribe({
        next: () => {
          this.successMessage = 'Convention ajoutée avec succès!!';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/app/conventions']);
          }, 3000);
        },
        error: (err) => console.error('Error adding convention:', err)
      });
    }
  }
}
