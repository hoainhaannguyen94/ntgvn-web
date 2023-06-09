import { Component, OnInit, inject } from '@angular/core';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from '@utils/base/base.component';
import { NavigationEnd, Router } from '@angular/router';
import { INavLink } from '@common/schemas';
import { LeftSidebarFacadeService } from './facade/left-sidebar-facade.service';
import { ENavLinkUrl } from '@common/schemas';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    selector: 'left-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        MatListModule,
        MatIconModule,
        TranslocoModule
    ],
    templateUrl: './left-sidebar.component.html',
    styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent extends BaseComponent implements OnInit {
    navLinks: INavLink[] = [];
    selectedLink = '';

    leftSidebarFacade = inject(LeftSidebarFacadeService);
    router = inject(Router);

    ngOnInit() {
        this.getNavLinks();
        this.initSelectedLink();
        this.registerNavigationEnd();
    }

    override registerCoreLayer() { }

    getNavLinks() {
        this.navLinks = this.leftSidebarFacade.getNavLinks();
    }

    initSelectedLink() {
        this.checkActivedLink(this.router.url);
    }

    registerNavigationEnd() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe({
            next: event => {
                event instanceof NavigationEnd && this.checkActivedLink(event.url);
            }
        });
    }

    checkActivedLink(url: string) {
        const activedLink: INavLink | undefined = this.navLinks.find(link => url.includes(link.url))
        activedLink && (() => {
            this.selectedLink = activedLink.url;
        })();
    }

    navigateTo(link: INavLink) {
        switch (link.url) {
            case ENavLinkUrl.dashboard:
                this.navigateToDashboard();
                break;
            case ENavLinkUrl.announcement:
                this.navigateToAnnouncement();
                break;
            case ENavLinkUrl.auditLog:
                this.navigateToAuditLog();
                break;
            case ENavLinkUrl.analytic:
                this.navigateToAnalytic();
                break;
            case ENavLinkUrl.map:
                this.navigateToMap();
                break;
            case ENavLinkUrl.simulator:
                this.navigateToSimulator();
                break;
            case ENavLinkUrl.device:
                this.navigateToDevice();
                break;
            case ENavLinkUrl.room:
                this.navigateToRoom();
                break;
            case ENavLinkUrl.event:
                this.navigateToEvent();
                break;
            case ENavLinkUrl.scheduler:
                this.navigateToScheduler();
                break;
            case ENavLinkUrl.warehouse:
                this.navigateToWarehouse();
                break;
            case ENavLinkUrl.product:
                this.navigateToProduct();
                break;
            case ENavLinkUrl.order:
                this.navigateToOrder();
                break;
            case ENavLinkUrl.user:
                this.navigateToUser();
                break;
            case ENavLinkUrl.customer:
                this.navigateToCustomer();
                break;
            case ENavLinkUrl.policy:
                this.navigateToPolicy();
                break;
            case ENavLinkUrl.license:
                this.navigateToLicense();
                break;
            case ENavLinkUrl.aboutUs:
                this.navigateToAboutUs();
                break;
            case ENavLinkUrl.setting:
                this.navigateToSetting();
                break;
            default:
                break;
        }
    }

    navigateToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    navigateToAnnouncement() {
        this.router.navigate(['/announcement']);
    }

    navigateToAuditLog() {
        this.router.navigate(['/audit-log']);
    }

    navigateToAnalytic() {
        this.router.navigate(['/analytic']);
    }

    navigateToMap() {
        this.router.navigate(['/map']);
    }

    navigateToSimulator() {
        this.router.navigate(['/simulator']);
    }

    navigateToDevice() {
        this.router.navigate(['/device']);
    }

    navigateToRoom() {
        this.router.navigate(['/room']);
    }

    navigateToEvent() {
        this.router.navigate(['/event']);
    }

    navigateToScheduler() {
        this.router.navigate(['/scheduler']);
    }

    navigateToWarehouse() {
        this.router.navigate(['/warehouse']);
    }

    navigateToProduct() {
        this.router.navigate(['/product']);
    }

    navigateToOrder() {
        this.router.navigate(['/order']);
    }

    navigateToUser() {
        this.router.navigate(['/user']);
    }

    navigateToCustomer() {
        this.router.navigate(['/customer']);
    }

    navigateToPolicy() {
        this.router.navigate(['/policy']);
    }

    navigateToLicense() {
        this.router.navigate(['/license']);
    }

    navigateToAboutUs() {
        this.router.navigate(['/about-us']);
    }

    navigateToSetting() {
        this.router.navigate(['/setting']);
    }
}
