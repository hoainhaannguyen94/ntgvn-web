// Angular
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Sanitize HTML
 */
@Pipe({
    name: 'safe',
    standalone: true
})
export class SafePipe implements PipeTransform {
    /**
     * Pipe Constructor
     *
     * @param sanitizer: DomSanitezer
     */
    constructor(private sanitizer: DomSanitizer) { }

    /**
     * Transform
     *
     * @param value: string
     * @param type: string
     */
    transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        switch (type) {
            case 'html':
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                return this.sanitizer.bypassSecurityTrustHtml(value);
        }
    }
}
