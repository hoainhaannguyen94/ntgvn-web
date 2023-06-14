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
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormSingleDetailsComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_ROOM, IUser, EUserRole, IRoom } from '@utils/schema';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { RoomFacadeService } from '../../facade/room-facade.service';

@Component({
    selector: 'room-details',
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
    templateUrl: './room-details.component.html',
    styleUrls: ['./room-details.component.scss']
})
export class RoomDetailsComponent extends BaseFormSingleDetailsComponent<IRoom> implements OnInit {
    roomFacade = inject(RoomFacadeService);
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);
    ngZone = inject(NgZone);

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    roomId = '';
    room = BLANK_ROOM;

    override formGroup = this.formBuilder.group({
        _id: [BLANK_ROOM._id],
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
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.roomId = value['id']
                this.roomFacade.loadRoom(this.roomId);
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.formValid = this.formGroup.valid;
            this.updateFormHasChanged(values);
        });
        this.roomFacade.getManagerList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.managerList = value;
            },
            error: err => {
                throw err;
            }
        });
        this.roomFacade.loadManagerList({ $filter: `role eq '${EUserRole.manager}' or role eq '${EUserRole.owner}'` });
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
        this.roomFacade.getRoom$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.room = value;
                this.originalData = cloneDeep(value);
                this.formGroup.patchValue(this.room);
            },
            error: err => {
                throw err;
            }
        });
    }

    cancelHandler() {
        this.router.navigate(['/room/list']);
    }

    updateHandler() {
        const room = this.formGroup.value as any;
        delete room._id;
        this.roomFacade.updateRoom$(this.roomId, room).subscribe({
            next: () => {
                this.matSnackbar.open(`Room ${room.name} have been updated.`, 'UPDATE', {
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
