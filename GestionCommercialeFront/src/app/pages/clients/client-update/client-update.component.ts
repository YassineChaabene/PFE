import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  standalone: false,
  selector: 'app-client-update',
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.css']
})
export class ClientUpdateComponent implements OnInit {
  updateClientForm!: FormGroup;
  clientUuid!: string ;
  successMessage: string = '';
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateClientForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^.{3,6}$')]],
      intitule: ['', [Validators.required]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', [Validators.required]],
      gouvernorat:['', [Validators.required]]
    });

    // Get client UUID from the route
    this.clientUuid = this.route.snapshot.paramMap.get('uuid') || '';
  if (this.clientUuid) {
    this.clientService.getClientByUuid(this.clientUuid).subscribe(client => {
      if (client) {
        this.updateClientForm.patchValue(client);
        }
      });
    }
  }

  onUpdate() {
    if (this.updateClientForm.invalid) return;

    const updatedClient: Client = { 
      uuid: this.clientUuid,
      ...this.updateClientForm.value,
      code: this.updateClientForm.get('code')?.value,
     };

    this.clientService.updateClient(updatedClient).subscribe({
      next: () =>{this.successMessage = "Client modifié avec succès!";
        setTimeout(() => {
          this.successMessage = ''; // Hide message after 3 seconds
          this.router.navigate(['/app/clients']); 
        }, 3000);
      },
    error: (err) => console.error('Error updating client:', err)
    });
  }
}
