import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { take, takeUntil, timer } from 'rxjs';
import { BaseComponent } from '@utils/base/base.component';
import { KPIFacadeService } from './facade/kpi-facade.service';
import { IKPIConfig } from './schemas/kpi.schema';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ContentLoaderComponent } from '@utils/component/content-loader';

@Component({
    selector: 'kpi-widget',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        ContentLoaderComponent
    ],
    templateUrl: './kpi.component.html',
    styleUrls: ['./kpi.component.scss']
})
export class KpiComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() config: IKPIConfig;

    kpiFacade = inject(KPIFacadeService);
    router = inject(Router);

    ngOnInit() {
        this.registerCoreLayer();
    }

    override registerCoreLayer() {
        this.kpiFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['config']) {
            this.loading();
        }
    }

    loading() {
        this.kpiFacade.showLoading();
        timer(1500).pipe(take(1)).subscribe({
            next: () => {
                this.kpiFacade.hideLoading();
            }
        });
    }

    navigateTo(navLink: string) {
        this.router.navigate([navLink]);
    }
}
