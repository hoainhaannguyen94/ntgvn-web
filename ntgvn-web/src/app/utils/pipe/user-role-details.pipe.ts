import { Pipe, PipeTransform, inject } from '@angular/core';
import { UserService } from '@utils/service';
import { map } from 'rxjs';

@Pipe({
    name: 'userRoleDetails',
    standalone: true,
    pure: true
})
export class UserRoleDetailsPipe implements PipeTransform {
    userService = inject(UserService);

    transform(userRoleId: string) {
        return this.userService.getUserRole$(userRoleId).pipe(map(res => res.value));
    }
}
