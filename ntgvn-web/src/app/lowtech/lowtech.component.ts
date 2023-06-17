import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'lowtech',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ],
    templateUrl: './lowtech.component.html',
    styleUrls: ['./lowtech.component.scss']
})
export class LowtechComponent { }
