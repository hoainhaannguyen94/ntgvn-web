import { Injectable } from '@angular/core';
import { ITag } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TagStateService {
    loading$ = new Subject<boolean>();
    tagList$ = new Subject<ITag[]>();
    counttags$ = new Subject<number>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountTags(count = 0) {
        return this.counttags$.next(count);
    }

    getCountTags$() {
        return this.counttags$.asObservable();
    }

    getTagList$() {
        return this.tagList$.asObservable();
    }

    setTagList(tags: ITag[]) {
        this.tagList$.next(tags);
    }
}
