import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export function handleError(err: HttpErrorResponse): Observable<never> {
    const errorMesseage = `An error occoured: ${err.error.messeage}`;
    console.error(err);
    return throwError(() => errorMesseage);
}
