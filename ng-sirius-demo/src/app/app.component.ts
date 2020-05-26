import { Component, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { ISirSkuData } from 'projects/ng-sirius';

@Component({
    selector: 'sir-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges {

    visible = false;

    sku: ISirSkuData = {
        specCategories: [{
            name: 'color',
            specs: [{
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
        },{
            id: '2',
            price: '1002',
            stockCount: 20,
            specIds: ['1001', '2001', '3002'],
        },{
            id: '3',
            price: '1003',
            stockCount: 30,
            specIds: ['1001', '2001', '3003'],
        }, {
            id: '4',
            price: '1004',
            stockCount: 40,
            specIds: ['1002', '2001', '3002']
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

        hiddenStock: false
    };

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
