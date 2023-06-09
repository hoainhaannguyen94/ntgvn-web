import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppInterceptor } from './app.interceptor';
import { provideStateConfigs } from '@utils/state';
import { INITIAL_STATE } from '@app-state';
import { TranslocoRootModule } from './transloco-root.module';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptors([AppInterceptor])),
        provideAnimations(),
        provideRouter(routes),
        provideStateConfigs({
            initialState: INITIAL_STATE,
        }),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        importProvidersFrom([
            TranslocoRootModule
        ])
    ]
}
