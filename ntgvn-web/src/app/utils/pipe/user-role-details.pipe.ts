import { Pipe, PipeTransform, inject } from '@angular/core';
import { UserService } from '@utils/service';
import { map, of } from 'rxjs';

@Pipe({
    name: 'userRoleDetails',
    standalone: true,
    pure: true
})
export class UserRoleDetailsPipe implements PipeTransform {
    userService = inject(UserService);

    transform(userRoleId: string) {
        if (userRoleId)
            return this.userService.getUserRole$(userRoleId).pipe(map(res => res.value));
        return of(null);
    }
}
