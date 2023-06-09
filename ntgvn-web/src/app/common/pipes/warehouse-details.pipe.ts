import { Pipe, PipeTransform, inject } from '@angular/core';
import { WarehouseService } from '@common/services';
import { map } from 'rxjs';

@Pipe({
    name: 'warehouseDetails',
    standalone: true,
    pure: true
})
export class WarehouseDetailsPipe implements PipeTransform {
    warehouseService = inject(WarehouseService);

    transform(warehouseId: string) {
        return this.warehouseService.getWarehouse$(warehouseId).pipe(map(res => res.value));
    }
}
