import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, takeUntil, tap, timer } from 'rxjs';
import { BaseMatGridComponent } from '@utils/base/mat-grid';
import { OdataParams } from '@utils/http';
import { IOrder } from '@utils/schema';
import { OrderFacadeService } from '../../facade/order-facade.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@utils/component/confirm-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
import { ObjectPropertyPipe, CustomerDetailsPipe, OrderStatusDetailsPipe, OrderStatusUppercasePipe, UserDetailsPipe } from '@utils/pipe';
import { io } from 'socket.io-client';

@Component({
    selector: 'order-list',
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
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
        ConfirmDialogComponent,
        UserDetailsPipe,
        ObjectPropertyPipe,
        CustomerDetailsPipe,
        OrderStatusUppercasePipe,
        OrderStatusDetailsPipe
    ],
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent extends BaseMatGridComponent<IOrder> implements OnInit, AfterViewInit {
    @ViewChild(MatSort) matSort: MatSort;
    @ViewChild(MatPaginator) override paginator: MatPaginator;

    orderFacade = inject(OrderFacadeService);
    router = inject(Router);
    dialog = inject(MatDialog);
    matSnackbar = inject(MatSnackBar);

    ngOnInit() {
        this.registerCoreLayer();
        this.registerSignal();
        this.initColumns();
        this.initDisplayColumns();
        this.initActions();
        this.registerResizeObserver();
        this.listeningSearchControlForValueChanges();
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
                                $orderby: '_id desc'
                            }
                            this.orderFacade.loadOrderList(options);
                        }),
                        takeUntil(this.destroy$)
                    ).subscribe();
                    paginatorTimer$.unsubscribe();
                }
            }
        });
    }

    override registerCoreLayer() {
        this.orderFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.orderFacade.getCountOrders$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalItems = value;
            },
            error: err => {
                throw err;
            }
        });
        this.orderFacade.getOrderList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.items = value;
                this.updateDataSource();
            },
            error: err => {
                throw err;
            }
        });
        this.orderFacade.loadCountOrders();
        this.orderFacade.loadOrderList({
            $skip: 0,
            $top: this.pageSize,
            $orderby: '_id desc'
        });
    }

    override registerSignal() {
        if (this.appState.enableWebsocket) {
            this.socket = io(this.appState.websocketURL, {
                transports: ['websocket'],
                autoConnect: false
            });
            this.socket.connect();
            this.socket.on('new-announcement', _ => {
                this.reloadGrid();
            });
            this.socket.on('update-announcement', _ => {
                this.reloadGrid();
            });
            this.socket.on('delete-announcement', _ => {
                this.reloadGrid();
            });
        }
    }

    listeningSearchControlForValueChanges() {
        this.searchControl.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300)).subscribe({
            next: value => {
                let valid = false;
                this.isSearching = false;
                if (typeof value === 'string' && value.length === 0) {
                    this.filter = '';
                    valid = true;
                }
                if (typeof value === 'string' && value.length > 0) {
                    this.filter = `contains(_customerName, '${value}')`;
                    valid = true;
                    this.isSearching = true;
                }
                if (valid) {
                    const options: OdataParams = {
                        $skip: 0,
                        $top: this.pageSize,
                        $filter: this.filter,
                        $orderby: '_id desc'
                    }
                    this.orderFacade.loadCountOrders(options);
                    if (this.paginator.pageIndex > 0) {
                        this.paginator.firstPage();
                    } else {
                        this.orderFacade.loadOrderList(options);
                    }
                }
            }
        });
    }

    initColumns() {
        this.headers = {
            '_createdBy': 'Created By',
            'createdAt': 'Created At',
            'status': 'Status',
            '_customerId': 'Customer Name',
            'deliveryBy': 'Delivery By',
            'deliveryAt': 'Delivery At',
            'discount': 'discount',
            'total': 'Total',
            'notes': 'Notes'
        }
    }

    initDisplayColumns() {
        this.columns = ['_createdBy', 'createdAt', 'status', '_customerId', 'deliveryBy', 'deliveryAt', 'discount', 'total', 'notes', 'actions'];
    }

    initActions() {
        this.actions = [
            {
                label: 'Edit',
                icon: 'edit',
                enable: true,
                execute: (item: IOrder) => {
                    this.detailsOrderHandler(item);
                }
            },
            {
                label: 'Delete',
                icon: 'delete_forever',
                enable: true,
                execute: (item: IOrder) => {
                    this.deleteOrderHandler(item);
                }
            }
        ];
    }

    updateDataSource() {
        this.dataSource.data = this.items;
    }

    override reloadGrid() {
        this.orderFacade.loadCountOrders();
        this.orderFacade.loadOrderList({
            $skip: 0,
            $top: this.pageSize,
            $orderby: '_id desc'
        });
    }

    newOrderHandler() {
        this.router.navigate(['/order/new']);
    }

    detailsOrderHandler(item: IOrder) {
        this.router.navigate([`/order/${item._id}/details`]);
    }

    deleteOrderHandler(item: IOrder) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            minWidth: '350px',
            maxWidth: '80%',
            disableClose: true,
            autoFocus: false,
            data: {
                title: `Delete Order`,
                content: `<span>Are you sure to delete order: <b>${item._id}</b></span>`,
                actions: [
                    {
                        text: 'Cancel',
                        backgroundColor: 'accent',
                        action: () => {
                            confirmDialogRef.close()
                        }
                    },
                    {
                        text: 'Delete',
                        backgroundColor: 'primary',
                        action: () => {
                            this.orderFacade.deleteOrder$(item._id).subscribe({
                                next: () => {
                                    this.matSnackbar.open(`Order ${item._id} have been deleted.`, 'DELETE', {
                                        duration: 3000,
                                        verticalPosition: 'bottom',
                                        horizontalPosition: 'center'
                                    });
                                    confirmDialogRef.close(true);
                                },
                                error: err => {
                                    throw err;
                                }
                            });
                        }
                    }
                ]
            }
        });
        confirmDialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.reloadGrid();
            }
        });
    }
}
