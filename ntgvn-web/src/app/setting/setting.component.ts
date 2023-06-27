import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponent } from '@utils/base/base.component';
import { TimezoneComponent } from './components/timezone/timezone.component';
import { LanguageComponent } from './components/language/language.component';
import { UserComponent } from './components/user/user.component';
import { LicenseComponent } from './components/license/license.component';

@Component({
    selector: 'setting',
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionModule,
        MatIconModule,
        TimezoneComponent,
        LanguageComponent,
        UserComponent,
        LicenseComponent
    ],
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent extends BaseComponent { }
