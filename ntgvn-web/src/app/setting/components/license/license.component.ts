import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@utils/base/base.component';
import { MatIconModule } from '@angular/material/icon';
import { UserRoleDetailsPipe, ObjectPropertyPipe } from '@utils/pipe';

@Component({
    selector: 'license',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        UserRoleDetailsPipe,
        ObjectPropertyPipe
    ],
    templateUrl: './license.component.html',
    styleUrls: ['./license.component.scss']
})
export class LicenseComponent extends BaseComponent { }
