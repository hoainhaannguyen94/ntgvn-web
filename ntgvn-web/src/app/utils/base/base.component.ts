import { Component, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Socket } from 'socket.io-client';
import { IAppState } from '@app-state';
import { StateService } from '../state/state.service';
import { Effect } from '../state/state.schema';
import { ResizeObserverService } from '../services/resize-observer.service';

@Component({
    selector: 'base',
    standalone: true,
    template: ''
})
export abstract class BaseComponent implements OnDestroy {
    state = inject(StateService<IAppState>);
    resizeObserver = inject(ResizeObserverService);
    cdr = inject(ChangeDetectorRef);

    destroy$ = new Subject<void>();
    subscriptions = new Map<string, Subscription>();

    appState: IAppState;
    isLoading = false;

    socket: Socket;

    constructor() {
        this.appState = this.state.currentState;
        this.state.stateChanges$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (changes) => {
                if (changes instanceof Effect) {
                    this.appState = changes.newState;
                } else {
                    this.appState = changes;
                }
            }
        });
    }

    registerCoreLayer() { }

    registerSignal() { }

    registerResizeObserver() {}

    trackByFn(index: number) {
        return index;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
