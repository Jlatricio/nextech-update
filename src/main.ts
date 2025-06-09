import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { importProvidersFrom } from '@angular/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';

registerLocaleData(localePt, 'pt-AO');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
 providers: [
    importProvidersFrom(LoadingBarModule),
  ]
