import { Injectable } from '@angular/core';
import { UserService } from '@common/services';

@Injectable({
    providedIn: 'root'
})
export class UserApiService extends UserService { }
