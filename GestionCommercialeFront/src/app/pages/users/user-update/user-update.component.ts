import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  standalone : false,
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  updateUserForm!: FormGroup;
  userUuid!: string;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateUserForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });

    // Get ID from route params
    this.userUuid = this.route.snapshot.paramMap.get('uuid') || '';
    if (this.userUuid) {
      this.userService.getUserByUuid(this.userUuid).subscribe({
        next: (user) => this.updateUserForm.patchValue(user),
        error: (err) => this.errorMessage = 'Failed to load user details'
      });
    }
  }

  onUpdate() {
    if (this.updateUserForm.invalid) return;

    const updatedUser: User = {
      uuid: this.userUuid,
      ...this.updateUserForm.value
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.successMessage = 'Utilisateur modifié avec succès!';
        setTimeout(() => this.router.navigate(['/app/users']), 3000);
      },
      error: (err) => this.errorMessage = 'Failed to update user'
    });
  }
}