import { Pipe, PipeTransform, inject } from '@angular/core';
import { UserService } from '@utils/service';
import { map } from 'rxjs';

@Pipe({
    name: 'userDetails',
    standalone: true,
    pure: true
})
export class UserDetailsPipe implements PipeTransform {
    userService = inject(UserService);

    transform(userId: string) {
        return this.userService.getUser$(userId).pipe(map(res => res.value));
    }
}
