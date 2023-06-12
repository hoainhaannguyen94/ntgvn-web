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
import { ErrorMessageComponent } from '@utils/components/error-message';
import { BLANK_TAG, ITag } from '@common/schemas';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { TagFacadeService } from '../../facade/tag-facade.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
    selector: 'tag-details',
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
    templateUrl: './tag-details.component.html',
    styleUrls: ['./tag-details.component.scss']
})
export class TagDetailsComponent extends BaseFormSingleDetailsComponent<ITag> implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    tagFacade = inject(TagFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);
    ngZone = inject(NgZone);

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    tagId = '';
    tag = BLANK_TAG;

    override formGroup = this.formBuilder.group({
        _id: [BLANK_TAG._id],
        name: [BLANK_TAG.name, [Validators.required]],
        description: [BLANK_TAG.description]
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
                this.tagId = value['id']
                this.tagFacade.loadTag(this.tagId);
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.formValid = this.formGroup.valid;
            this.updateFormHasChanged(values);
        });
    }

    override registerCoreLayer() {
        this.tagFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.tagFacade.getTag$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.tag = value;
                this.originalData = cloneDeep(value);
                this.formGroup.patchValue(this.tag);
            },
            error: err => {
                throw err;
            }
        });
    }

    cancelHandler() {
        this.router.navigate(['/tag/list']);
    }

    updateHandler() {
        const tag = this.formGroup.value as any;
        delete tag._id;
        this.tagFacade.updateTag$(this.tagId, tag).subscribe({
            next: () => {
                this.matSnackbar.open(`Tag ${tag.name} have been updated.`, 'UPDATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/tag/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}
