import { Component } from '@angular/core';
import { ISirSkuData } from 'ng-sirius';

@Component({
    selector: 'sir-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    visible = false;


    sku: ISirSkuData = {
        specifications: [{
            key: 'color',
            values: [{
                id: '1001',
                name: 'red',
                imgUrl: 'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg',
                previewImgUrl: 'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg'
            }],
            specKey: 'specId_1'
        }, {
            key: 'color',
            values: [{
                id: '1002',
                name: 'blue',
                imgUrl: 'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg',
                previewImgUrl: 'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg'
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

    clicked() {
        this.visible = !this.visible;
    }
}
