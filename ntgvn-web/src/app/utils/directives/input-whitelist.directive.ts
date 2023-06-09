import { Directive, HostListener, Input, ElementRef, OnChanges, SimpleChanges, inject } from '@angular/core';

@Directive({
    selector: '[inputWhitelist]',
    standalone: true,
    exportAs: 'inputWhitelists'
})
export class InputWhitelistDirective implements OnChanges {
    @Input() target = '';
    @Input() whiteListKeys: string[] = [];

    elementRef = inject(ElementRef<HTMLElement>);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['target'] && changes['target'].currentValue !== changes['target'].previousValue) {
            this.elementRef.nativeElement.setAttribute('data-target', changes['target'].currentValue);
        }
    }

    @HostListener('document:keydown', ['$event', '$event.target'])
    onKeydownHandler(event: KeyboardEvent, targetElement: HTMLElement) {
        if (targetElement.dataset['target'] && targetElement.dataset['target'] === this.target && !this.whiteListKeys.some(item => item === event.key)
        ) {
            event.preventDefault();
        }
        // if (targetElement.dataset['target'] && targetElement.dataset['target'] === this.target && !this.whiteListKeys.includes(event.key)) {
        //     event.preventDefault();
        // }
    }
}
