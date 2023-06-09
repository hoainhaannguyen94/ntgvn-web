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
import { Router } from '@angular/router';
import { BaseFormSingleComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_TAG } from '@utils/schema';
import { debounceTime, take, takeUntil } from 'rxjs';
import { TagFacadeService } from '../../facade/tag-facade.service';
import { LogService } from '@utils/service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
    selector: 'new-tag',
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
    templateUrl: './new-tag.component.html',
    styleUrls: ['./new-tag.component.scss']
})
export class NewTagComponent extends BaseFormSingleComponent implements OnInit {
    logService = inject(LogService);
    tagFacade = inject(TagFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);
    ngZone = inject(NgZone);

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    override formGroup = this.formBuilder.group({
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
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe({
            next: value => {
                this.logService.info('NewTagComponent', 'valueChanges', value);
            }
        });
    }

    override registerCoreLayer() {
        this.tagFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('NewTagComponent', err);
            }
        });
    }

    cancelHandler() {
        this.back();
    }

    submitHandler() {
        const tag = this.formGroup.value as any;
        this.tagFacade.submitTag$(tag).subscribe({
            next: () => {
                this.matSnackbar.open(`Tag ${tag.name} have been created.`, 'CREATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/tag/list']);
            },
            error: err => {
                this.logService.error('NewTagComponent', err);
            }
        });
    }
}
