import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonService } from '@utils/services';
import L, { Map as LeafletMap } from 'leaflet';
import { Subject, takeUntil, timer } from 'rxjs';
import { DeviceService } from '@common/services';
import { IDevice } from '@common/schemas';
import { BaseComponent } from '@utils/base/base.component';
import { SMARTPHONE_MAKER_ICON } from '../map/utils/marker';

@Component({
    selector: 'simulator',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './simulator.component.html',
    styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent extends BaseComponent implements AfterViewInit, OnDestroy {
    commonService = inject(CommonService);
    deviceService = inject(DeviceService);

    @ViewChild('mapElement') mapElement;

    mapId = this.commonService.generateUUID();
    map: LeafletMap;
    mapReady = new Subject();

    device: IDevice;
    deviceMarker: L.Marker;

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
                            center: [10.814064, 106.679203],
                            zoom: 6,
                            maxZoom: 19,
                            layers: [
                                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                    maxZoom: 19,
                                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                })
                            ]
                        });
                        this.startDeviceSimulator();
                    }
                }
            }
        });
    }

    startDeviceSimulator() {
        const DUMMY_ROUTE = [
            L.latLng(10.814092, 106.679244),
            L.latLng(10.814646, 106.680527),
            L.latLng(10.815292, 106.681849),
            L.latLng(10.815982, 106.683055),
            L.latLng(10.816780, 106.684384),
            L.latLng(10.817766, 106.686023),
            L.latLng(10.818852, 106.688619),
            L.latLng(10.820910, 106.695377),
            L.latLng(10.821560, 106.698410),
            L.latLng(10.822354, 106.701185),
            L.latLng(10.822860, 106.703244),
            L.latLng(10.823167, 106.703520),
            L.latLng(10.822174, 106.699696),
            L.latLng(10.820946, 106.695266),
            L.latLng(10.819863, 106.691130),
            L.latLng(10.819050, 106.688428),
            L.latLng(10.817840, 106.685763),
            L.latLng(10.816631, 106.683667),
            L.latLng(10.815493, 106.681737),
            L.latLng(10.814554, 106.679807),
            L.latLng(10.814092, 106.679244)
        ];
        let counter = 0;
        this.deviceService.getDevice$('6461fd78e8cdae09ee75b331').subscribe({
            next: res => {
                this.device = res.value;
                if (this.device) {
                    timer(0, 1000).pipe(takeUntil(this.destroy$)).subscribe({
                        next: () => {
                            if (this.map) {
                                const latLng = L.latLng(10.814092, 106.679244);
                                if (!this.deviceMarker) {
                                    this.deviceMarker = L.marker(latLng, { icon: SMARTPHONE_MAKER_ICON }).addTo(this.map);
                                    this.map.setView(latLng, 16, { animate: true });
                                } else {
                                    this.deviceMarker.setLatLng(DUMMY_ROUTE[counter]);
                                    this.map.setView(DUMMY_ROUTE[counter], 16, { animate: true });
                                    counter++;
                                    if (counter > 20) {
                                        counter = 0;
                                    }
                                    if (this.map && this.map.invalidateSize) {
                                        this.map.invalidateSize();
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        if (this.map) {
            this.map.remove();
        }
    }
}
