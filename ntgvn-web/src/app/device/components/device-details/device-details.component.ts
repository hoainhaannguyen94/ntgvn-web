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
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormSingleDetailsComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/components/error-message';
import { BLANK_DEVICE, IDevice } from '@common/schemas';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { DeviceFacadeService } from '../../facade/device-facade.service';

@Component({
    selector: 'device-details',
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
    templateUrl: './device-details.component.html',
    styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent extends BaseFormSingleDetailsComponent<IDevice> implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    deviceFacade = inject(DeviceFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    deviceId = '';
    device = BLANK_DEVICE;

    override formGroup = this.formBuilder.group({
        _id: [BLANK_DEVICE._id],
        name: [BLANK_DEVICE.name, [Validators.required]],
        type: [BLANK_DEVICE.type, [Validators.required]],
        lat: [BLANK_DEVICE.lat],
        lng: [BLANK_DEVICE.lng],
    });

    ngOnInit() {
        this.registerCoreLayer();
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.deviceId = value['id']
                this.deviceFacade.loadDevice(this.deviceId);
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.formValid = this.formGroup.valid;
            this.updateFormHasChanged(values);
        });
    }

    override registerCoreLayer() {
        this.deviceFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.deviceFacade.getDevice$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.device = value;
                this.originalData = cloneDeep(value);
                this.formGroup.patchValue(this.device);
            },
            error: err => {
                throw err;
            }
        });
    }

    cancelHandler() {
        this.router.navigate(['/device/list']);
    }

    updateHandler() {
        const device = this.formGroup.value as any;
        delete device._id;
        this.deviceFacade.updateDevice$(this.deviceId, device).subscribe({
            next: () => {
                this.matSnackbar.open(`Device ${device.name} have been updated.`, 'UPDATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/device/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}
