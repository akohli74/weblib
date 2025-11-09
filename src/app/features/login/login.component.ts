import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface LoginModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  model: LoginModel = {
    username: '',
    password: '',
  };

  loading = false;
  errorMessage: string | null = null;

  constructor(private router: Router) {}

  async onSubmit(form?: NgForm): Promise<void> {
    if (form && form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    try {
      // Simulated network delay (replace with your API call)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication logic
      if (this.model.username === 'admin' && this.model.password === 'password') {
        // Navigate to dashboard or home page
        this.router.navigate(['/dashboard']);
      } else {
        throw new Error('Invalid username or password.');
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}