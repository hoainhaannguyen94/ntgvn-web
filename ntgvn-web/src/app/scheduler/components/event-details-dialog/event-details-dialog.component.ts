import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponent } from '@utils/base/base.component';
import { GroupDetailsPipe, ObjectPropertyPipe } from '@utils/pipe';
import { IEvent, IEventStatus } from '@utils/schema';
import { SchedulerFacadeService } from '../../facade/scheduler-facade.service';
import { Router } from '@angular/router';

@Component({
    selector: 'event-details-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        GroupDetailsPipe,
        ObjectPropertyPipe
    ],
    templateUrl: './event-details-dialog.component.html',
    styleUrls: ['./event-details-dialog.component.scss']
})
export class EventDetailsDialogComponent extends BaseComponent implements OnInit {
    dialogData = inject(MAT_DIALOG_DATA);
    schedulerFacade = inject(SchedulerFacadeService);
    router = inject(Router);
    dialog = inject(MatDialog);

    event: IEvent;
    eventStatus: IEventStatus;

    ngOnInit() {
        this.event = this.dialogData.event;
        this.schedulerFacade.getEventStatus$(this.dialogData.event.extendedProps._statusId).subscribe({
            next: res => {
                this.eventStatus = res.value;
            }
        });
    }

    cancelHandler() {
        this.dialog.closeAll();
    }

    navigateToEventDetails() {
        this.dialog.closeAll();
        this.router.navigate([`/event/${this.event.extendedProps._id}/details`]);
    }
}
