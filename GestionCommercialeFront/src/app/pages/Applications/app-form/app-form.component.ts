import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { Router } from '@angular/router';
import { Responsable } from '../../../models/responsable.model';
import { ResponsableService } from '../../../services/responsable.service';

@Component({
  selector: 'app-app-form',
  standalone: false,
  templateUrl: './app-form.component.html',
  styleUrl: './app-form.component.css'
})
export class AppFormComponent {
  applicationForm: FormGroup;
  successMessage: string = '';
  responsables: Responsable[] = [];

  constructor(private fb: FormBuilder, private appService: ApplicationService ,private responsableService : ResponsableService, private router: Router) {
    this.applicationForm = this.fb.group({
      intitule: ['', Validators.required],
      description: ['', Validators.required],
      dateExploitation: [new Date().toISOString().split('T')[0], Validators.required],
      abreviation: ['', Validators.required],
      responsable: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.loadResponsables();
  }
  
  loadResponsables(): void {
    this.responsableService.getResponsables().subscribe({
      next: (data) => this.responsables = data,
      error: (err) => console.error('❌ Failed to load responsables', err)
    });
  }

  addApplication(): void {
    if (this.applicationForm.valid) {
      const formValue = {
        ...this.applicationForm.value,
        dateExploitation: new Date(this.applicationForm.value.dateExploitation)
      };

      this.appService.addApplication(formValue).subscribe({
        next: () => {
          this.successMessage = 'Application ajoutée avec succès!';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/app/applications']);
          }, 2000);
        },
        error: (error) => {
          console.error('❌ Error adding application:', error);
        }
      });
    }
  }
}
