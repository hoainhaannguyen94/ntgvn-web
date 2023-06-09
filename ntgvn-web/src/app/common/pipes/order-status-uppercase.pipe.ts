import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderStatusUppercase',
    standalone: true,
    pure: true
})
export class OrderStatusUppercasePipe implements PipeTransform {
    transform(status: string): any {
        if (status) {
            const _status = status.trim().toUpperCase().replace(/-/g, ' ');
            return _status;
        }
        return null;
    }
}
