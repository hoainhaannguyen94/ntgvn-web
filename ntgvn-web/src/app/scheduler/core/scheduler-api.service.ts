import { Injectable } from '@angular/core';
import { EventService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class SchedulerApiService extends EventService { }
