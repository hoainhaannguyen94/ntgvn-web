import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@utils/base/base.component';
import { MatIconModule } from '@angular/material/icon';
import { UserRoleDetailsPipe } from '@common/pipes';
import { ObjectPropertyPipe } from '@utils/pipes';

@Component({
    selector: 'user',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        UserRoleDetailsPipe,
        ObjectPropertyPipe
    ],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseComponent { }
