import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { IAnnouncement } from '@common/schemas';
import { BaseComponent } from '@utils/base/base.component';
import { AnnouncementFacadeService } from '../../facade/announcement-facade.service';
import { takeUntil } from 'rxjs';
import { UserDetailsPipe } from '@common/pipes';
import { ObjectPropertyPipe, SafePipe } from '@utils/pipes';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmDialogComponent } from '@utils/components/confirm-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { io } from 'socket.io-client';

@Component({
    selector: 'announcement-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatSnackBarModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        UserDetailsPipe,
        ObjectPropertyPipe,
        ConfirmDialogComponent,
        SafePipe
    ],
    templateUrl: './announcement-list.component.html',
    styleUrls: ['./announcement-list.component.scss']
})
export class AnnouncementListComponent extends BaseComponent implements OnInit {
    announcementFacade = inject(AnnouncementFacadeService);
    router = inject(Router);
    dialog = inject(MatDialog);
    matSnackbar = inject(MatSnackBar);

    items: IAnnouncement[] = [];
    totalItems = 0;

    ngOnInit() {
        this.registerCoreLayer();
        this.registerSignal();
    }

    override registerCoreLayer() {
        this.announcementFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.announcementFacade.getCountAnnouncements$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalItems = value;
            },
            error: err => {
                throw err;
            }
        });
        this.announcementFacade.getAnnouncementList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.items = value;
            },
            error: err => {
                throw err;
            }
        });
        this.announcementFacade.loadCountAnnouncements();
        this.announcementFacade.loadAnnouncementList({
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

    reload() {
        this.announcementFacade.loadCountAnnouncements();
        this.announcementFacade.loadAnnouncementList({
            $orderby: '_id desc'
        });
    }

    newAnnouncementHandler() {
        this.router.navigate(['/announcement/new']);
    }

    detailsAnnouncementHandler(item: IAnnouncement) {
        this.router.navigate([`/announcement/${item._id}/details`]);
    }

    deleteAnnouncementHandler(item: IAnnouncement) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            minWidth: '350px',
            maxWidth: '80%',
            disableClose: true,
            autoFocus: false,
            data: {
                title: `Delete Announcement`,
                content: `<span>Are you sure to delete Announcement: <b>${item.title}</b></span>`,
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
                            this.announcementFacade.deleteAnnouncement$(item._id).subscribe({
                                next: () => {
                                    this.matSnackbar.open(`Room ${item.title} have been deleted.`, 'DELETE', {
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
                this.reload();
            }
        });
    }
}
