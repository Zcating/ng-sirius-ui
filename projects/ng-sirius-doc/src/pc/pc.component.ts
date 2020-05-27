import { Component } from '@angular/core';

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
}
