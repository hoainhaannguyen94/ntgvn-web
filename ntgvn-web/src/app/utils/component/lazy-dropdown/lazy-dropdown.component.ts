import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs';
import { ClickOutsideDirective } from '@utils/directive';

@Component({
    selector: 'lazy-dropdown',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        OverlayModule,
        ScrollingModule,
        MatProgressBarModule,
        ClickOutsideDirective
    ],
    templateUrl: './lazy-dropdown.component.html',
    styleUrls: ['./lazy-dropdown.component.scss']
})
export class LazyDropdownComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('virtualScroll') virtualScroll: CdkVirtualScrollViewport;
    @ViewChild('origin') overlayOrigin: CdkOverlayOrigin;

    @Input() pageSize = 20;
    @Input() primaryColumn = 'name';

    @Output() valueChanges = new EventEmitter<any>();

    readonly DROPDOWN_OVERLAY_PANEL_CLASS = 'lazy-dropdown_overlay-panel';

    detroy$ = new Subject<void>();
    fetchedRanges = new Set<number>();

    overlayPanelWidth = 0;
    isOpenDropdown = false;
    isLoadingMore = false;
    isSearching = false;
    selectedDropdownItem: any;
    filterString = '';
    odataCount = 0;

    overlayOriginControl = new FormControl('');
    overlaySearchControl = new FormControl('');

    allItems = [];

    changeDetectorRef = inject(ChangeDetectorRef);

    syncOverlayPanelWidth() {
        if (this.overlayOrigin) {
            const overlayOriginWidth: number = this.overlayOrigin.elementRef.nativeElement.clientWidth;
            this.overlayPanelWidth = overlayOriginWidth;
            this.changeDetectorRef.detectChanges();
        }
    }

    ngOnInit() {
        this.overlaySearchControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.detroy$)).subscribe({
            next: value => {
                typeof value === 'string' && this.searchItems(value);
            }
        });
        this.initAllItems();
    }

    ngAfterViewInit() {
        this.syncOverlayPanelWidth();
    }

    searchItems(value: string) {
        const searchText: string = value.trim().toLowerCase();
        this.allItems = [];
        this.fetchedRanges.clear();
        this.virtualScroll.scrollTo({ top: 0 });
        if (searchText.length > 0) {
            this.isSearching = true;
            this.filterString = `substringof(${this.primaryColumn},${value.trim()})`;
            this.odataCount = 0;
            this.initAllItems({ filter: this.filterString });
        } else {
            this.isSearching = false;
            this.filterString = '';
            this.odataCount = 0;
            this.initAllItems();
        }
    }

    initAllItems(options?: any) {
        this.loadMore(0, this.pageSize, options).pipe(take(1)).subscribe({
            next: res => {
                this.allItems = res.value;
                this.odataCount = res['@odata.count'];
            }
        });
    }

    scrollEnd() {
        const renderedRange = this.virtualScroll.getRenderedRange();
        const end = renderedRange.end;
        const total = this.allItems.length;
        let nextRange = 0;
        if (end > 0) {
            nextRange = end + 1;
        }
        if (this.odataCount && nextRange === this.odataCount) {
            return;
        } else {
            if (end === total && !this.fetchedRanges.has(nextRange)) {
                this.isLoadingMore = true;
                const options = {
                    skip: total,
                    top: this.pageSize,
                    count: true,
                    filter: this.filterString
                }
                this.loadMore(nextRange, this.pageSize, options).pipe(take(1)).subscribe({
                    next: res => {
                        this.allItems = this.allItems.concat(res.value);
                        this.fetchedRanges.add(nextRange);
                        this.isLoadingMore = false;
                    },
                    error: () => {
                        this.isLoadingMore = false;
                    }
                });
            }
        }
    }

    loadMore(skip: number, next: number, options: any): Observable<any> {
        let dataSource: any[] = [];
        for (let i = 0; i < 1000; i++) {
            dataSource = dataSource.concat({
                display: `Item ${i}`,
                value: {
                    display: `Item ${i}`,
                    index: i
                }
            });
        }
        return new Observable(observer => {
            let results: any[] = dataSource.slice(0);
            if (options && options.filter) {
                results = results.filter(item => item.display.includes(this.overlaySearchControl.value));
            }
            results = results.slice(skip, skip + next);
            observer.next({
                value: results,
                '@odata.count': dataSource.length
            });
            observer.complete();
        });
    }

    selectDropdownItem(item: any) {
        if (item) {
            this.selectedDropdownItem = item;
            this.overlayOriginControl.setValue(item.display);
            this.valueChanges.emit(item);
            this.isOpenDropdown = false;
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.syncOverlayPanelWidth();
    }

    ngOnDestroy() {
        this.detroy$.next();
        this.detroy$.complete();
    }
}
