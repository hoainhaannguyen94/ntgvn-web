import { Injectable } from '@angular/core';
import { CustomerService } from '@common/services';

@Injectable({
    providedIn: 'root'
})
export class CustomerApiService extends CustomerService { }
