import { Component } from '@angular/core';
import { BaseFormSingleComponent } from './base-form-single.component';
import { isEqual } from 'lodash';

@Component({
    selector: 'base-form-single-details',
    standalone: true,
    template: ''
})
export abstract class BaseFormSingleDetailsComponent<T> extends BaseFormSingleComponent {
    originalData: Partial<T>;

    updateFormHasChanged(value: any) {
        if (!isEqual(this.originalData, value)) {
            this.formHasChanged = true;
        } else {
            this.formHasChanged = false;
        }
    }
}
