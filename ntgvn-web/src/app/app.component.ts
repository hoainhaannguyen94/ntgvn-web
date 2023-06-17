import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BaseComponent } from '@utils/base/base.component';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { TopNavComponent } from './top-nav/top-nav.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { SwUpdate } from '@angular/service-worker';
import { takeUntil, timer } from 'rxjs';
import { DateTime } from 'luxon';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { environment } from '@environment';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        MatSidenavModule,
        TopNavComponent,
        LeftSidebarComponent,
        TranslocoModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {
    swUpdate = inject(SwUpdate);
    translocoService = inject(TranslocoService);

    sidenavBreakPointSize = 1023;
    sidenavOpened = false;
    sidenavMode: MatDrawerMode = 'over';
    sidenavHasBackdrop = true;

    ngOnInit() {
        this.registerResizeObserver();
        this.registerServiceWorkerUpgrade();
        this.detectLocalTimezone();
        this.detectLocalLanguage();
    }

    registerServiceWorkerUpgrade() {
        if (this.swUpdate.isEnabled) {
            timer(0, 30000).pipe(takeUntil(this.destroy$)).subscribe({
                next: () => {
                    this.swUpdate.checkForUpdate().then(res => {
                        if (res) {
                            if (confirm('A new version is available, do you want to load it?')) {
                                window.location.reload();
                            }
                        }
                    });
                }
            });
        }
    }

    override registerResizeObserver() {
        this.resizeObserver.observe(document.querySelector('body'), (width, _) => {
            if (width > this.sidenavBreakPointSize) {
                this.sidenavOpened = true;
                this.sidenavMode = 'side';
                this.sidenavHasBackdrop = false;
            } else {
                this.sidenavOpened = false;
                this.sidenavMode = 'over';
                this.sidenavHasBackdrop = true;
            }
            this.cdr.detectChanges();
        });
    }

    onSidenavOpenedChange(event) {
        if (this.sidenavMode === 'side' && event === true) {
            document.getElementById('app-content').style.width = 'calc(100% - 320px)';
        } else {
            document.getElementById('app-content').style.width = '100%';
        }
        this.cdr.detectChanges();
    }

    detectLocalTimezone() {
        const timezone = DateTime.local().toFormat("z 'UTC'ZZ");
        this.appState.timezone = timezone;
        this.state.commit(this.appState);
    }

    detectLocalLanguage() {
        const language = localStorage.getItem('language') ?? environment.language;
        this.appState.language = language;
        this.state.commit(this.appState);
        this.translocoService.setActiveLang(language);
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        this.resizeObserver.unobserve(document.querySelector('body'));
    }
}
