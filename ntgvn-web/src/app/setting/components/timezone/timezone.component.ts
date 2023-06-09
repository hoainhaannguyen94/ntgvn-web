import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@utils/base/base.component';

@Component({
    selector: 'timezone',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './timezone.component.html',
    styleUrls: ['./timezone.component.scss']
})
export class TimezoneComponent extends BaseComponent { }
