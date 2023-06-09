import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@utils/base/base.component';

@Component({
    selector: 'language',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss']
})
export class LanguageComponent extends BaseComponent { }
