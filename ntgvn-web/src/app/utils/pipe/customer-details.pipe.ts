import { Pipe, PipeTransform, inject } from '@angular/core';
import { CustomerService } from '@utils/service';
import { map } from 'rxjs';

@Pipe({
    name: 'customerDetails',
    standalone: true,
    pure: true
})
export class CustomerDetailsPipe implements PipeTransform {
    customerService = inject(CustomerService);

    transform(customerId: string) {
        return this.customerService.getCustomer$(customerId).pipe(map(res => res.value));
    }
}
