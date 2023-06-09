import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormSingleDetailsComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_GROUP, IGroup } from '@utils/schema';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { GroupFacadeService } from '../../facade/group-facade.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { LogService } from '@utils/service';

@Component({
    selector: 'group-details',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ErrorMessageComponent
    ],
    templateUrl: './group-details.component.html',
    styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent extends BaseFormSingleDetailsComponent<IGroup> implements OnInit {
    logService = inject(LogService);
    activatedRoute = inject(ActivatedRoute);
    groupFacade = inject(GroupFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);
    ngZone = inject(NgZone);

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    groupId = '';
    group = BLANK_GROUP;

    override formGroup = this.formBuilder.group({
        name: [BLANK_GROUP.name, [Validators.required]],
        description: [BLANK_GROUP.description]
    });

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this.ngZone.onStable.pipe(take(1)).subscribe({
            next: () => this.autosize.resizeToFitContent(true)
        });
    }

    ngOnInit() {
        this.registerCoreLayer();
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.groupId = value['id']
                this.groupFacade.getGroup$(this.groupId).subscribe({
                    next: res => {
                        const group = res.value;
                        this.group = group;
                        this.originalData = cloneDeep(group);
                        this.formGroup.patchValue(group);
                    }
                });
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe({
            next: value => {
                this.formValid = this.formGroup.valid;
                this.updateFormHasChanged(value);
            }
        });
    }

    override registerCoreLayer() {
        this.groupFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('GroupDetailsComponent', err);
            }
        });
    }

    cancelHandler() {
        this.back();
    }

    updateHandler() {
        const group = this.formGroup.value as any;
        this.groupFacade.updateGroup$(this.groupId, group).subscribe({
            next: () => {
                this.matSnackbar.open(`Group ${group.name} have been updated.`, 'UPDATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/group/list']);
            },
            error: err => {
                this.logService.error('GroupDetailsComponent', err);
            }
        });
    }
}
