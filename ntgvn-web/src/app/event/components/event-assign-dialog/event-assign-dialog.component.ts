import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BaseComponent } from '@utils/base/base.component';
import { LogService } from '@utils/service';
import { EventFacadeService } from '../../facade/event-facade.service';
import { IGroup } from '@utils/schema';
import { takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'event-assign-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule
    ],
    templateUrl: './event-assign-dialog.component.html',
    styleUrls: ['./event-assign-dialog.component.scss']
})
export class EventAssignDialogComponent extends BaseComponent implements OnInit {
    logService = inject(LogService);
    dialogRef = inject(MatDialogRef);
    dialogData = inject(MAT_DIALOG_DATA);
    eventFacade = inject(EventFacadeService);

    item;

    groupList: IGroup[] = [];

    _groupIdFormControl = new FormControl();

    ngOnInit() {
        this.item = this.dialogData.item;
        if (this.item._groupId)
            this._groupIdFormControl.setValue(this.item._groupId);
        this.registerCoreLayer();
    }

    override registerCoreLayer() {
        this.eventFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('EventAssignDialogComponent', err);
            }
        });
        this.eventFacade.getGroupList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.groupList = value;
            },
            error: err => {
                this.logService.error('EventAssignDialogComponent', err);
            }
        });
        this.eventFacade.loadGroupList({
            $orderby: 'name asc'
        });
    }

    assignHandler() {
        this.dialogRef.close(this._groupIdFormControl.value);
    }
}
