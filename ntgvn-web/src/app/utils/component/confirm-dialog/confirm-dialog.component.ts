import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IConfirmDialogData } from './schemas/confirm-dialog.config';

@Component({
    selector: 'confirm-dialog',
    standalone: true,
    imports: [
        CommonModule,
        A11yModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
    dialogData = inject(MAT_DIALOG_DATA) as IConfirmDialogData;

    trackByFn(index: number) {
        return index;
    }
}
