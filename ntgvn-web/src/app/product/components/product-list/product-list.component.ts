import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, takeUntil, tap, timer } from 'rxjs';
import { BaseMatGridComponent } from '@utils/base/mat-grid';
import { IProduct } from '@utils/schema';
import { ProductFacadeService } from '../../facade/product-facade.service';
import { OdataParams } from '@utils/http';
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
import { ObjectPropertyPipe, ProductCategoryDetailsPipe, WarehouseDetailsPipe } from '@utils/pipe';
import { io } from 'socket.io-client';
import { LogService } from '@utils/service';

@Component({
    selector: 'product-list',
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
        WarehouseDetailsPipe,
        ProductCategoryDetailsPipe,
        ObjectPropertyPipe
    ],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends BaseMatGridComponent<IProduct> implements OnInit, AfterViewInit {
    @ViewChild(MatSort) matSort: MatSort;
    @ViewChild(MatPaginator) override paginator: MatPaginator;

    logService = inject(LogService);
    productFacade = inject(ProductFacadeService);
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
                            this.productFacade.loadProductList(options);
                        }),
                        takeUntil(this.destroy$)
                    ).subscribe();
                    paginatorTimer$.unsubscribe();
                }
            }
        });
    }

    override registerCoreLayer() {
        this.productFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('ProductListComponent', err);
            }
        });
        this.productFacade.getCountProducts$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalItems = value;
            },
            error: err => {
                this.logService.error('ProductListComponent', err);
            }
        });
        this.productFacade.getProductList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.items = value;
                this.updateDataSource();
            },
            error: err => {
                this.logService.error('ProductListComponent', err);
            }
        });
        this.productFacade.loadCountProducts();
        this.productFacade.loadProductList({
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
                    this.filterString = `contains(name, '${value}')`;
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
                    this.productFacade.loadCountProducts();
                    if (this.paginator.pageIndex > 0) {
                        this.paginator.firstPage();
                    } else {
                        this.productFacade.loadProductList(options);
                    }
                }
            }
        });
    }

    initColumns() {
        this.headers = {
            'name': 'Name',
            '_categoryId': 'Category',
            'type': 'Type',
            '_warehouseId': 'Warehouse',
            'unit': 'Unit',
            'quantity': 'Quantity',
            'createdAt': 'Created At',
            'expireAt': 'Expire At',
            'retailPrice': 'Retail Price',
            'wholesalePrice': 'Wholesale Price',
            'collaboratorPrice': 'Collaborator Price'
        }
    }

    initDisplayColumns() {
        this.columns = ['name', '_categoryId', 'type', '_warehouseId', 'unit', 'quantity', 'createdAt', 'expireAt', 'retailPrice', 'wholesalePrice', 'collaboratorPrice', 'actions'];
    }

    initActions() {
        this.actions = [
            {
                label: 'Edit',
                icon: 'edit',
                enable: true,
                display: true,
                execute: (item: IProduct) => {
                    this.detailsProductHandler(item);
                }
            },
            {
                label: 'Delete',
                icon: 'delete_forever',
                enable: true,
                display: true,
                execute: (item: IProduct) => {
                    this.deleteProductHandler(item);
                }
            }
        ];
    }

    updateDataSource() {
        this.dataSource.data = this.items;
    }

    override reloadGrid() {
        this.productFacade.loadCountProducts();
        this.productFacade.loadProductList({
            $skip: 0,
            $top: this.pageSize,
            $orderby: '_id desc'
        });
    }

    newProductHandler() {
        this.router.navigate(['/product/new']);
    }

    detailsProductHandler(item: IProduct) {
        this.router.navigate([`/product/${item._id}/details`]);
    }

    deleteProductHandler(item: IProduct) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            minWidth: '350px',
            maxWidth: '80vw',
            disableClose: true,
            autoFocus: false,
            data: {
                title: `Product - ${item.name}`,
                content: `<span>Are you sure to delete this product</span>`,
                actions: [
                    {
                        text: 'Cancel',
                        backgroundColor: '',
                        execute: () => {
                            confirmDialogRef.close()
                        }
                    },
                    {
                        text: 'Delete',
                        backgroundColor: 'primary',
                        execute: () => {
                            this.productFacade.deleteProduct$(item._id).subscribe({
                                next: () => {
                                    this.matSnackbar.open(`Product ${item.name} have been deleted.`, 'DELETE', {
                                        duration: 3000,
                                        verticalPosition: 'bottom',
                                        horizontalPosition: 'center'
                                    });
                                    confirmDialogRef.close(true);
                                },
                                error: err => {
                                    this.logService.error('ProductListComponent', err);
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
