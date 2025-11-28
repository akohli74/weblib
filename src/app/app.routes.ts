import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'auth',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing/landing.component/landing.component').then(m => m.LandingComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'library',
        loadComponent: () =>
          import('./pages/library/library.component/library.component').then(m => m.LibraryComponent)
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers/customers.component/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./pages/checkout/checkout.component/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./pages/alerts/alerts.component/alerts.component').then(m => m.AlertsComponent)
      },
      {
        path: '', pathMatch: 'full', redirectTo: 'landing'
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
];
