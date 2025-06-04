import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from '../../../services/facture.service';
import { ConventionService } from '../../../services/convention.service';
import { Facture } from '../../../models/facture.model';
import { Convention } from '../../../models/convention.model';

@Component({
  selector: 'app-facture-update',
  standalone: false,
  templateUrl: './facture-update.component.html',
  styleUrls: ['./facture-update.component.css']
})
export class FactureUpdateComponent implements OnInit {
  factureForm!: FormGroup;
  factureUuid!: string;
  successMessage: string = '';
  errorMessage: string = '';

  // Added conventions property for dropdown
  conventions: Convention[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService,
    private conventionService: ConventionService
  ) {}

  ngOnInit(): void {
    // Initialize form including an "id" field
    this.factureForm = this.fb.group({
      id: [''],  // new field to store the facture's id
      reference: ['', Validators.required],
      dateEmission: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      conventionUuid: ['', Validators.required]
    });

    // Retrieve facture UUID from the route
    this.factureUuid = this.route.snapshot.paramMap.get('uuid') || '';

    // Load conventions for the dropdown
    this.loadConventions();

    // Load existing facture and patch the form, including id and formatted dates
    if (this.factureUuid) {
      this.factureService.getFactureByUuid(this.factureUuid).subscribe({
        next: (facture) => {
 

          this.factureForm.patchValue(facture);
        },
        error: (err) => {
          this.errorMessage = 'Failed to load facture details';
          console.error(err);
        }
      });
    }
  }

  // Load conventions for the dropdown
  loadConventions(): void {
    this.conventionService.getAllConventions().subscribe({
      next: (data: Convention[]) => {
        this.conventions = data;
      },
      error: (err) => console.error('Error fetching conventions:', err)
    });
  }

  updateFacture(): void {
    if (this.factureForm.invalid) return;

    const formValue = this.factureForm.value;
    const payload: Facture = {
      id: formValue.id, // now include the id field
      uuid: this.factureUuid,
      reference: formValue.reference,
      dateEmission: formValue.dateEmission,
      dateEcheance: formValue.dateEcheance,
      montant: formValue.montant,
      status: formValue.status,
      conventionUuid: formValue.conventionUuid
    };

    this.factureService.updateFacture(payload).subscribe({
      next: () => {
        this.successMessage = 'Facture modifiée avec succès!';
        setTimeout(() => {
          this.successMessage = ''; // Hide message after 3 seconds
          this.router.navigate(['/app/factures']);
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update facture';
        console.error(err);
      }
    });
  }
}
