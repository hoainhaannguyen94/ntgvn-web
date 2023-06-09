import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'room',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent { }
