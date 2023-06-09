import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    generateUUID() {
        return uuidv4();
    }

    windowResize() {
        window.dispatchEvent(new Event('resize'));
    }

    convertMapToArray(map: Map<any, any>) {
        return Array.from(map, ([key, value]) => ({ [key]: value }));
    }
}
