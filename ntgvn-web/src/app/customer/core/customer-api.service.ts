import { Injectable } from '@angular/core';
import { CustomerService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class CustomerApiService extends CustomerService { }
