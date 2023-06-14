import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SafePipe } from '@utils/pipe';

@Component({
    selector: 'windy',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        SafePipe
    ],
    templateUrl: './windy.component.html',
    styleUrls: ['./windy.component.scss']
})
export class WindyComponent implements OnInit {
    dialogData = inject(MAT_DIALOG_DATA);

    width = 900;
    height = 600;
    lat = 10.7552928;
    lon = 106.3655797;
    zoom = 8;

    src;

    ready = false;

    ngOnInit() {
        this.lat = this.dialogData.lat;
        this.lon = this.dialogData.lon;
        this.src = `https://embed.windy.com/embed2.html?lat=${this.lat}&lon=${this.lon}&detailLat=${this.lat}&detailLon=${this.lon}&width=${this.width}&height=${this.height}&zoom=${this.zoom}&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=true&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
        this.ready = true;
    }
}
