import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { takeUntil, timer } from 'rxjs';
import { BaseComponent } from '@utils/base/base.component';
import { CommonService } from '@utils/service';
import { SchedulerFacadeService } from './facade/scheduler-facade.service';
import { IEvent } from '@utils/schema';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
    selector: 'scheduler',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent extends BaseComponent implements OnInit {
    commonService = inject(CommonService);
    schedulerFacade = inject(SchedulerFacadeService);

    @ViewChild('calendarElement') calendarElement: ElementRef<HTMLElement>;

    totalEvents = 0;
    eventList: IEvent[] = [];

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
        editable: true,
        businessHours: true,
        events: [
            {
                title: 'All Day Event',
                start: '2023-05-01',
                description: 'AAA'
            }
        ],
        locale: this.initialLocale
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
                throw err;
            }
        });
        this.schedulerFacade.getCountEvents$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalEvents = value;
            },
            error: err => {
                throw err;
            }
        });
        this.schedulerFacade.getEventList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.eventList = value;
                this.eventList.forEach(event => {
                    this.calendar.addEvent(event);
                });
            },
            error: err => {
                throw err;
            }
        });
        this.schedulerFacade.loadCountEvents();
        this.schedulerFacade.loadEventList({ $orderby: '_id desc' });
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
}
