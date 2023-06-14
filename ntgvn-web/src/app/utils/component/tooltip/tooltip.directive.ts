import { ComponentRef, Directive, ElementRef, EmbeddedViewRef, HostListener, Input, ViewContainerRef, inject } from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { TooltipPosition, TooltipTheme } from './tooltip.enum';

@Directive({
    selector: '[tooltip]',
    standalone: true,
    exportAs: 'tooltip'
})
export class TooltipDirective {
    @Input() tooltip = '';
    @Input() position: string = TooltipPosition.DEFAULT;
    @Input() theme: string = TooltipTheme.DEFAULT;
    @Input() showDelay = 0;
    @Input() hideDelay = 0;

    componentRef?: ComponentRef<any> | null;
    showTimeout?: number;
    hideTimeout?: number;
    touchTimeout?: number;

    elementRef = inject(ElementRef);
    viewContainerRef = inject(ViewContainerRef);

    @HostListener('mouseenter')
    onMouseEnter() {
        this.initializeTooltip();
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.setHideTooltipTimeout();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove($event: MouseEvent) {
        if (this.componentRef && this.position === TooltipPosition.DYNAMIC) {
            this.componentRef.instance.left = $event.clientX;
            this.componentRef.instance.top = $event.clientY;
            this.componentRef.instance.tooltip = this.tooltip;
        }
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart($event: TouchEvent) {
        $event.preventDefault();
        window.clearTimeout(this.touchTimeout);
        this.touchTimeout = window.setTimeout(this.initializeTooltip.bind(this), 500);
    }

    @HostListener('touchend')
    onTouchEnd() {
        window.clearTimeout(this.touchTimeout);
        this.setHideTooltipTimeout();
    }

    initializeTooltip() {
        if (!this.componentRef) {
            window.clearInterval(this.hideDelay);
            this.componentRef = this.viewContainerRef.createComponent(TooltipComponent);
            const [tooltipDOMElement] = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes;
            this.setTooltipComponentProperties();
            document.body.appendChild(tooltipDOMElement);
            this.showTimeout = window.setTimeout(this.showTooltip.bind(this), this.showDelay);
        }
    }

    setTooltipComponentProperties() {
        if (this.componentRef) {
            this.componentRef.instance.tooltip = this.tooltip;
            this.componentRef.instance.position = this.position;
            this.componentRef.instance.theme = this.theme;
            const { left, right, top, bottom } = this.elementRef.nativeElement.getBoundingClientRect();
            switch (this.position) {
                case TooltipPosition.BELOW: {
                    this.componentRef.instance.left = Math.round((right - left) / 2 + left);
                    this.componentRef.instance.top = Math.round(bottom);
                    break;
                }
                case TooltipPosition.ABOVE: {
                    this.componentRef.instance.left = Math.round((right - left) / 2 + left);
                    this.componentRef.instance.top = Math.round(top);
                    break;
                }
                case TooltipPosition.RIGHT: {
                    this.componentRef.instance.left = Math.round(right);
                    this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
                    break;
                }
                case TooltipPosition.LEFT: {
                    this.componentRef.instance.left = Math.round(left);
                    this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    showTooltip() {
        if (this.componentRef) {
            this.componentRef.instance.visible = true;
        }
    }

    setHideTooltipTimeout() {
        this.hideTimeout = window.setTimeout(this.destroy.bind(this), this.hideDelay);
    }

    ngOnDestroy() {
        this.destroy();
    }

    destroy() {
        if (this.componentRef) {
            window.clearInterval(this.showTimeout);
            window.clearInterval(this.hideDelay);
            this.viewContainerRef.clear();
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}
