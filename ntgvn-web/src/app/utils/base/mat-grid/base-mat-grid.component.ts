import { MatTableDataSource } from '@angular/material/table';
import { IMatGridHeaders, IMatGridAction } from '@utils/schema';
import { BaseComponent } from '@utils/base/base.component';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    template: '',
    standalone: true
})
export abstract class BaseMatGridComponent<T> extends BaseComponent {
    dataSource = new MatTableDataSource<T>();
    headers: IMatGridHeaders = {}
    columns: string[] = [];
    actions: IMatGridAction[] = [];
    paginator: MatPaginator;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 20, 50, 100];
    paginatorBreakPointSize = 599;
    paginatorHidePageSize = false;
    paginatorShowFirstLastButtons = true;
    items: T[] = [];
    totalItems = 0;
    filterString = '';
    searchControl = new FormControl('');
    isSearching = false;

    abstract reloadGrid(): void

    gotoPage(page: number) {
        this.paginator.pageIndex = page;
    }

    override registerResizeObserver() {
        this.resizeObserver.observe(document.querySelector('body'), (width, _) => {
            if (width > this.paginatorBreakPointSize) {
                this.paginatorHidePageSize = false;
            } else {
                this.paginatorHidePageSize = true;
            }
            this.cdr.detectChanges();
        });
    }
}
