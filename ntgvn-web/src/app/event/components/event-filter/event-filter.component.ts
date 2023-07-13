import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseComponent } from '@utils/base/base.component';
import { LogService } from '@utils/service';
import { EventFacadeService } from '../../facade/event-facade.service';
import { BLANK_EVENT_FILTER, IEventFilter, IEventStatus, IGroup, ITag } from '@utils/schema';
import { debounceTime, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { DateTime } from 'luxon';
import { isEqual } from 'lodash';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'event-filter',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatButtonModule,
        MatTooltipModule
    ],
    templateUrl: './event-filter.component.html',
    styleUrls: ['./event-filter.component.scss']
})
export class EventFilterComponent extends BaseComponent implements OnInit {
    @Output() filterChanges = new EventEmitter<IEventFilter>();
    @Output() filterCancel = new EventEmitter<void>();

    logService = inject(LogService);
    eventFacade = inject(EventFacadeService);
    formBuilder = inject(FormBuilder);

    originalData = BLANK_EVENT_FILTER;

    formGroup = this.formBuilder.group({
        start: [BLANK_EVENT_FILTER.start],
        end: [BLANK_EVENT_FILTER.end],
        _statusIds: [BLANK_EVENT_FILTER._statusIds],
        _groupIds: [BLANK_EVENT_FILTER._groupIds],
        priorities: [BLANK_EVENT_FILTER.priorities],
        _tagIds: [BLANK_EVENT_FILTER._tagIds]
    });
    formHasChanged = false;

    groupList: IGroup[] = [];
    tagList: ITag[] = [];

    eventStatusList: IEventStatus[] = [];

    ngOnInit() {
        this.registerCoreLayer();
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe({
            next: value => {
                this.updateFormHasChanged(value);
            }
        });
    }

    updateFormHasChanged(value) {
        if (!isEqual(this.originalData, value)) {
            this.formHasChanged = true;
        } else {
            this.formHasChanged = false;
        }
    }

    override registerCoreLayer() {
        this.eventFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('EventFilterComponent', err);
            }
        });

        this.eventFacade.getEventStatusList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventStatusList = value;
            },
            error: err => {
                this.logService.error('EventFilterComponent', err);
            }
        });

        this.eventFacade.getGroupList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.groupList = value;
            },
            error: err => {
                this.logService.error('EventFilterComponent', err);
            }
        });

        this.eventFacade.getTagList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.tagList = value;
            },
            error: err => {
                this.logService.error('EventFilterComponent', err);
            }
        });

        this.eventFacade.loadEventStatusList({ $orderby: 'index asc' });

        this.eventFacade.loadGroupList({ $orderby: 'name asc' });

        this.eventFacade.loadTagList({ $orderby: 'name asc' });
    }

    clearFilterHandler() {
        this.formGroup.reset();
        this.applyFilterHandler();
    }

    cancelHandler() {
        this.filterCancel.emit();
    }

    applyFilterHandler() {
        const filter = this.formGroup.value as IEventFilter;

        if (filter.start) {
            if (typeof filter.start === 'object')
                filter.start = DateTime.fromISO(filter.start.toISOString()).set({ hour: 0, minute: 0, second: 0 }).toJSDate().toISOString();
            else
                filter.start = DateTime.fromISO(filter.start).set({ hour: 0, minute: 0, second: 0 }).toJSDate().toISOString();
        }

        if (filter.end) {
            if (typeof filter.end === 'object')
                filter.end = DateTime.fromISO(filter.end.toISOString()).set({ hour: 23, minute: 59, second: 59 }).toJSDate().toISOString();
            else
                filter.end = DateTime.fromISO(filter.end).set({ hour: 23, minute: 59, second: 59 }).toJSDate().toISOString();
        }

        this.filterChanges.emit(filter);
    }
}
