import { Component, Input, Output, inject, HostListener, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenWeartherService } from '@utils/service';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogService } from '@utils/service';
import L, { Map } from 'leaflet';
import { map } from 'rxjs';

@Component({
    selector: 'search-location',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule
    ],
    templateUrl: './search-location.component.html',
    styleUrls: ['./search-location.component.scss']
})
export class SearchLocationComponent {
    log = inject(LogService);
    geocoding = inject(OpenWeartherService);

    @Input() mapId: string;
    @Input() map: Map;

    @Output() searchCompleted = new EventEmitter();

    searchControl = new FormControl('');

    searchedMarker: L.Marker;

    searchLocation() {
        this.geocoding.directGeocoding$({ location: this.searchControl.value }).pipe(map(res => res.value)).subscribe({
            next: res => {
                this.log.log('MapSearchLocationComponent', res);
                this.searchCompleted.emit(res);
            }
        });
    }

    @HostListener('window:keydown.enter', ['$event']) handleEnterKeyDown() {
        this.searchLocation();
    }
}
