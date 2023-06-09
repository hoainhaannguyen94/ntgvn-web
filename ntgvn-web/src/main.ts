import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { enableProdMode } from '@angular/core';
import { environment } from '@environment';

if (environment.production) {
    enableProdMode();
    console.log = function () { };
    console.warn = function () { };
    console.info = function () { };
    console.error = function () { };
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
