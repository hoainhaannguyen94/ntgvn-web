import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, takeUntil, tap, timer } from 'rxjs';
import { BaseMatGridComponent } from '@utils/base/mat-grid';
import { ITag } from '@utils/schema';
import { TagFacadeService } from '../../facade/tag-facade.service';
import { OdataParams } from '@utils/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@utils/component/confirm-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { io } from 'socket.io-client';
import { LogService } from '@utils/service';

@Component({
    selector: 'tag-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatMenuModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
        ConfirmDialogComponent
    ],
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent extends BaseMatGridComponent<ITag> implements OnInit, AfterViewInit {
    @ViewChild(MatSort) matSort: MatSort;
    @ViewChild(MatPaginator) override paginator: MatPaginator;

    logService = inject(LogService);
    tagFacade = inject(TagFacadeService);
    router = inject(Router);
    dialog = inject(MatDialog);
    matSnackbar = inject(MatSnackBar);

    ngOnInit() {
        this.registerCoreLayer();
        this.registerSignal();
        this.initColumns();
        this.initDisplayColumns();
        this.initActions();
        this.registerResizeObserver();
        this.registerSearchControlValueChanges();
    }

    ngAfterViewInit() {
        const matSortTimer$ = timer(0, 300).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                if (this.matSort) {
                    this.dataSource.sort = this.matSort;
                    matSortTimer$.unsubscribe();
                }
            }
        });
        const paginatorTimer$ = timer(0, 300).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                if (this.paginator) {
                    this.paginator.page.pipe(
                        tap(event => {
                            const options: OdataParams = {
                                $skip: event.pageIndex * event.pageSize,
                                $top: event.pageSize,
                                $filter: this.filterString,
                                $orderby: '_id desc'
                            }
                            this.tagFacade.loadTagList(options);
                        }),
                        takeUntil(this.destroy$)
                    ).subscribe();
                    paginatorTimer$.unsubscribe();
                }
            }
        });
    }

    override registerCoreLayer() {
        this.tagFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('TagListComponent', err);
            }
        });

        this.tagFacade.getCountTags$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.totalItems = value;
            },
            error: err => {
                this.logService.error('TagListComponent', err);
            }
        });

        this.tagFacade.getTagList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.items = value;
                this.updateDataSource();
            },
            error: err => {
                this.logService.error('TagListComponent', err);
            }
        });

        this.tagFacade.loadCountTags();

        this.tagFacade.loadTagList({
            $skip: 0,
            $top: this.pageSize,
            $orderby: '_id desc'
        });
    }

    override registerSignal() {
        if (this.appState.enableWebsocket) {
            this.socket = io(this.appState.websocketURL, {
                transports: ['websocket'],
                autoConnect: false
            });
            this.socket.connect();
            this.socket.on('new-announcement', _ => {
                this.reloadGrid();
            });
            this.socket.on('update-announcement', _ => {
                this.reloadGrid();
            });
            this.socket.on('delete-announcement', _ => {
                this.reloadGrid();
            });
        }
    }

    registerSearchControlValueChanges() {
        this.searchControl.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300)).subscribe({
            next: value => {
                let valid = false;
                this.isSearching = false;
                if (typeof value === 'string' && value.length === 0) {
                    this.filterString = '';
                    valid = true;
                }
                if (typeof value === 'string' && value.length > 0) {
                    this.filterString = `contains(name, '${value}')`;
                    valid = true;
                    this.isSearching = true;
                }
                if (valid) {
                    const options: OdataParams = {
                        $skip: 0,
                        $top: this.pageSize,
                        $filter: this.filterString,
                        $orderby: '_id desc'
                    }
                    this.tagFacade.loadCountTags();
                    if (this.paginator.pageIndex > 0) {
                        this.paginator.firstPage();
                    } else {
                        this.tagFacade.loadTagList(options);
                    }
                }
            }
        });
    }

    initColumns() {
        this.headers = {
            'name': 'Name',
            'description': 'Description'
        }
    }

    initDisplayColumns() {
        this.columns = ['name', 'description', 'actions'];
    }

    initActions() {
        this.actions = [
            {
                label: 'Edit',
                icon: 'edit',
                enable: true,
                display: true,
                execute: (item: ITag) => {
                    this.detailsTagHandler(item);
                }
            },
            {
                label: 'Delete',
                icon: 'delete_forever',
                enable: true,
                display: true,
                execute: (item: ITag) => {
                    this.deleteTagHandler(item);
                }
            }
        ];
    }

    updateDataSource() {
        this.dataSource.data = this.items;
    }

    override reloadGrid() {
        this.tagFacade.loadCountTags();
        this.tagFacade.loadTagList({
            $skip: 0,
            $top: this.pageSize,
            $orderby: '_id desc'
        });
    }

    newTagHandler() {
        this.router.navigate(['/tag/new']);
    }

    detailsTagHandler(item: ITag) {
        this.router.navigate([`/tag/${item._id}/details`]);
    }

    deleteTagHandler(item: ITag) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            minWidth: '350px',
            maxWidth: '80vw',
            disableClose: true,
            autoFocus: false,
            data: {
                title: `${item.name}`,
                content: `<span>Are you sure to delete this tag</span>`,
                actions: [
                    {
                        text: 'Cancel',
                        backgroundColor: '',
                        execute: () => {
                            confirmDialogRef.close()
                        }
                    },
                    {
                        text: 'Delete',
                        backgroundColor: 'primary',
                        execute: () => {
                            this.tagFacade.deleteTag$(item._id).subscribe({
                                next: () => {
                                    this.matSnackbar.open(`Tag ${item.name} have been deleted.`, 'DELETE', {
                                        duration: 3000,
                                        verticalPosition: 'bottom',
                                        horizontalPosition: 'center'
                                    });
                                    confirmDialogRef.close(true);
                                },
                                error: err => {
                                    this.logService.error('TagListComponent', err);
                                }
                            });
                        }
                    }
                ]
            }
        });
        confirmDialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.reloadGrid();
            }
        });
    }
}
