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
        TranslocoModule
    ],
    templateUrl: './lowtech-list.component.html',
    styleUrls: ['./lowtech-list.component.scss']
})
export class LowtechListComponent extends BaseComponent implements OnInit {
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
                throw err;
            }
        });
        this.lowtechFacade.getCountEvents$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalEvent = value;
            },
            error: err => {
                throw err;
            }
        });
        this.lowtechFacade.getEventList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventList = value;
            },
            error: err => {
                throw err;
            }
        });
        this.lowtechFacade.getEventStatusList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventStatusList = value;
                value.forEach(event => {
                    document.documentElement.style.setProperty(`--${event.name}-background-color`, event.backgroundColor);
                    document.documentElement.style.setProperty(`--${event.name}-text-color`, event.textColor);
                });
            },
            error: err => {
                throw err;
            }
        });
        this.lowtechFacade.loadCountEvents();
        this.lowtechFacade.loadEventList({
            $orderby: '_id desc'
        });
        this.lowtechFacade.loadEventStatusList({
            $orderby: 'name asc'
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
            next: values => {
                let searchString = `contains(title, '')`;
                let fromString = '';
                let toString = '';
                this.filterString = '';
                if (values.search) {
                    searchString = `contains(title, '${values.search}')`;
                }
                if (values.from) {
                    fromString = `start ge '${values.from.toISOString()}'`;
                }
                if (values.to) {
                    toString = `start le '${values.to.toISOString()}'`;
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
        // TODO
    }
}
