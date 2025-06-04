import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-client-form',
  standalone: false,
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent {
  clientForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  gouvernorats = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba',
    'Nabeul', 'Zaghouan', 'Bizerte', 'Béja',
    'Jendouba', 'Le Kef', 'Siliana', 'Sousse',
    'Monastir', 'Mahdia', 'Sfax', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Gabès', 'Medenine',
    'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
  ];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      code: ['', [Validators.required,Validators.pattern('^.{4,6}$')]],
      intitule: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      gouvernorat: ['', Validators.required]
    });
  }

  addClient() {
    this.errorMessage = '';
    this.successMessage = '';
  
    if (this.clientForm.valid) {
      const code = this.clientForm.get('code')?.value;
  
      this.clientService.checkCodeExists(code).subscribe(
        exists => {
          console.log("Résultat checkCodeExists = ", exists);
          if (exists) {
            this.errorMessage = 'Ce code client est déjà utilisé.';
          } else {
            this.clientService.addClient(this.clientForm.value).subscribe(
              () => {
                this.successMessage = 'Client ajouté avec succès!';
                setTimeout(() => {
                  this.successMessage = '';
                  this.router.navigate(['/app/clients']);
                }, 3000);
              },
              (error) => {
                console.error("Erreur serveur lors de l'ajout", error);
                this.errorMessage = "Erreur lors de l'ajout du client.";
              }
            );
          }
        },
        error => {
          console.error('Code existe déja', error);
          this.errorMessage = 'Code existe déja';
        }
      );
    }
  }
  
}