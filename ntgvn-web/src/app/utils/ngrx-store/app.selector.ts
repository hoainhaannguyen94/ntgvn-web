import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppStore } from './schema/store.schema';

export const APP_SELECTOR = () => {
    const appStore: Store<IAppStore> = inject(Store<IAppStore>);

    const user = appStore.select(state => state.user);

    return { user }
}
