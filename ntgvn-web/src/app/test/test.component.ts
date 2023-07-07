import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestJSON } from '@assets/json';
import { TooltipDirective } from '@utils/component/tooltip';
import { LogService } from '@utils/service';

@Component({
    selector: 'test',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TooltipDirective
    ],
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
    log = inject(LogService);

    ngOnInit() {
        this.log.info('TestComponent', TestJSON.data);
    }
}
