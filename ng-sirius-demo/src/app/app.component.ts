import { Component, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { ISirSkuData, ISirSkuProperty } from 'projects/ng-sirius';

@Component({
    selector: 'sir-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges {

    visible = false;

    sku: ISirSkuData = {
        specificationCategories: [{
            key: 'color',
            values: [{
                id: '1001',
                name: 'red',
                imgUrl: 'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg',
                previewImgUrl: 'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg'
            }, {
                id: '1002',
                name: 'blue',
                imgUrl: 'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg',
                previewImgUrl: 'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg'
            }],
            specKey: 'specId_1'
        }, {
            key: 'size',
            values: [{
                id: '2001',
                name: 'super-large'
            }, {
                id: '2002',
                name: 'large'
            }, {
                id: '2003',
                name: 'mid'
            }],
            specKey: 'specId_2'
        }],
        combinations: [{
            id: 10,
            price: 1000,
            specId_1: '2001',
            specId_2: '2002',
            specId_3: '2003',
            stockCount: 100
        }, {
            id: 11,
            price: 1001,
            specId_1: '2001',
            specId_2: '2002',
            specId_3: '2003',
            stockCount: 99
        }],

        price: '100',

        stockCount: 2000,

        collectionId: 2001,

        noneSku: false,

        messages: [],

        hide_stock: false
    };

    properties: ISirSkuProperty[] = [{
        id: 123,
        name: '加料',
        isMultiple: true,
        contents: [{
            id: '1111',
            name: '珍珠',
            price: 1
        }, {
            id: '1111',
            name: '爆浆芝士',
            price: 2
        }]
    }];

    constructor(private cdr: ChangeDetectorRef) {

    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('shit', changes);
        if (changes.visible) {
            console.log(changes);
        }
    }

    onClick() {
        console.log('count');
        this.visible = !this.visible;
    }
}
