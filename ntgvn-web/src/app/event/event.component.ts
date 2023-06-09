import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'event',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss']
})
export class EventComponent { }
