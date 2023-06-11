import { Injectable } from '@angular/core';
import { ITag } from '@common/schemas';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TagStateService {
    loading$ = new Subject<boolean>();
    tagList$ = new Subject<ITag[]>();
    counttags$ = new Subject<number>();
    tag$ = new Subject<ITag>();

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

    getTag$() {
        return this.tag$.asObservable();
    }

    setTag(tag: ITag) {
        this.tag$.next(tag);
    }
}
