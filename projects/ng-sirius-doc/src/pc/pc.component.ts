import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    templateUrl: './pc.component.html',
    styleUrls: ['./pc.component.scss']
})
export class PcComponent {

    items = [{
        name: 'service component',
        subs: [{
            name: 'Goods Specification'
        }]
    }];

    get mobileUrl() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.prefixRoute}/mobile`);
    }

    constructor(private sanitizer: DomSanitizer) {
    }
}
