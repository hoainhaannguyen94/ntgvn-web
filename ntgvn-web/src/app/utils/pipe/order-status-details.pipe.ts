import { Pipe, PipeTransform, inject } from '@angular/core';
import { OrderService } from '@utils/service';
import { map, of } from 'rxjs';

@Pipe({
    name: 'orderStatusDetails',
    standalone: true,
    pure: true
})
export class OrderStatusDetailsPipe implements PipeTransform {
    orderService = inject(OrderService);

    transform(orderStatusId: string) {
        if (orderStatusId)
            return this.orderService.getOrderStatus$(orderStatusId).pipe(map(res => res.value));
        return of(null);
    }
}
