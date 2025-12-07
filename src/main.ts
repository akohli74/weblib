// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Angular Material modules (provided globally)
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      MatSidenavModule,
      MatToolbarModule,
      MatIconModule,
      MatListModule,
      MatButtonModule
    )
  ]
}).catch(err => console.error(err));