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
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_DEVICE } from '@utils/schema';
import { debounceTime, takeUntil } from 'rxjs';
import { DeviceFacadeService } from '../../facade/device-facade.service';
import { LogService } from '@utils/service';

@Component({
    selector: 'new-device',
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
    templateUrl: './new-device.component.html',
    styleUrls: ['./new-device.component.scss']
})
export class NewDeviceComponent extends BaseFormSingleComponent implements OnInit {
    logService = inject(LogService);
    deviceFacade = inject(DeviceFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    override formGroup = this.formBuilder.group({
        name: [BLANK_DEVICE.name, [Validators.required]],
        type: [BLANK_DEVICE.type, [Validators.required]],
        lat: [BLANK_DEVICE.lat, []],
        lng: [BLANK_DEVICE.lng, []],
    });

    ngOnInit() {
        this.registerCoreLayer();
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe({
            next: value => {
                this.logService.info('NewDeviceComponent', 'valueChanges', value);
            }
        });
    }

    override registerCoreLayer() {
        this.deviceFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('NewDeviceComponent', err);
            }
        });
    }

    cancelHandler() {
        this.back();
    }

    submitHandler() {
        const device = this.formGroup.value as any;
        this.deviceFacade.submitDevice$(device).subscribe({
            next: () => {
                this.matSnackbar.open(`Device ${device.name} have been created.`, 'CREATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/device/list']);
            },
            error: err => {
                this.logService.error('NewDeviceComponent', err);
            }
        });
    }
}
