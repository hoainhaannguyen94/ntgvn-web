import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { takeUntil, timer } from 'rxjs';
import { BaseComponent } from '@utils/base/base.component';
import { CommonService, LogService } from '@utils/service';
import { SchedulerFacadeService } from './facade/scheduler-facade.service';
import { IEvent, IEventStatus } from '@utils/schema';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from './components/event-details-dialog/event-details-dialog.component';

@Component({
    selector: 'scheduler',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule
    ],
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent extends BaseComponent implements OnInit {
    logService = inject(LogService);
    commonService = inject(CommonService);
    schedulerFacade = inject(SchedulerFacadeService);
    dialog = inject(MatDialog);

    @ViewChild('calendarElement') calendarElement: ElementRef<HTMLElement>;

    totalEvents = 0;
    eventList: IEvent[] = [];

    eventStatusList: Map<string, IEventStatus>;

    initialLocale = 'en';

    calendar: Calendar;
    calendarOptions: CalendarOptions = {
        initialView: 'multiMonthYear',
        plugins: [
            multiMonthPlugin,
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin
        ],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,listWeek'
        },
        editable: false,
        businessHours: true,
        events: [],
        locale: this.initialLocale,
        eventClick: event => {
            this.openEventDetailsDialog(event);
        }
    }

    ngOnInit() {
        this.registerCoreLayer();
        this.registerResizeObserver();
        this.renderCalendar();
    }

    override registerCoreLayer() {
        this.schedulerFacade.isLoading$().pipe().subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('SchedulerComponent', err);
            }
        });

        this.schedulerFacade.getCountEvents$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalEvents = value;
            },
            error: err => {
                this.logService.error('SchedulerComponent', err);
            }
        });

        this.schedulerFacade.getEventList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventList = value;
                this.eventList.forEach(event => {
                    const eventStatus = this.eventStatusList.get(event.extendedProps._statusId);
                    event.backgroundColor = eventStatus.backgroundColor;
                    event.borderColor = eventStatus.backgroundColor;
                    event.textColor = eventStatus.textColor;
                    this.calendar.addEvent(event);
                });
            },
            error: err => {
                this.logService.error('SchedulerComponent', err);
            }
        });

        this.schedulerFacade.getEventStatusList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventStatusList = value.reduce((acc, cur) => {
                    acc.set(cur._id, cur);
                    return acc;
                }, new Map());
                this.schedulerFacade.loadEventList({ $orderby: '_id desc' });
            },
            error: err => {
                this.logService.error('SchedulerComponent', err);
            }
        });

        this.schedulerFacade.loadCountEvents();

        this.schedulerFacade.loadEventStatusList();
    }

    renderCalendar() {
        const calendarReady$ = timer(0, 100).subscribe({
            next: () => {
                if (this.calendarElement) {
                    calendarReady$.unsubscribe();
                    this.calendar = new Calendar(this.calendarElement.nativeElement, this.calendarOptions);
                    this.calendar.render();
                    this.commonService.windowResize();
                    this.listenForLanguageChange();
                }
            }
        });
    }

    listenForLanguageChange() {
        timer(0, 100).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                if (this.calendar && this.appState.language !== this.initialLocale) {
                    this.initialLocale = this.appState.language;
                    this.calendar.setOption('locale', this.appState.language);
                }
            }
        });
    }

    openEventDetailsDialog(event) {
        this.dialog.open(EventDetailsDialogComponent, {
            minWidth: '350px',
            maxWidth: '50vw',
            disableClose: true,
            autoFocus: false,
            data: event
        });
    }
}
