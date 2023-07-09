import { Pipe, PipeTransform, inject } from '@angular/core';
import { GroupService } from '@utils/service';
import { map, of } from 'rxjs';

@Pipe({
    name: 'groupDetails',
    standalone: true,
    pure: true
})
export class GroupDetailsPipe implements PipeTransform {
    groupService = inject(GroupService);

    transform(groupId: string) {
        if (groupId)
            return this.groupService.getGroup$(groupId).pipe(map(res => res.value));
        return of(null);
    }
}
