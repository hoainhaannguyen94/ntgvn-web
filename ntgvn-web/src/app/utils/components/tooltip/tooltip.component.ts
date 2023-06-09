import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TooltipPosition, TooltipTheme } from './tooltip.enum';

@Component({
    selector: 'tooltip',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
    position = TooltipPosition.DEFAULT;
    theme = TooltipTheme.DEFAULT;
    tooltip = '';
    left = 0;
    top = 0;
    visible = false;
}
