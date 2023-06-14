import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { take, takeUntil, timer } from 'rxjs';
import { BaseComponent } from '@utils/base/base.component';
import { GridFacadeService } from './facade/grid-facade.service';
import { CommonModule } from '@angular/common';
import { ContentLoaderComponent } from '@utils/component/content-loader';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { IMatGridHeaders, IMatGridConfig } from '@utils/schema';
import { CustomerDetailsPipe, OrderStatusDetailsPipe, OrderStatusUppercasePipe, ProductDetailsPipe, UserDetailsPipe, ObjectPropertyPipe } from '@utils/pipe';

@Component({
    selector: 'grid-widget',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        MatButtonModule,
        ContentLoaderComponent,
        OrderStatusUppercasePipe,
        CustomerDetailsPipe,
        ObjectPropertyPipe,
        ProductDetailsPipe,
        UserDetailsPipe,
        OrderStatusDetailsPipe
    ],
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})
export class GridComponent extends BaseComponent implements OnInit, OnChanges {
    gridFacade = inject(GridFacadeService);

    @ViewChild(MatSort) matSort: MatSort;

    @Input() config: IMatGridConfig;

    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    headers: IMatGridHeaders = {}
    columns: string[] = [];

    ngOnInit() {
        this.registerCoreLayer();
    }

    ngAfterViewInit() {
        const timer$ = timer(0, 300).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                if (this.matSort) {
                    this.dataSource.sort = this.matSort;
                    timer$.unsubscribe();
                }
            }
        });
    }

    override registerCoreLayer() {
        this.gridFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['config'] && changes['config'].currentValue) {
            this.loading();
            this.repairDataSource();
        }
    }

    repairDataSource() {
        this.dataSource.data = this.config.data;
        this.headers = this.config.headers;
        this.columns = this.config.columns;
    }

    loading() {
        this.gridFacade.showLoading();
        timer(1500).pipe(take(1)).subscribe({
            next: () => {
                this.gridFacade.hideLoading();
            }
        });
    }
}
