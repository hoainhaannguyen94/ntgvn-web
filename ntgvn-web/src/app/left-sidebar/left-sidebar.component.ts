import { Component, OnInit, inject } from '@angular/core';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from '@utils/base/base.component';
import { NavigationEnd, Router } from '@angular/router';
import { LeftSidebarFacadeService } from './facade/left-sidebar-facade.service';
import { ENavLinkUrl, INavLink } from '@utils/schema';
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

    navigateToRoute(url: string) {
        this.router.navigate([url]);
    }

    navigateTo(link: INavLink) {
        switch (link.url) {
            case ENavLinkUrl.dashboard:
                this.navigateToRoute(ENavLinkUrl.dashboard);
                break;
            case ENavLinkUrl.announcement:
                this.navigateToRoute(ENavLinkUrl.announcement);
                break;
            case ENavLinkUrl.auditLog:
                this.navigateToRoute(ENavLinkUrl.auditLog);
                break;
            case ENavLinkUrl.analytic:
                this.navigateToRoute(ENavLinkUrl.analytic);
                break;
            case ENavLinkUrl.map:
                this.navigateToRoute(ENavLinkUrl.map);
                break;
            case ENavLinkUrl.simulator:
                this.navigateToRoute(ENavLinkUrl.simulator);
                break;
            case ENavLinkUrl.device:
                this.navigateToRoute(ENavLinkUrl.device);
                break;
            case ENavLinkUrl.room:
                this.navigateToRoute(ENavLinkUrl.room);
                break;
            case ENavLinkUrl.event:
                this.navigateToRoute(ENavLinkUrl.event);
                break;
            case ENavLinkUrl.scheduler:
                this.navigateToRoute(ENavLinkUrl.scheduler);
                break;
            case ENavLinkUrl.warehouse:
                this.navigateToRoute(ENavLinkUrl.warehouse);
                break;
            case ENavLinkUrl.product:
                this.navigateToRoute(ENavLinkUrl.product);
                break;
            case ENavLinkUrl.order:
                this.navigateToRoute(ENavLinkUrl.order);
                break;
            case ENavLinkUrl.user:
                this.navigateToRoute(ENavLinkUrl.user);
                break;
            case ENavLinkUrl.group:
                this.navigateToRoute(ENavLinkUrl.group);
                break;
            case ENavLinkUrl.customer:
                this.navigateToRoute(ENavLinkUrl.customer);
                break;
            case ENavLinkUrl.tag:
                this.navigateToRoute(ENavLinkUrl.tag);
                break;
            case ENavLinkUrl.policy:
                this.navigateToRoute(ENavLinkUrl.policy);
                break;
            case ENavLinkUrl.license:
                this.navigateToRoute(ENavLinkUrl.license);
                break;
            case ENavLinkUrl.aboutUs:
                this.navigateToRoute(ENavLinkUrl.aboutUs);
                break;
            case ENavLinkUrl.setting:
                this.navigateToRoute(ENavLinkUrl.setting);
                break;
            default:
                break;
        }
    }
}
