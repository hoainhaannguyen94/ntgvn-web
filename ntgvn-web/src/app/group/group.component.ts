import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'group',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ],
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent { }
