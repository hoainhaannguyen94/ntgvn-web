import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ResizeObserverService {
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
     * @see https://dev.to/christiankohler/how-to-use-resizeobserver-with-angular-9l5
     */
    observers = new WeakMap();

    observe(element, callbackFn) {
        if (element && callbackFn) {
            const observer = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const width = entry.contentRect.width;
                    const height = entry.contentRect.height;
                    callbackFn(width, height);
                });
            });
            observer.observe(element);
            this.observers.set(element, observer);
        }
    }

    unobserve(element) {
        if (element && this.observers.get(element)) {
            this.observers.get(element).unobserve(element);
            this.observers.delete(element);
        }
    }
}
