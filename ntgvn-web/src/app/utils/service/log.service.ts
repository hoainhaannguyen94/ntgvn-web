import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
    providedIn: 'root'
})
export class LogService {
    info(target = 'LogService', ...agrs: any) {
        if (!environment.production) {
            console.log(`********** ${target} **********`);
            console.log(...agrs);
        }
    }
}
