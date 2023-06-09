import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PackageJSON } from '@assets/json';

@Component({
    selector: 'about-us',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
    PackageJSON = PackageJSON;
}
