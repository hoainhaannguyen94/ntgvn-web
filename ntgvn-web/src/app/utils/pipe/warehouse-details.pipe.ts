import { Pipe, PipeTransform, inject } from '@angular/core';
import { WarehouseService } from '@utils/service';
import { map, of } from 'rxjs';

@Pipe({
    name: 'warehouseDetails',
    standalone: true,
    pure: true
})
export class WarehouseDetailsPipe implements PipeTransform {
    warehouseService = inject(WarehouseService);

    transform(warehouseId: string) {
        if (warehouseId)
            return this.warehouseService.getWarehouse$(warehouseId).pipe(map(res => res.value));
        return of(null);
    }
}
