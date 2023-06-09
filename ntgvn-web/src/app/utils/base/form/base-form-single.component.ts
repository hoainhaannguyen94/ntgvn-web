import { Component } from '@angular/core';
import { BaseFormComponent } from './base-form.component';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'base-form-single',
    standalone: true,
    template: ''
})
export abstract class BaseFormSingleComponent extends BaseFormComponent {
    formGroup: FormGroup;
    formHasChanged = false;
    formValid = false;
}
