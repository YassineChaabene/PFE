import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  userForm: FormGroup;
  successMessage: string = '';
  roles = ['USER', 'ADMIN','SUPERUSER']; // For role selection dropdown

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      role: ['USER', Validators.required] // Default to USER
    });
  }

  addUser() {
    console.log(this.userForm.value); // Debugging
    console.log('Form Valid:', this.userForm.valid); // Check validity

    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).subscribe(
        () => {
          this.successMessage = 'Utilisateur ajouté avec succès!';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/app/users']); // Navigate to user list
          }, 3000);
        },
        (error) => {
          console.error('Error creating user', error);
        }
      );
    }
  }
}