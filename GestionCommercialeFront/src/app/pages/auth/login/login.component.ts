import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from './../../../services/auth.service';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatInputModule, MatButtonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('captchaCanvas', { static: false }) captchaCanvas!: ElementRef<HTMLCanvasElement>;

  user = {
    email: "",
    password: "",
  };

  captcha: string = '';       
  userInput: string = ''; 
  errorMessage: string = ''; 
  showPassword: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit() {
    this.generateCaptcha();
  
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRoleFromToken();
      if (role === 'ADMIN') {
        this.router.navigate(['/app/dashboard']);
      } else {
        this.router.navigate(['/app/clients']);
      }
    }
  }
  

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    this.captcha = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

    const canvas = this.captchaCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '28px Arial';
    ctx.fillStyle = '#000';

    for (let i = 0; i < this.captcha.length; i++) {
      const x = 15 + i * 20 + Math.random() * 10;
      const y = 30 + Math.random() * 5;
      ctx.fillText(this.captcha[i], x, y);
    }
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  onLogin() {
    this.errorMessage = '';
    if (this.userInput.toLowerCase() !== this.captcha.toLowerCase()) {
      this.errorMessage = "CAPTCHA incorrect!";
      return;
    }
  
    this.authService.login(this.user.email, this.user.password).subscribe({
      next: loginResp => {
        const role = this.authService.getUserRoleFromToken();
        console.log('🚀 Login successful:', role);
  
        if (!role) {
          this.errorMessage = "impossible d'extraire le rôle de l'utilisateur";
          return;
        }
  
        // route based on role
        if (role === 'ADMIN') {
          this.router.navigateByUrl('/app/dashboard');
        } else if (role === 'SUPERUSER') {
          this.router.navigate(['/app/clients']);
        } else {
          this.router.navigate(['/app/clients']);
        }
      },
      error: err => {
        const errorMsg = typeof err.error === 'string'
          ? err.error
          : err.error?.message || 'Erreur inconnue lors de la connexion';
        this.errorMessage = `❌ ${errorMsg}`;
      }
    });
  }
}
