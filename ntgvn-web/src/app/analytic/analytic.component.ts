import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'analytics',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        HighchartsChartModule
    ],
    templateUrl: './analytic.component.html',
    styleUrls: ['./analytic.component.scss']
})
export class AnalyticComponent {
    highcharts = Highcharts;
    chartOptions: any = {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'SUMMARY 2023',
            align: 'left'
        },
        subtitle: {
            text: `
                <a style="color: #4CAF50;" href="https://www.facebook.com/namtiengiangvnoffical" target="_blank">NTGVN Team</a>
            `,
            align: 'left'
        },
        xAxis: {
            categories: ['January', 'February ', 'March', 'April', 'May', 'June', 'July', 'August ', 'September', 'October ', 'November', 'December'],
            title: {
                text: null
            },
            gridLineWidth: 1,
            lineWidth: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Quantity (kg)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            },
            gridLineWidth: 0
        },
        tooltip: {
            valueSuffix: ' kg'
        },
        plotOptions: {
            bar: {
                borderRadius: '0',
                dataLabels: {
                    enabled: true
                },
                groupPadding: 0.1
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [
            {
                name: 'Type 1',
                data: [631, 727, 3202, 721, 26, 631, 727, 3202, 721, 26, 631, 727]
            }, {
                name: 'Type 2',
                data: [814, 841, 3714, 726, 31, 814, 841, 3714, 726, 31, 814, 841]
            }, {
                name: 'Type 3',
                data: [1044, 944, 4170, 735, 40, 1044, 944, 4170, 735, 40, 1044, 944]
            }, {
                name: 'Type 4',
                data: [1276, 1007, 4561, 746, 42, 1276, 1007, 4561, 746, 42, 1276, 1007]
            }
        ]
    }
}
