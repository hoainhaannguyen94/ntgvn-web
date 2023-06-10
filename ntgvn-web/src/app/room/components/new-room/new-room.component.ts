import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild, NgZone } from '@angular/core';
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
import { BLANK_ROOM, IUser, EUserRole } from '@common/schemas';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, takeUntil, debounceTime } from 'rxjs';
import { RoomFacadeService } from '../../facade/room-facade.service';

@Component({
    selector: 'new-room',
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
    templateUrl: './new-room.component.html',
    styleUrls: ['./new-room.component.scss']
})
export class NewRoomComponent extends BaseFormSingleComponent implements OnInit {
    roomFacade = inject(RoomFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);
    ngZone = inject(NgZone);

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    override formGroup = this.formBuilder.group({
        name: [BLANK_ROOM.name, [Validators.required]],
        description: [BLANK_ROOM.description],
        address: [BLANK_ROOM.address, [Validators.required]],
        lat: [BLANK_ROOM.lat, [Validators.required]],
        lng: [BLANK_ROOM.lng, [Validators.required]],
        _managerId: [BLANK_ROOM._managerId, [Validators.required]]
    });

    managerList: IUser[] = [];

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this.ngZone.onStable.pipe(take(1)).subscribe({
            next: () => this.autosize.resizeToFitContent(true)
        });
    }

    ngOnInit() {
        this.registerCoreLayer();
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.formHasChanged = this.formGroup.dirty;
            this.formValid = this.formGroup.valid;
        });
    }

    override registerCoreLayer() {
        this.roomFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.roomFacade.getManagerList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.managerList = value;
            },
            error: err => {
                throw err;
            }
        });
        this.roomFacade.loadManagerList({ $filter: `role eq '${EUserRole.owner}'` });
    }

    cancelHandler() {
        this.router.navigate(['/room/list']);
    }

    submitHandler() {
        const room = this.formGroup.value as any;
        this.roomFacade.submitRoom$(room).pipe(take(1)).subscribe({
            next: () => {
                this.matSnackbar.open(`Room ${room.name} have been created.`, 'CREATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/room/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}