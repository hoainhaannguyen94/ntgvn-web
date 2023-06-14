import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
    selector: 'error-message',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './error-message.component.html',
    styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnChanges {
    @Input() errors: ValidationErrors | null | undefined;
    @Input() target = '';

    errMessage = '';

    ngOnChanges() {
        if (this.errors) {
            for (const err in this.errors) {
                if (Object.prototype.hasOwnProperty.call(this.errors, err)) {
                    switch (err) {
                        case 'required':
                            this.errMessage = `${this.target} is required.`
                            break;
                        case 'minlength':
                            this.errMessage = `MinLength: ${this.errors[err].requiredLength} character.`
                            break;
                        case 'maxlength':
                            this.errMessage = `MaxLength: ${this.errors[err].requiredLength} character.`
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
}
