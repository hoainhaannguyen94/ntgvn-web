import { Injectable } from '@angular/core';
import { AuthService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class LoginApiService extends AuthService { }
