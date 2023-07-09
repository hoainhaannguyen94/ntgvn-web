import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, takeUntil, tap, timer } from 'rxjs';
import { BaseMatGridComponent } from '@utils/base/mat-grid';
import { IEvent, IEventFilter, IEventStatus } from '@utils/schema';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { EventFilterComponent } from '../event-filter/event-filter.component';
import { saveBlob } from '@utils/function';
import { EventAssignDialogComponent } from '../event-assign-dialog/event-assign-dialog.component';
import { LogService } from '@utils/service';

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
        MatSidenavModule,
        EventFilterComponent,
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

    logService = inject(LogService);
    eventFacade = inject(EventFacadeService);
    router = inject(Router);
    dialog = inject(MatDialog);
    matSnackbar = inject(MatSnackBar);

    eventStatusList: IEventStatus[] = [];

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
                this.logService.error('EventListComponent', err);
            }
        });
        this.eventFacade.getCountEvents$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalItems = value;
            },
            error: err => {
                this.logService.error('EventListComponent', err);
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
                        status: this.eventStatusList.find(eventStatus => eventStatus._id === cur.extendedProps._statusId).name
                    }
                    acc.push(event);
                    return acc;
                }, []);
                this.updateDataSource();
            },
            error: err => {
                this.logService.error('EventListComponent', err);
            }
        });
        this.eventFacade.getEventStatusList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventStatusList = value;
                value.forEach(eventStatus => {
                    document.documentElement.style.setProperty(`--${eventStatus.name}-background-color`, eventStatus.backgroundColor);
                    document.documentElement.style.setProperty(`--${eventStatus.name}-text-color`, eventStatus.textColor);
                });
                this.eventFacade.loadEventList({
                    $skip: 0,
                    $top: this.pageSize,
                    $orderby: '_id desc'
                });
            },
            error: err => {
                this.logService.error('EventListComponent', err);
            }
        });
        this.eventFacade.loadCountEvents();
        this.eventFacade.loadEventStatusList({
            $orderby: 'index asc'
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
                    this.eventFacade.loadCountEvents();
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
                display: true,
                execute: (item: IEvent) => {
                    this.detailsEventHandler(item);
                }
            },
            {
                label: 'Delete',
                icon: 'delete_forever',
                enable: true,
                display: true,
                execute: (item: IEvent) => {
                    this.deleteEventHandler(item);
                }
            },
            {
                label: 'Assign',
                icon: 'assignment_ind',
                enable: true,
                display: true,
                execute: (item: IEvent) => {
                    this.assignEventToGroupHandler(item);
                }
            }
        ];
    }

    updateDataSource() {
        this.dataSource.data = this.items;
    }

    override reloadGrid() {
        this.eventFacade.loadCountEvents();
        this.eventFacade.loadEventStatusList({
            $orderby: 'index asc'
        });
    }

    exportEventHandler() {
        this.eventFacade.exportEventListExcel$().subscribe({
            next: res => {
                console.log(res);
                saveBlob(res, 'Tasks.xlsx');
            }
        });
    }

    newEventHandler() {
        this.router.navigate(['/event/new']);
    }

    assignEventToGroupHandler(item) {
        const confirmDialogRef = this.dialog.open(EventAssignDialogComponent, {
            minWidth: '350px',
            maxWidth: '80vw',
            disableClose: true,
            autoFocus: false,
            data: {
                item: item,
                title: `Assign Task`,
                content: '',
                actions: [
                    {
                        text: 'Cancel',
                        backgroundColor: '',
                        execute: () => {
                            confirmDialogRef.close();
                        }
                    },
                    {
                        key: 'save',
                        text: 'Save',
                        backgroundColor: 'primary',
                        execute: () => { }
                    }
                ]
            }
        });
        confirmDialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe({
            next: res => {
                if (res) {
                    this.eventFacade.assignEventToGroup$(item._id, res).subscribe({
                        next: () => {
                            this.reloadGrid();
                            this.matSnackbar.open(`Task ${item.title} have been updated.`, 'ASSIGN', {
                                duration: 3000,
                                verticalPosition: 'bottom',
                                horizontalPosition: 'center'
                            });
                        },
                        error: err => {
                            this.logService.error('EventListComponent', err);
                        }
                    });
                    return;
                }
                this.reloadGrid();
            }
        });
    }

    detailsEventHandler(item: IEvent) {
        this.router.navigate([`/event/${item._id}/details`]);
    }

    deleteEventHandler(item: IEvent) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            minWidth: '350px',
            maxWidth: '80vw',
            disableClose: true,
            autoFocus: false,
            data: {
                title: `Delete Customer`,
                content: `<span>Are you sure to delete event: <b>${item.title}</b></span>`,
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
                                    this.logService.error('EventListComponent', err);
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

    onFilterChangesHandler(filter: IEventFilter) {
        const filters = [];

        let filterStart = '';
        let filterEnd = '';
        let filterStatus = '';
        let filterGroups = '';
        let filterPriorities = '';
        let filterTags = '';

        if (filter.start) {
            filterStart = `start ge '${filter.start}'`;
            filterStart && filters.push(`(${filterStart})`);
        }

        if (filter.end) {
            filterEnd = `end le '${filter.end}'`;
            filterEnd && filters.push(`(${filterEnd})`);
        }

        if (filter._statusIds && !filter._statusIds.includes('all')) {
            filterStatus = filter._statusIds.reduce((acc, cur) => {
                if (acc)
                    acc += ` or extendedProps/_statusId eq '${cur}'`;
                else
                    acc = `extendedProps/_statusId eq '${cur}'`;
                return acc;
            }, '');
            filterStatus && filters.push(`(${filterStatus})`);
        }

        if (filter.priorities) {
            const priorities = filter.priorities.split(',');
            if (priorities.length > 0) {
                filterPriorities = priorities.reduce((acc, cur) => {
                    if (cur) {
                        if (acc)
                            acc += ` or extendedProps/priority eq ${Number(cur)}`;
                        else
                            acc = `extendedProps/priority eq ${Number(cur)}`;
                    }
                    return acc;
                }, '');
                filterPriorities && filters.push(`(${filterPriorities})`);
            }
        }

        if (filter._groupIds && !filter._groupIds.includes('all')) {
            filterGroups = filter._groupIds.reduce((acc, cur) => {
                if (cur) {
                    if (acc)
                        acc += ` or extendedProps/_groupId eq '${cur}'`;
                    else
                        acc = `extendedProps/_groupId eq '${cur}'`;
                }
                return acc;
            }, '');
            filterGroups && filters.push(`(${filterGroups})`);
        }

        if (filter._tagIds && !filter._tagIds.includes('all')) {
            filterTags = filter._tagIds.reduce((acc, cur) => {
                if (cur) {
                    if (acc)
                        acc += ` or contains(extendedProps/_tagIds, '${cur}')`;
                    else
                        acc = `contains(extendedProps/_tagIds, '${cur}')`;
                }
                return acc;
            }, '');
            filterTags && filters.push(`(${filterTags})`);
        }

        const filterString = filters.reduce((acc, cur) => {
            if (acc)
                acc += ` and ${cur}`;
            else
                acc = cur;
            return acc;
        }, '');

        this.eventFacade.loadEventList({
            $filter: filterString,
            $orderby: '_id asc'
        })
    }
}
