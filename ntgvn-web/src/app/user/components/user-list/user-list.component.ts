import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, takeUntil, tap, timer } from 'rxjs';
import { BaseMatGridComponent } from '@utils/base/mat-grid';
import { IUser } from '@utils/schema';
import { UserFacadeService } from '../../facade/user-facade.service';
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
import { ObjectPropertyPipe, GroupDetailsPipe, UserRoleDetailsPipe } from '@utils/pipe';
import { io } from 'socket.io-client';
import { LogService } from '@utils/service';

@Component({
    selector: 'user-list',
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
        UserRoleDetailsPipe,
        ObjectPropertyPipe,
        GroupDetailsPipe
    ],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BaseMatGridComponent<IUser> implements OnInit, AfterViewInit {
    @ViewChild(MatSort) matSort: MatSort;
    @ViewChild(MatPaginator) override paginator: MatPaginator;

    logService = inject(LogService);
    userFacade = inject(UserFacadeService);
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
                            this.userFacade.loadUserList(options);
                        }),
                        takeUntil(this.destroy$)
                    ).subscribe();
                    paginatorTimer$.unsubscribe();
                }
            }
        });
    }

    override registerCoreLayer() {
        this.userFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('UserListComponent', err);
            }
        });
        this.userFacade.getCountUsers$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalItems = value;
            },
            error: err => {
                this.logService.error('UserListComponent', err);
            }
        });
        this.userFacade.getUserList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.items = value;
                this.updateDataSource();
            },
            error: err => {
                this.logService.error('UserListComponent', err);
            }
        });
        this.userFacade.loadCountUsers();
        this.userFacade.loadUserList({
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
                    this.userFacade.loadCountUsers();
                    if (this.paginator.pageIndex > 0) {
                        this.paginator.firstPage();
                    } else {
                        this.userFacade.loadUserList(options);
                    }
                }
            }
        });
    }

    initColumns() {
        this.headers = {
            'name': 'Name',
            'address': 'Address',
            'phoneNumber': 'Phone Number',
            'email': 'Email',
            'role': 'Role',
            '_groupId': 'Group'
        }
    }

    initDisplayColumns() {
        this.columns = ['name', 'address', 'phoneNumber', 'email', 'role', '_groupId', 'actions'];
    }

    initActions() {
        this.actions = [
            {
                label: 'Edit',
                icon: 'edit',
                enable: true,
                display: true,
                execute: (item: IUser) => {
                    this.detailsUserHandler(item);
                }
            },
            {
                label: 'Delete',
                icon: 'delete_forever',
                enable: true,
                display: true,
                execute: (item: IUser) => {
                    this.deleteUserHandler(item);
                }
            }
        ];
    }

    updateDataSource() {
        this.dataSource.data = this.items;
    }

    override reloadGrid() {
        this.userFacade.loadCountUsers();
        this.userFacade.loadUserList({
            $skip: 0,
            $top: this.pageSize,
            $orderby: '_id desc'
        });
    }

    newUserHandler() {
        this.router.navigate(['/user/new']);
    }

    detailsUserHandler(item: IUser) {
        this.router.navigate([`/user/${item._id}/details`]);
    }

    deleteUserHandler(item: IUser) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            minWidth: '350px',
            maxWidth: '80vw',
            disableClose: true,
            autoFocus: false,
            data: {
                title: `Delete Customer`,
                content: `<span>Are you sure to delete user: <b>${item.name}</b></span>`,
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
                            this.userFacade.deleteUser$(item._id).subscribe({
                                next: () => {
                                    this.matSnackbar.open(`User ${item.name} have been deleted.`, 'DELETE', {
                                        duration: 3000,
                                        verticalPosition: 'bottom',
                                        horizontalPosition: 'center'
                                    });
                                    confirmDialogRef.close(true);
                                },
                                error: err => {
                                    this.logService.error('UserListComponent', err);
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
