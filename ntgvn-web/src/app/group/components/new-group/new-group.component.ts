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
import { BLANK_GROUP } from '@utils/schema';
import { debounceTime, take, takeUntil } from 'rxjs';
import { GroupFacadeService } from '../../facade/group-facade.service';
import { LogService } from '@utils/service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
    selector: 'new-group',
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
    templateUrl: './new-group.component.html',
    styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent extends BaseFormSingleComponent implements OnInit {
    log = inject(LogService);
    groupFacade = inject(GroupFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    ngZone = inject(NgZone);

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

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
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.log.info('NewGroupComponent', 'valueChanges', values);
        });
    }

    override registerCoreLayer() {
        this.groupFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
    }

    cancelHandler() {
        this.back();
    }

    submitHandler() {
        const group = this.formGroup.value as any;
        this.groupFacade.submitGroup$(group).subscribe({
            next: () => {
                this.matSnackbar.open(`Group ${group.name} have been created.`, 'CREATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/group/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}
