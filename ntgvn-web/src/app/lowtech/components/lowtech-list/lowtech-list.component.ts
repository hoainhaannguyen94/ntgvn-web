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
import { takeUntil } from 'rxjs';
import { IEvent } from '@utils/schema';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

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
        MatCardModule,
        MatDividerModule,
        MatSelectModule,
        TranslocoModule
    ],
    templateUrl: './lowtech-list.component.html',
    styleUrls: ['./lowtech-list.component.scss']
})
export class LowtechListComponent extends BaseComponent implements OnInit {
    eventFacade = inject(LowtechFacadeService);
    dialog = inject(MatDialog);
    matSnackbar = inject(MatSnackBar);

    eventList: IEvent[] = [];
    totalEvent = 0;
    
    searchControl = new FormControl('');
    isSearching = false;

    ngOnInit() {
        this.registerCoreLayer();
        this.registerSignal();
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
                this.totalEvent = value;
            },
            error: err => {
                throw err;
            }
        });
        this.eventFacade.getEventList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventList = value;
            },
            error: err => {
                throw err;
            }
        });
        this.eventFacade.loadCountEvents();
        this.eventFacade.loadEventList({
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

    clearSeach() {
        this.searchControl.setValue('');
    }

    reload() {
        // TODO
    }
}
