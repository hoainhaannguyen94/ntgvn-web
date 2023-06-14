import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, HostBinding } from '@angular/core';

@Component({
    selector: 'content-loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './content-loader.component.html',
    styleUrls: ['./content-loader.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentLoaderComponent {
    @Input() width = '80%';
    @Input() height = '14px';
    @Input() shape: 'circle' | 'square' | 'rect' = 'rect';
    @Input() borderRadius = '4px';
    @Input() direction: 'ltr' | 'rtl' = 'ltr';

    get contentLoaderHeight(): string {
        switch (this.shape) {
            case 'circle':
                return this.width;
            case 'square':
                return this.width;
            case 'rect':
                return this.height;
            default:
                return this.height;
        }
    }

    get contentLoaderBorderRadius(): string {
        return this.shape === 'circle' ? '50%' : this.borderRadius;
    }

    @HostBinding('class') class = 'content-loader';
}
