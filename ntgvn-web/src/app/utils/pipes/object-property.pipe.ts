import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'objectProperty',
    standalone: true,
    pure: true
})
export class ObjectPropertyPipe implements PipeTransform {
    transform(object: any, property: string): any {
        if (object && property in object) {
            return object[property];
        }
        return null;
    }
}
