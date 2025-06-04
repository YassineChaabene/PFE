import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/application.model';
import { ResponsableService } from '../../../services/responsable.service';
import { Responsable } from '../../../models/responsable.model';
@Component({
  selector: 'app-update-application',
  standalone:false,
  templateUrl: './app-update.component.html',
  styleUrls: ['./app-update.component.css']
})
export class AppUpdateComponent implements OnInit {
  applicationForm!: FormGroup;
  uuid!: string;
  successMessage = '';
  responsables: Responsable[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private appService: ApplicationService,
    private responsableService: ResponsableService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid')!;
    this.initializeForm();

    this.responsableService.getResponsables().subscribe((data) => {
      this.responsables = data;
    });

    this.appService.getApplicationByUuid(this.uuid).subscribe(app => {
      this.applicationForm.patchValue({
        intitule: app.intitule,
        description: app.description,
        dateExploitation: app.dateExploitation?.toString().split('T')[0],
        abreviation: app.abreviation,
        responsable: app.responsable
      });
    });
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      intitule: ['', Validators.required],
      description: ['', Validators.required],
      dateExploitation: ['', Validators.required],
      abreviation: ['', Validators.required],
      responsable: ['', Validators.required]
    });
    
  }

  updateApplication(): void {
    if (this.applicationForm.valid) {
      const updatedApp: Application = {
        uuid: this.uuid,
        ...this.applicationForm.value,
        responsable:this.applicationForm.value.responsable,
      };
      console.log('Updated Application:', updatedApp);

      this.appService.updateApplication(updatedApp).subscribe(() => {
        this.successMessage = 'Application modifiée avec succès!';
        setTimeout(() => {
          this.router.navigate(['/app/applications']);
        }, 2000);
      });
    }
  }
  compareResponsables(r1: Responsable, r2: Responsable): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }
}