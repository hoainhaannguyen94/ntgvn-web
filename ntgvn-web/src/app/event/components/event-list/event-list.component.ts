import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, takeUntil, tap, timer } from 'rxjs';
import { BaseMatGridComponent } from '@utils/base/mat-grid';
import { IEvent } from '@utils/schema';
import { EventFacadeService } from '../../facade/event-facade.service';
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
import { UserDetailsPipe, ObjectPropertyPipe, GroupDetailsPipe } from '@utils/pipe';
import { io } from 'socket.io-client';
import { TagsDetailsPipe } from 'src/app/utils/pipe/tags-details.pipe';

@Component({
    selector: 'event-list',
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
        GroupDetailsPipe,
        TagsDetailsPipe
    ],
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.scss']
})
export class EventListComponent extends BaseMatGridComponent<IEvent> implements OnInit, AfterViewInit {
    @ViewChild(MatSort) matSort: MatSort;
    @ViewChild(MatPaginator) override paginator: MatPaginator;

    eventFacade = inject(EventFacadeService);
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
                                $filter: this.filterString
                            }
                            this.eventFacade.loadEventList(options);
                        }),
                        takeUntil(this.destroy$)
                    ).subscribe();
                    paginatorTimer$.unsubscribe();
                }
            }
        });
    }

    override registerCoreLayer() {
        this.eventFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.eventFacade.getCountEvents$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalItems = value;
            },
            error: err => {
                throw err;
            }
        });
        this.eventFacade.getEventList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.items = value.reduce((acc, cur) => {
                    const event = {
                        _id: cur._id,
                        title: cur.title,
                        description: cur.extendedProps.description,
                        start: cur.start,
                        end: cur.end,
                        _groupId: cur.extendedProps._groupId,
                        priority: cur.extendedProps.priority,
                        _tagIds: cur.extendedProps._tagIds,
                        status: cur.extendedProps.status
                    }
                    acc.push(event);
                    return acc;
                }, []);
                this.updateDataSource();
            },
            error: err => {
                throw err;
            }
        });
        this.eventFacade.loadCountEvents();
        this.eventFacade.loadEventList({
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
                    this.filterString = `contains(title, '${value}')`;
                    valid = true;
                    this.isSearching = true;
                }
                if (valid) {
                    const options: OdataParams = {
                        $skip: 0,
                        $top: this.pageSize,
                        $filter: this.filterString
                    }
                    this.eventFacade.loadCountEvents(options);
                    if (this.paginator.pageIndex > 0) {
                        this.paginator.firstPage();
                    } else {
                        this.eventFacade.loadEventList(options);
                    }
                }
            }
        });
    }

    initColumns() {
        this.headers = {
            'title': 'Title',
            'description': 'Description',
            'start': 'Start',
            'end': 'End',
            'status': 'Status',
            '_groupId': 'Group',
            'priority': 'Priority',
            '_tagIds': 'Tags'
        }
    }

    initDisplayColumns() {
        this.columns = ['title', 'description', 'start', 'end', 'status', '_groupId', 'priority', '_tagIds', 'actions'];
    }

    initActions() {
        this.actions = [
            {
                label: 'Edit',
                icon: 'edit',
                enable: true,
                execute: (item: IEvent) => {
                    this.detailsEventHandler(item);
                }
            },
            {
                label: 'Delete',
                icon: 'delete_forever',
                enable: true,
                execute: (item: IEvent) => {
                    this.deleteEventHandler(item);
                }
            }
        ];
    }

    updateDataSource() {
        this.dataSource.data = this.items;
    }

    override reloadGrid() {
        this.eventFacade.loadCountEvents();
        this.eventFacade.loadEventList({
            $skip: 0,
            $top: this.pageSize,
            $orderby: '_id desc'
        });
    }

    newEventHandler() {
        this.router.navigate(['/event/new']);
    }

    detailsEventHandler(item: IEvent) {
        this.router.navigate([`/event/${item._id}/details`]);
    }

    deleteEventHandler(item: IEvent) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            minWidth: '350px',
            maxWidth: '80%',
            disableClose: true,
            autoFocus: false,
            data: {
                title: `Delete Customer`,
                content: `<span>Are you sure to delete event: <b>${item.title}</b></span>`,
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
                            this.eventFacade.deleteEvent$(item._id).subscribe({
                                next: () => {
                                    this.matSnackbar.open(`Event ${item.title} have been deleted.`, 'DELETE', {
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
