import { Injectable, inject } from '@angular/core';
import { KPIStateService } from '../core/kpi-state.service';

@Injectable({
    providedIn: 'root'
})
export class KPIFacadeService {
    kpiState = inject(KPIStateService);

    isLoading$() {
        return this.kpiState.isLoading$();
    }

    showLoading() {
        this.kpiState.setLoading(true);
    }

    hideLoading() {
        this.kpiState.setLoading(false);
    }
}
