import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BaseFormSingleComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_EVENT, IGroup, ITag } from '@utils/schema';
import { debounceTime, take, takeUntil } from 'rxjs';
import { EventFacadeService } from '../../facade/event-facade.service';
import { LogService } from '@utils/service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateTime } from 'luxon';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
    selector: 'new-event',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        ErrorMessageComponent
    ],
    templateUrl: './new-event.component.html',
    styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent extends BaseFormSingleComponent implements OnInit {
    log = inject(LogService);
    eventFacade = inject(EventFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);
    ngZone = inject(NgZone);

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

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
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.log.log('NewEventComponent', 'valueChanges', values);
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

    submitHandler() {
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
                completedAt: BLANK_EVENT.extendedProps.completedAt,
                status: 'active'
            }
        }
        this.eventFacade.submitEvent$(event).subscribe({
            next: () => {
                this.matSnackbar.open(`Event ${event.title} have been created.`, 'CREATE', {
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
