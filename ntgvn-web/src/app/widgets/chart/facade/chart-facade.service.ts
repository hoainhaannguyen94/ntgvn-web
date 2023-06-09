import { Injectable, inject } from '@angular/core';
import { ChartStateService } from '../core/chart-state.service';

@Injectable({
    providedIn: 'root'
})
export class ChartFacadeService {
    chartState = inject(ChartStateService);

    isLoading$() {
        return this.chartState.isLoading$();
    }
}
