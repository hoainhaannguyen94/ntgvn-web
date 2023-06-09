import { Injectable } from '@angular/core';
import { EventService } from '@common/services';

@Injectable({
    providedIn: 'root'
})
export class SchedulerApiService extends EventService { }
