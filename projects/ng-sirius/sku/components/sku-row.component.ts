import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ISirSkuPropertyContent, ISirSkuSpec } from '../sku.model';

export interface SkuRowEventData {
    type: 'property' | 'spec';
    item: ISirSkuPropertyContent | ISirSkuSpec;
}

@Component({
    selector: 'sir-sku-row',
    styleUrls: ['../sku.component.scss'],
    template: `
        <div class="sir-sku-row">
            <header class="sir-sku-row-title">
                {{ title }} <span class="sir-sku-row-multiple-text" *ngIf="isMultiple">（{{ multipleText }}）</span>
            </header>
            <section class="sir-sku-row-items">
                <ng-container *ngFor="let item of items; let i = index">
                    <div
                        class="sir-sku-row-item"
                        [class.sir-sku-row-item-selected]="item.selected"
                        [class.sir-sku-row-item-disabled]="item.unselectable"
                        (click)="clickItem(i, type, item)"
                    >
                        <img class="sir-sku-row-item-img" *ngIf="item.previewImgUrl" [src]="item.previewImgUrl">
                        <span class="sir-sku-row-item-name">{{item.name}}</span>
                    </div>
                </ng-container>
            </section>
        </div>
    `,
})
export class SirSkuRowComponent implements OnInit {
    @Input() title: string = '';
    @Input() isMultiple: boolean = false;
    @Input() multipleText: string = '可多选';
    @Input() type: 'property' | 'spec' = 'spec';
    @Input() items?: ISirSkuPropertyContent[] | ISirSkuSpec[];

    @Output() sirOnSelect = new EventEmitter<SkuRowEventData>();

    selectedTags: boolean[] = [];

    constructor() {

    }

    ngOnInit(): void {

    }

    clickItem(index: number, type: 'property' | 'spec', item: ISirSkuPropertyContent | ISirSkuSpec) {
        this.sirOnSelect.emit({ type, item });
    }
}
