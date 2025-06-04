import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConventionService } from '../../../services/convention.service';
import { ClientService } from '../../../services/client.service';
import { ApplicationService } from '../../../services/application.service';
import { Client } from '../../../models/client.model';
import { Application } from '../../../models/application.model';
import { ConventionRequest } from '../../../models/convention-request.model';
import { ReactiveFormsModule } from '@angular/forms';
import{ Convention } from '../../../models/convention.model';
@Component({
  standalone : false,
  selector: 'app-convention-update',
  templateUrl: './convention-update.component.html',
  styleUrls: ['./convention-update.component.css']
})
export class ConventionUpdateComponent implements OnInit {
  conventionForm!: FormGroup;
  clients: Client[] = [];
  applications: Application[] = [];
  successMessage: string = '';
  uuid!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private conventionService: ConventionService,
    private clientService: ClientService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid')!;
    this.initForm();
    this.loadClients();
    this.loadApplications();
    this.loadConvention();
  }

  initForm(): void {
    this.conventionForm = this.fb.group({
      code: ['', Validators.required],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      clientId: [null, Validators.required],  
      applicationId: [null, Validators.required] 
    });
  }


  loadClients(): void {
    this.clientService.getAllClients().subscribe(clients => this.clients = clients);
  }

  loadApplications(): void {
    this.applicationService.getAllApplications().subscribe(apps => this.applications = apps);
  }


  loadConvention(): void {
    this.conventionService.getConventionByUuid(this.uuid).subscribe(data => {
      this.conventionForm.patchValue(data)
          
    });
  }
  

  updateConvention(): void {
    if (this.conventionForm.valid) {
      const formData: ConventionRequest = {
        uuid: this.uuid,
        code: this.conventionForm.value.code,
        status: this.conventionForm.value.status,
        startDate: this.conventionForm.value.startDate,
        endDate: this.conventionForm.value.endDate,
        clientId: this.conventionForm.value.clientId,
        applicationId: this.conventionForm.value.applicationId
      };

      this.conventionService.updateConvention(formData).subscribe( {
        next: () =>{this.successMessage = "convention modifiée avec succès!";
          setTimeout(() => {
            this.successMessage = ''; // Hide message after 3 seconds
            this.router.navigate(['/app/conventions']); 
          }, 3000);
        },
      error: (err) => console.error('Error updating convention:', err)
      });
    }
  }
}