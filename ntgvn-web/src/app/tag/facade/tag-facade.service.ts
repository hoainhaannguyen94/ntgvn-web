import { Injectable, inject } from '@angular/core';
import { TagApiService } from '../core/tag-api.service';
import { TagStateService } from '../core/tag-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { ITag } from '@utils/schema';
import { LogService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class TagFacadeService {
    logService = inject(LogService);
    tagAPI = inject(TagApiService);
    tagState = inject(TagStateService);

    isLoading$() {
        return this.tagState.isLoading$();
    }

    getCountTags$() {
        return this.tagState.getCountTags$();
    }

    loadCountTags(params?: OdataParams) {
        this.tagState.setLoading(true);
        this.tagAPI.countTags$(params).pipe(
            finalize(() => {
                this.tagState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.tagState.setCountTags(res.value.count);
            },
            error: err => {
                this.logService.error('TagFacadeService', err);
            }
        });
    }

    loadTagList(params?: OdataParams) {
        this.tagState.setLoading(true);
        this.tagAPI.getTagList$(params).pipe(
            finalize(() => {
                this.tagState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.tagState.setTagList(res.value);
            },
            error: err => {
                this.logService.error('TagFacadeService', err);
            }
        });
    }

    getTagList$() {
        return this.tagState.getTagList$();
    }

    getTag$(tagId: string, params?: OdataParams) {
        return this.tagAPI.getTag$(tagId, params);
    }

    submitTag$(tag: Omit<ITag, '_id'>) {
        return new Observable((observer) => {
            this.tagState.setLoading(true);
            this.tagAPI.submitTag$(tag).pipe(
                finalize(() => {
                    this.tagState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    updateTag$(tagId: string, tag: Omit<ITag, '_id'>) {
        return new Observable((observer) => {
            this.tagState.setLoading(true);
            this.tagAPI.updateTag$(tagId, tag).pipe(
                finalize(() => {
                    this.tagState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    deleteTag$(tagId: string) {
        return new Observable((observer) => {
            this.tagState.setLoading(true);
            this.tagAPI.deleteTag$(tagId).pipe(
                finalize(() => {
                    this.tagState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }
}
