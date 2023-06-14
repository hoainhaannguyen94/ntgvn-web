import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormSingleDetailsComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_EVENT, IEvent, IGroup } from '@utils/schema';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { EventFacadeService } from '../../facade/event-facade.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateTime } from 'luxon';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'event-details',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        ErrorMessageComponent
    ],
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent extends BaseFormSingleDetailsComponent<IEvent> implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    eventFacade = inject(EventFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    eventId = '';
    event = BLANK_EVENT;

    override formGroup = this.formBuilder.group({
        _id: [BLANK_EVENT._id],
        title: [BLANK_EVENT.title, [Validators.required]],
        start: [BLANK_EVENT.start, [Validators.required]],
        end: [BLANK_EVENT.end, [Validators.required]],
        backgroundColor: [BLANK_EVENT.backgroundColor],
        borderColor: [BLANK_EVENT.borderColor],
        textColor: [BLANK_EVENT.textColor],
        _groupId: [BLANK_EVENT.extendedProps._groupId]
    });

    groupList: IGroup[] = [];

    ngOnInit() {
        this.registerCoreLayer();
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.eventId = value['id']
                this.eventFacade.loadEvent(this.eventId);
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.formValid = this.formGroup.valid;
            this.updateFormHasChanged(values);
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
        this.eventFacade.getEvent$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.event = value;
                this.originalData = cloneDeep(value);
                this.formGroup.patchValue(this.event);
            },
            error: err => {
                throw err;
            }
        });
        this.eventFacade.getGroupList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.groupList = value;
            },
            error: err => {
                throw err;
            }
        });
        this.eventFacade.loadGroupList();
    }

    cancelHandler() {
        this.router.navigate(['/event/list']);
    }

    updateHandler() {
        const event = this.formGroup.value as any;
        if (typeof event.start !== 'string') {
            event.start = event.start.toISOString();
        }
        if (typeof event.end !== 'string') {
            event.end = event.end.toISOString();
        }
        event.start = DateTime.fromISO(event.start).set({ hour: 0, minute: 0, second: 0 }).toJSDate().toISOString();
        event.end = DateTime.fromISO(event.end).set({ hour: 23, minute: 59, second: 59 }).toJSDate().toISOString();
        delete event._id;
        this.eventFacade.updateEvent$(this.eventId, event).subscribe({
            next: () => {
                this.matSnackbar.open(`Event ${event.title} have been updated.`, 'UPDATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/event/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}
