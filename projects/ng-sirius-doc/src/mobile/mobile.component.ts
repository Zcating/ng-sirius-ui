import { Component, OnInit } from '@angular/core';
import { ISirSkuData } from 'ng-sirius';
import { ISirSkuReturnData } from 'ng-sirius/sku';
import { environment } from '../environments/environment';
@Component({
    selector: 'sir-mobile',
    templateUrl: './mobile.component.html',
    styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {

    visible = false;
    prefixRoute = environment.prefixRoute;
    sku: ISirSkuData = {
        specCategories: [{
            name: 'color',
            specs: [{
                id: '1001',
                name: 'red',
                imgUrl: `${this.prefixRoute}/assets/sku-test1.jpg`,
                previewImgUrl: `${this.prefixRoute}/assets/sku-test1.jpg`
            }, {
                id: '1002',
                name: 'blue',
                imgUrl: `${this.prefixRoute}/assets/sku-test2.jpg`,
                previewImgUrl: `${this.prefixRoute}/assets/sku-test2.jpg`
            }],
        }, {
            name: 'size',
            specs: [{
                id: '2001',
                name: 'super-large'
            }, {
                id: '2002',
                name: 'large'
            }, {
                id: '2003',
                name: 'mid'
            }],
        }, {
            name: 'ice',
            specs: [{
                id: '3001',
                name: 'more',
            }, {
                id: '3002',
                name: 'default',
            }, {
                id: '3003',
                name: 'less',
            }]
        }],
        combinations: [{
            id: '1',
            price: '1001',
            stockCount: 10,
            specIds: ['1001', '2001', '3001'],
        }, {
            id: '2',
            price: '1002',
            stockCount: 20,
            specIds: ['1001', '2001', '3002'],
        }, {
            id: '3',
            price: '1003',
            stockCount: 30,
            specIds: ['1001', '2001', '3003'],
        }, {
            id: '4',
            price: '1004',
            stockCount: 40,
            specIds: ['1002', '2001', '3001']
        }, {
            id: '5',
            price: '1005',
            stockCount: 50,
            specIds: ['1002', '2002', '3003']
        }, {
            id: '6',
            price: '1006',
            stockCount: 60,
            specIds: ['1002', '2003', '3003']
        }],

        price: '100',

        stockCount: 210,

        collectionId: 2001,

        noneSku: false,

        hiddenStock: false,

        picture: `${this.prefixRoute}/assets/sku-test1.jpg`
    };

    data: string = '';

    constructor() { }

    ngOnInit(): void {
    }


    onMainAction(data: ISirSkuReturnData) {
        this.data = JSON.stringify(data);
        this.visible = false;
    }
}
