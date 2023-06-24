import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponent } from '@utils/base/base.component';
import { GroupDetailsPipe, ObjectPropertyPipe } from '@utils/pipe';
import { IEvent, IEventStatus, ITag } from '@utils/schema';
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
    tags: ITag[] = [];

    ngOnInit() {
        this.event = this.dialogData.event;

        this.schedulerFacade.getEventStatus$(this.dialogData.event.extendedProps._statusId).subscribe({
            next: res => {
                this.eventStatus = res.value;
            }
        });

        if (Array.isArray(this.dialogData.event.extendedProps._tagIds) && this.dialogData.event.extendedProps._tagIds.length > 0) {
            this.schedulerFacade.getTagList$({
                $filter: this.dialogData.event.extendedProps._tagIds.reduce((acc, cur) => {
                    if (acc)
                        acc += ` or _id eq '${cur}'`;
                    else
                        acc += `_id eq '${cur}'`;
                    return acc;
                }, '')
            }).subscribe({
                next: res => {
                    this.tags = res.value;
                    console.log(this.tags)
                }
            });
        }
    }

    cancelHandler() {
        this.dialog.closeAll();
    }

    navigateToEventDetails() {
        this.dialog.closeAll();
        this.router.navigate([`/event/${this.event.extendedProps._id}/details`]);
    }
}
