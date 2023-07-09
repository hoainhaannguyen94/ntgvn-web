import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, takeUntil, tap, timer } from 'rxjs';
import { BaseMatGridComponent } from '@utils/base/mat-grid';
import { IAuditLog } from '@utils/schema';
import { AuditLogFacadeService } from '../../facade/audit-log-facade.service';
import { OdataParams } from '@utils/http';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ObjectPropertyPipe, UserDetailsPipe } from '@utils/pipe';
import { LogService } from '@utils/service';

@Component({
    selector: 'audit-log-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatMenuModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        ObjectPropertyPipe,
        UserDetailsPipe
    ],
    templateUrl: './audit-log-list.component.html',
    styleUrls: ['./audit-log-list.component.scss']
})
export class AuditLogListComponent extends BaseMatGridComponent<IAuditLog> implements OnInit, AfterViewInit {
    @ViewChild(MatSort) matSort: MatSort;
    @ViewChild(MatPaginator) override paginator: MatPaginator;

    logService = inject(LogService);
    auditLogFacade = inject(AuditLogFacadeService);
    router = inject(Router);

    ngOnInit() {
        this.registerCoreLayer();
        this.initColumns();
        this.initDisplayColumns();
        this.initActions();
        this.registerResizeObserver();
        this.registerSearchControlValueChanges();
    }

    ngAfterViewInit() {
        const matSortTimer$ = timer(0, 300).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                if (this.matSort) {
                    this.dataSource.sort = this.matSort;
                    matSortTimer$.unsubscribe();
                }
            }
        });
        const paginatorTimer$ = timer(0, 300).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                if (this.paginator) {
                    this.paginator.page.pipe(
                        tap(event => {
                            const options: OdataParams = {
                                $skip: event.pageIndex * event.pageSize,
                                $top: event.pageSize,
                                $filter: this.filterString,
                                $orderby: '_id desc'
                            }
                            this.auditLogFacade.loadAuditLogList(options);
                        }),
                        takeUntil(this.destroy$)
                    ).subscribe();
                    paginatorTimer$.unsubscribe();
                }
            }
        });
    }

    override registerCoreLayer() {
        this.auditLogFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('AuditLogListComponent', err);
            }
        });
        this.auditLogFacade.getCountAuditLogs$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalItems = value;
            },
            error: err => {
                this.logService.error('AuditLogListComponent', err);
            }
        });
        this.auditLogFacade.getAuditLogList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.items = value;
                this.updateDataSource();
            },
            error: err => {
                this.logService.error('AuditLogListComponent', err);
            }
        });
        this.auditLogFacade.loadCountAuditLogs();
        this.auditLogFacade.loadAuditLogList({
            $skip: 0,
            $top: this.pageSize,
            $orderby: '_id desc'
        });
    }

    registerSearchControlValueChanges() {
        this.searchControl.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300)).subscribe({
            next: value => {
                let valid = false;
                this.isSearching = false;
                if (typeof value === 'string' && value.length === 0) {
                    this.filterString = '';
                    valid = true;
                }
                if (typeof value === 'string' && value.length > 0) {
                    this.filterString = `contains(event, '${value}')`;
                    valid = true;
                    this.isSearching = true;
                }
                if (valid) {
                    const options: OdataParams = {
                        $skip: 0,
                        $top: this.pageSize,
                        $filter: this.filterString,
                        $orderby: '_id desc'
                    }
                    this.auditLogFacade.loadCountAuditLogs();
                    if (this.paginator.pageIndex > 0) {
                        this.paginator.firstPage();
                    } else {
                        this.auditLogFacade.loadAuditLogList(options);
                    }
                }
            }
        });
    }

    initColumns() {
        this.headers = {
            'event': 'Event',
            '_userId': 'User',
            'action': 'Action',
            'details': 'Details',
            'date': 'Date'
        }
    }

    initDisplayColumns() {
        this.columns = ['event', '_userId', 'action', 'details', 'date', 'actions'];
    }

    initActions() {
        this.actions = [
            {
                label: 'Details',
                icon: 'visibility',
                enable: true,
                display: true,
                execute: (item: IAuditLog) => {
                    this.detailsAuditLogHandler(item);
                }
            }
        ];
    }

    updateDataSource() {
        this.dataSource.data = this.items;
    }

    override reloadGrid() {
        this.auditLogFacade.loadCountAuditLogs();
        this.auditLogFacade.loadAuditLogList({
            $skip: 0,
            $top: this.pageSize,
            $orderby: '_id desc'
        });
    }

    detailsAuditLogHandler(item: IAuditLog) {
        this.router.navigate([`/audit-log/${item._id}/details`]);
    }
}
