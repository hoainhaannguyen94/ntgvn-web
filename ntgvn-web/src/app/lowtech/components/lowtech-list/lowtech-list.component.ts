import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { LowtechFacadeService } from '../../facade/lowtech-facade.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BaseComponent } from '@utils/base/base.component';
import { io } from 'socket.io-client';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs';
import { IEvent, IEventStatus } from '@utils/schema';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { OdataParams } from '@utils/http';
import { groupBy } from 'lodash';
import { ConfirmDialogComponent } from '@utils/component/confirm-dialog';
import { LogService } from '@utils/service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { setDomProperty } from '@utils/function';

@Component({
    selector: 'lowtech-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatDividerModule,
        MatSelectModule,
        MatTooltipModule,
        TranslocoModule,
        ConfirmDialogComponent
    ],
    templateUrl: './lowtech-list.component.html',
    styleUrls: ['./lowtech-list.component.scss']
})
export class LowtechListComponent extends BaseComponent implements OnInit {
    logService = inject(LogService);
    lowtechFacade = inject(LowtechFacadeService);
    dialog = inject(MatDialog);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    eventList: IEvent[] = [];
    totalEvent = 0;

    filterString = '';

    formGroup = this.formBuilder.group({
        search: [],
        from: [],
        to: []
    });

    eventStatusList: IEventStatus[] = [];

    ngOnInit() {
        this.registerCoreLayer();
        this.registerSignal();
        this.registerSearchControlValueChanges();
    }

    override registerCoreLayer() {
        this.lowtechFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('LowtechListComponent', err);
            }
        });
        
        this.lowtechFacade.getCountEvents$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalEvent = value;
            },
            error: err => {
                this.logService.error('LowtechListComponent', err);
            }
        });
        
        this.lowtechFacade.getEventList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                const eventGroups = groupBy(value, event => event.extendedProps._statusId);
                this.eventList = this.eventStatusList
                    .reduce((acc, cur) => {
                        if (eventGroups[cur._id]) {
                            acc = [...acc, ...eventGroups[cur._id]];
                        }
                        return acc;
                    }, [])
                    .reduce((acc, cur) => {
                        cur.extendedProps['_statusName'] = this.eventStatusList.find(eventStatus => eventStatus._id === cur.extendedProps._statusId).name;
                        acc.push(cur);
                        return acc;
                    }, []);
            },
            error: err => {
                this.logService.error('LowtechListComponent', err);
            }
        });
        
        this.lowtechFacade.getEventStatusList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventStatusList = value;
                value.forEach(eventStatus => {
                   setDomProperty(`--${eventStatus.name}-background-color`, eventStatus.backgroundColor);
                   setDomProperty(`--${eventStatus.name}-text-color`, eventStatus.textColor);
                });
                this.lowtechFacade.loadEventList({
                    $filter: `extendedProps/_groupId eq '${this.appState.me._groupId}'`,
                    $orderby: '_id asc'
                });
            },
            error: err => {
                this.logService.error('LowtechListComponent', err);
            }
        });

        this.lowtechFacade.loadCountEvents();
        
        this.lowtechFacade.loadEventStatusList({ $orderby: 'index asc' });
    }

    override registerSignal() {
        if (this.appState.enableWebsocket) {
            this.socket = io(this.appState.websocketURL, {
                transports: ['websocket'],
                autoConnect: false
            });
            this.socket.connect();
            this.socket.on('new-announcement', _ => {
                this.reload();
            });
            this.socket.on('update-announcement', _ => {
                this.reload();
            });
            this.socket.on('delete-announcement', _ => {
                this.reload();
            });
        }
    }

    registerSearchControlValueChanges() {
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300)).subscribe({
            next: value => {
                let searchString = `contains(title, '')`;
                let fromString = '';
                let toString = '';
                this.filterString = '';
                if (value.search) {
                    searchString = `contains(title, '${value.search}')`;
                }
                if (value.from) {
                    fromString = `start ge '${value.from.toISOString()}'`;
                }
                if (value.to) {
                    toString = `start le '${value.to.toISOString()}'`;
                }
                this.filterString += searchString;
                if (fromString) {
                    this.filterString += ` and ${fromString}`;
                }
                if (toString) {
                    this.filterString += ` and ${toString}`;
                }
                const options: OdataParams = {
                    $filter: this.filterString,
                    $orderby: '_id desc'
                }
                this.lowtechFacade.loadEventList(options);
            }
        });
    }

    clearSeach() {
        this.formGroup.get('search').setValue('');
    }

    reload() {
        this.lowtechFacade.loadCountEvents();
        this.lowtechFacade.loadEventStatusList({
            $orderby: 'index asc'
        });
    }

    completeEvent(event: IEvent) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            minWidth: '350px',
            maxWidth: '80vw',
            disableClose: true,
            autoFocus: false,
            data: {
                title: `${event.title}`,
                content: `<span>Are you sure to complete this task</span>`,
                actions: [
                    {
                        text: 'Cancel',
                        backgroundColor: '',
                        execute: () => {
                            confirmDialogRef.close()
                        }
                    },
                    {
                        text: 'Complete',
                        backgroundColor: 'primary',
                        execute: () => {
                            this.lowtechFacade.completeEvent$(event._id).subscribe({
                                next: () => {
                                    this.matSnackbar.open(`Task ${event.title} have been completed.`, 'TASK', {
                                        duration: 3000,
                                        verticalPosition: 'bottom',
                                        horizontalPosition: 'center'
                                    });
                                    confirmDialogRef.close(true);
                                },
                                error: err => {
                                    this.logService.error('LowtechListComponent', err);
                                }
                            });
                        }
                    }
                ]
            }
        });
        confirmDialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.reload();
            }
        });
    }
}
