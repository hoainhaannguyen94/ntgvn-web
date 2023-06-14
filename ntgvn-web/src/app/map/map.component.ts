import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, inject, OnDestroy } from '@angular/core';
import { BaseComponent } from '@utils/base/base.component';
import L, { Map as LeafletMap } from 'leaflet';
import { Subject, takeUntil, timer } from 'rxjs';
import { CommonService } from '@utils/service';
import { SearchLocationComponent } from './widgets/search-location/search-location.component';
import { WindyComponent } from './widgets/windy/windy.component';
import { DEFAULT_MAKER_ICON, SMARTPHONE_MAKER_ICON } from './utils/marker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeviceService } from '@utils/service';
import { IDevice } from '@utils/schema';
import { Router } from '@angular/router';

@Component({
    selector: 'map',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        SearchLocationComponent,
        WindyComponent
    ],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent extends BaseComponent implements AfterViewInit, OnDestroy {
    dialog = inject(MatDialog);
    router = inject(Router);
    commonService = inject(CommonService);
    deviceService = inject(DeviceService);

    @ViewChild('mapElement') mapElement;

    mapId = this.commonService.generateUUID();
    map: LeafletMap;
    mapReady = new Subject();

    clickedMarker: L.Marker;
    clickedPopupId = this.commonService.generateUUID().replace(/-/g, '');

    deviceList: IDevice[] = [];
    deviceMarkers = new Map();

    renderDeviceList() {
        this.deviceService.getDeviceList$({ $orderby: '_id desc' }).subscribe({
            next: res => {
                this.deviceList = res.value;
                if (this.deviceList.length > 0 && this.map) {
                    this.deviceList.forEach(device => {
                        const latLng = L.latLng(device.lat, device.lng);
                        const marker = L.marker(latLng, { icon: SMARTPHONE_MAKER_ICON }).addTo(this.map);
                        const popupContent = `
                            <div>${device.name}
                                <button id="${device._id}">Details</button>
                            </div>
                        `;
                        this.createMarkerPopup(marker, device._id, popupContent, () => { this.router.navigate([`/device/${device._id}/details`]); }, true);
                        this.deviceMarkers.set(device._id, marker);
                    });
                }
            }
        });
    }

    ngAfterViewInit() {
        this.initLeaflet();
    }

    initLeaflet() {
        timer(0, 1000).pipe(takeUntil(this.mapReady)).subscribe({
            next: () => {
                if (this.mapElement) {
                    this.mapReady.next(true);
                    {
                        this.map = L.map(this.mapId, {
                            center: [10.7552928, 106.3655797],
                            zoom: 6,
                            maxZoom: 19,
                            layers: [
                                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                    maxZoom: 19,
                                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                })
                            ]
                        });
                        this.map.on('click', event => {
                            if (this.clickedMarker) {
                                this.clickedMarker.remove();
                            }
                            this.clickedMarker = L.marker(event.latlng, { icon: DEFAULT_MAKER_ICON }).addTo(this.map);
                            const popupContent = `
                                <div>${event.latlng.toString()}
                                    <button id="${this.clickedPopupId}">Show Windy</button>
                                </div>
                            `;
                            this.createMarkerPopup(this.clickedMarker, this.clickedPopupId, popupContent, this.openWindyDialog.bind(this), true);
                        });
                        this.renderDeviceList();
                    }
                }
            }
        });
    }

    onSearchCompleted(event) {
        if (this.clickedMarker) {
            this.clickedMarker.remove();
        }
        const latLng = L.latLng(event.lat, event.lon);
        const popupContent = `
            <div>${event.name}
                <button id="${this.clickedPopupId}">Show Windy</button>
            </div>
        `;
        this.clickedMarker = L.marker(latLng, { icon: DEFAULT_MAKER_ICON }).addTo(this.map);
        this.createMarkerPopup(this.clickedMarker, this.clickedPopupId, popupContent, this.openWindyDialog.bind(this), true);
        this.map.setView(latLng, 13, { animate: true });
    }

    createMarkerPopup(marker: L.Marker, popupId: string, popupContent: string, callbackFn = null, opened = false) {
        const content = L.DomUtil.create('div') as any;
        content.innerHTML = popupContent;
        content.querySelector(`[id="${popupId}"]`).addEventListener('click', () => {
            if (callbackFn) {
                callbackFn(marker.getLatLng());
            }
        });
        marker.bindPopup(content);
        if (opened) {
            marker.openPopup();
        }
    }

    openWindyDialog(latlng: L.LatLng) {
        this.dialog.open(WindyComponent, {
            autoFocus: false,
            disableClose: false,
            hasBackdrop: true,
            data: {
                lat: latlng.lat,
                lon: latlng.lng
            }
        })
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        if (this.map) {
            this.map.remove();
        }
        this.deviceMarkers.clear();
    }
}
