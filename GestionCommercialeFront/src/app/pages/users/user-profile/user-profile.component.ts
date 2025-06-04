import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})

 

export class UserProfileComponent {

  userName = '';
  userTelephone='';
  userRole='';
  userEmail=''

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {

    const nameFromToken = this.authService.getNameFromToken();
    this.userName = nameFromToken ?? '';
    
    const roleFromToken = this.authService.getUserRoleFromToken();
    this.userRole = roleFromToken?.toLowerCase() ?? '';
    const emailFromToken = this.authService.getEmailFromToken();
    this.userEmail = emailFromToken ?? '';


  }
}
