import { Component, OnInit, inject } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '@utils/base/base.component';
import { ChartFacadeService } from './facade/chart-facade.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'chart-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent extends BaseComponent implements OnInit {
    chartFacade = inject(ChartFacadeService);

    ngOnInit() {
        this.registerCoreLayer();
    }

    override registerCoreLayer() {
        this.chartFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
    }
}
