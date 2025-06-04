import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureService } from '../../../services/facture.service';
import { ConventionService } from '../../../services/convention.service';
import { Router } from '@angular/router';
import { Convention } from '../../../models/convention.model';
import { Facture } from '../../../models/facture.model';

@Component({
  selector: 'app-facture-form',
  standalone: false,
  templateUrl: './facture-form.component.html',
  styleUrls: ['./facture-form.component.css']
})
export class FactureFormComponent implements OnInit {
  factureForm: FormGroup;
  successMessage: string = '';
  conventions: Convention[] = [];

  constructor(
    private fb: FormBuilder,
    private factureService: FactureService,
    private conventionService: ConventionService,
    private router: Router
  ) {
    // Build form with fields aligned to your Facture model
    this.factureForm = this.fb.group({
      reference: ['', Validators.required],
      dateEmission: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      conventionUuid: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Fetch possible conventions for the dropdown
    this.conventionService.getAllConventions().subscribe({
      next: (data) => (this.conventions = data),
      error: (err) => console.error('Error fetching conventions:', err)
    });
  }

  addFacture() {
    if (this.factureForm.valid) {
      // Gather form values
      const formValue = this.factureForm.value;

      // Construct the Facture payload
      const payload: Facture = { // Let the backend generate a UUID
        
        reference: formValue.reference,
        dateEmission: formValue.dateEmission,
        dateEcheance: formValue.dateEcheance,
        montant: formValue.montant,
        status: formValue.status,
        conventionUuid: formValue.conventionUuid
      };

      console.log('Payload:', payload);

      // Submit to the backend service
      this.factureService.addFacture(payload).subscribe(
        () => {
          this.successMessage = 'Facture ajoutée avec succès !';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/app/factures']);
          }, 3000);
        },
        (error) => {
          console.error('Erreur lors de la création de la facture', error);
        }
      );
    }
  }
}
