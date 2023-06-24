import { Pipe, PipeTransform, inject } from '@angular/core';
import { map } from 'rxjs';
import { EventService } from '../service/event.service';

@Pipe({
    name: 'eventStatusDetails',
    standalone: true,
    pure: true
})
export class EventStatusDetailsPipe implements PipeTransform {
    eventService = inject(EventService);

    transform(eventStatusId: string) {
        return this.eventService.getEventStatus$(eventStatusId).pipe(map(res => res.value));
    }
}
