import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';

@Directive({
    selector: '[clickOutside]',
    standalone: true,
    exportAs: 'clickOutside'
})
export class ClickOutsideDirective {
    @Output() onClickOutside = new EventEmitter<MouseEvent>();

    elementRef = inject(ElementRef);

    @HostListener('document:click', ['$event', '$event.target'])
    onClick(event: MouseEvent, targetElement: HTMLElement) {
        if (targetElement) {
            const clickedInside = this.elementRef.nativeElement.contains(targetElement);
            !clickedInside && this.onClickOutside.emit(event);
        }
    }
}
