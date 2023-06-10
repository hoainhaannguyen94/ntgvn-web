import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { environment } from '@environment';

export function AppInterceptor(req: HttpRequest<unknown>,
    next: HttpHandlerFn) {
    const clonedRequest = req.clone({
        headers: req.headers
            .set('Domain', environment.domain)
            .set('Authorization', localStorage.getItem('token') ?? '')
    })
    return next(clonedRequest);
}
