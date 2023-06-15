import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, ViewChild, inject } from '@angular/core';
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
import { BLANK_EVENT, IEvent, IGroup, ITag } from '@utils/schema';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { EventFacadeService } from '../../facade/event-facade.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateTime } from 'luxon';
import { MatSelectModule } from '@angular/material/select';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

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
    ngZone = inject(NgZone);

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    eventId = '';
    event = BLANK_EVENT;

    override formGroup = this.formBuilder.group({
        title: [BLANK_EVENT.title, [Validators.required]],
        description: [BLANK_EVENT.extendedProps.description],
        start: [BLANK_EVENT.start, [Validators.required]],
        end: [BLANK_EVENT.end, [Validators.required]],
        backgroundColor: [BLANK_EVENT.backgroundColor],
        borderColor: [BLANK_EVENT.borderColor],
        textColor: [BLANK_EVENT.textColor],
        _groupId: [BLANK_EVENT.extendedProps._groupId],
        priority: [BLANK_EVENT.extendedProps.priority],
        _tagIds: [BLANK_EVENT.extendedProps._tagIds]
    });

    groupList: IGroup[] = [];
    tagList: ITag[] = [];

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this.ngZone.onStable.pipe(take(1)).subscribe({
            next: () => this.autosize.resizeToFitContent(true)
        });
    }

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
                const formData = {
                    title: value.title,
                    description: value.extendedProps.description,
                    start: value.start,
                    end: value.end,
                    backgroundColor: value.backgroundColor,
                    borderColor: value.borderColor,
                    textColor: value.textColor,
                    _groupId: value.extendedProps._groupId,
                    priority: value.extendedProps.priority,
                    _tagIds: value.extendedProps._tagIds
                }
                this.originalData = cloneDeep(formData);
                this.formGroup.patchValue(formData);
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
        this.eventFacade.getTagList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.tagList = value;
            },
            error: err => {
                throw err;
            }
        });
        this.eventFacade.loadGroupList();
        this.eventFacade.loadTagList();
    }

    cancelHandler() {
        this.router.navigate(['/event/list']);
    }

    updateHandler() {
        const formData = this.formGroup.value as any;
        if (typeof formData.start !== 'string') {
            formData.start = formData.start.toISOString();
        }
        if (typeof formData.end !== 'string') {
            formData.end = formData.end.toISOString();
        }
        formData.start = DateTime.fromISO(formData.start).set({ hour: 0, minute: 0, second: 0 }).toJSDate().toISOString();
        formData.end = DateTime.fromISO(formData.end).set({ hour: 23, minute: 59, second: 59 }).toJSDate().toISOString();
        const event = {
            title: formData.title,
            start: formData.start,
            end: formData.end,
            backgroundColor: formData.backgroundColor,
            borderColor: formData.borderColor,
            textColor: formData.textColor,
            extendedProps: {
                _groupId: formData._groupId,
                priority: formData.priority,
                description: formData.description,
                _tagIds: formData._tagIds,
                completedAt: this.event.extendedProps.completedAt
            }
        }
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
