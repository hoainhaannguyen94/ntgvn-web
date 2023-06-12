import { Pipe, PipeTransform, inject } from '@angular/core';
import { GroupService } from '@common/services';
import { map } from 'rxjs';

@Pipe({
    name: 'groupDetails',
    standalone: true,
    pure: true
})
export class GroupDetailsPipe implements PipeTransform {
    groupService = inject(GroupService);

    transform(groupId: string) {
        return this.groupService.getGroup$(groupId).pipe(map(res => res.value));
    }
}
