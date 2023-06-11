import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import { ErrorMessageComponent } from '@utils/components/error-message';
import { BLANK_TAG } from '@common/schemas';
import { debounceTime, takeUntil } from 'rxjs';
import { TagFacadeService } from '../../facade/tag-facade.service';
import { LogService } from '@utils/services';

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
    log = inject(LogService);
    tagFacade = inject(TagFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    override formGroup = this.formBuilder.group({
        name: [BLANK_TAG.name, [Validators.required]],
        description: [BLANK_TAG.description]
    });

    ngOnInit() {
        this.registerCoreLayer();
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.log.log('NewTagComponent', 'valueChanges', values);
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
    }

    cancelHandler() {
        this.router.navigate(['/tag/list']);
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
                throw err;
            }
        });
    }
}
