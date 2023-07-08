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
import { takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

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
        MatButtonModule
    ],
    templateUrl: './event-filter.component.html',
    styleUrls: ['./event-filter.component.scss']
})
export class EventFilterComponent extends BaseComponent implements OnInit {
    @Output() filterChanges = new EventEmitter<IEventFilter>();
    @Output() filterCancel = new EventEmitter<void>();

    log = inject(LogService);
    eventFacade = inject(EventFacadeService);
    formBuilder = inject(FormBuilder);

    formGroup = this.formBuilder.group({
        start: [BLANK_EVENT_FILTER.start],
        end: [BLANK_EVENT_FILTER.end],
        _statusIds: [BLANK_EVENT_FILTER._statusIds],
        _groupIds: [BLANK_EVENT_FILTER._groupIds],
        priority: [BLANK_EVENT_FILTER.priority],
        _tagIds: [BLANK_EVENT_FILTER._tagIds]
    });

    groupList: IGroup[] = [];
    tagList: ITag[] = [];

    eventStatusList: IEventStatus[] = [];

    ngOnInit() {
        this.registerCoreLayer();
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
        this.eventFacade.getEventStatusList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventStatusList = value;
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
        this.eventFacade.loadEventStatusList({
            $orderby: 'index asc'
        });
        this.eventFacade.loadGroupList({
            $orderby: 'name asc'
        });
        this.eventFacade.loadTagList({
            $orderby: 'name asc'
        });
    }

    cancelHandler() {
        this.filterCancel.emit();
    }

    applyFilterHandler() {
        const filter = this.formGroup.value as IEventFilter;
        this.filterChanges.emit(filter);
    }
}
