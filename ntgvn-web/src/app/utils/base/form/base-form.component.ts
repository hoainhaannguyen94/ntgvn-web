import { BaseComponent } from '../base.component';
import { Component } from '@angular/core';

@Component({
    selector: 'base-form',
    standalone: true,
    template: ''
})
export abstract class BaseFormComponent extends BaseComponent {
    readonly DEBOUNCE_TIME = 500;
}
