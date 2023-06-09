import { Injectable } from '@angular/core';
import { AuthService } from '@common/services';

@Injectable({
    providedIn: 'root'
})
export class LoginApiService extends AuthService { }
