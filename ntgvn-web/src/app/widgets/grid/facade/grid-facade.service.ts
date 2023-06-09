import { Injectable, inject } from '@angular/core';
import { GridStateService } from '../core/grid-state.service';

@Injectable({
    providedIn: 'root'
})
export class GridFacadeService {
    gridState = inject(GridStateService);

    isLoading$() {
        return this.gridState.isLoading$();
    }

    showLoading() {
        this.gridState.setLoading(true);
    }

    hideLoading() {
        this.gridState.setLoading(false);
    }
}
