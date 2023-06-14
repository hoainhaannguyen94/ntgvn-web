import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';

@Directive({
    selector: '[contextmenuOutside]',
    standalone: true,
    exportAs: 'contextmenuOutside'
})
export class ContextmenuOutsideDirective {
    @Output() onContextmenuOutside = new EventEmitter<MouseEvent>();

    elementRef = inject(ElementRef);

    @HostListener('document:contextmenu', ['$event', '$event.target'])
    onClick(event: MouseEvent, targetElement: HTMLElement) {
        if (targetElement) {
            const isInside = this.elementRef.nativeElement.contains(targetElement);
            !isInside && this.onContextmenuOutside.emit(event);
        }
    }
}
