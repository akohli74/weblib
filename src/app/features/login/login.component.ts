import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebLibService } from '../../services/weblib.service';
import { LoginResponse } from '../../models/login';
import { EventingService } from '../../services/eventing.service';
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
export class LoginComponent implements OnInit{
  model: LoginModel = {
    username: '',
    password: '',
  };

  loading = false;
  errorMessage: string | null = null;

  // eslint-disable-next-line @angular-eslint/prefer-inject
constructor(private router: Router, private weblib: WebLibService, private eventingService: EventingService) {}

  ngOnInit(): void {
    // Initialization code if needed
    this.eventingService.emit({ type: 'LOGOUT' });
  }
  async onSubmit(form?: NgForm): Promise<void> {
    if (form && form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    try {
      // Simulated network delay (replace with your API call)
      this.weblib.login(this.model.username, this.model.password).subscribe((r: LoginResponse) => {
        if (!r.status) {
          // Handle successful login
          localStorage.setItem('userId', JSON.stringify(r.userId));
          this.router.navigate(['/dashboard']);
        } else {
          // Handle login failure
          this.errorMessage = r.message || 'Login failed. Please try again.';
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.errorMessage = err.message;
      } else {
        this.errorMessage = String(err) || 'Login failed. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }
}