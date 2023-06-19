import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@utils/base/base.component';
import { AnonymousUser } from '@app-state';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'top-nav',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        TranslocoModule
    ],
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent extends BaseComponent {
    router = inject(Router);
    translocoService = inject(TranslocoService);

    @Output() showLeftSideNav = new EventEmitter<any>();

    readonly APP_LANGUAGE_KEY = 'language';
    readonly APP_LANGUAGE_DEFAULT = 'en';

    showSideNav() {
        this.showLeftSideNav.emit(true);
    }

    logout() {
        localStorage.clear();
        window.location.reload();
    }

    navigateToSetting(event) {
        if (this.appState.me['roleName'] === 'member') {
            event.stopPropagation();
            event.preventDefault();
        } else {
            this.router.navigate(['/setting']);
        }
    }

    changeLanguage(key = 'en') {
        this.translocoService.setActiveLang(key);
        localStorage.setItem(this.APP_LANGUAGE_KEY, key);
        this.appState.language = key;
        this.state.commit(this.appState);
    }
}
