import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'auth',
        loadComponent: () =>
          import('./features/login/login.component').then(m => m.LoginComponent)
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
        path: '', pathMatch: 'full', redirectTo: 'dashboard'
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
];
