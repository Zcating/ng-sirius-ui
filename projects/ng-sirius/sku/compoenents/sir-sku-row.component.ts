import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ISirSkuPropertyContent, ISirSkuSpecification } from '../sir-sku.model';



@Component({
    selector: 'sir-sku-row',
    styleUrls: ['../sir-sku.component.scss'],
    template: `
        <div class="sir-sku-row">
            <header class="sir-sku-row-title">
                {{ title }} <span class="sir-sku-row-multiple-text" *ngIf="isMultiple">（{{ multipleText }}）</span>
            </header>
            <section class="sir-sku-row-items">
                <ng-container *ngFor="let item of items; let i = index">
                    <div 
                        class="sir-sku-row-item"
                        [class.sir-sku-row-item-selected]="selectedTags[i]"
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
export class SirSkuRowComponent {
    @Input() title: string = '';
    @Input() isMultiple: boolean = false;
    @Input() multipleText: string = '可多选';
    @Input() type: 'property' | 'spec' = 'spec';
    @Input() items?: ISirSkuPropertyContent & {selected: boolean} [] | ISirSkuSpecification & {selected: boolean}[];

    @Output() select = new EventEmitter<{ type: 'property' | 'spec', item: ISirSkuPropertyContent | ISirSkuSpecification, selected: boolean}>();

    selectedTags: boolean[] = [];

    clickItem(index: number, type: 'property' | 'spec', item: ISirSkuPropertyContent | ISirSkuSpecification) {
        const currentTag = !this.selectedTags[index];
        if (!this.isMultiple) {
            this.selectedTags.fill(false);
        }
        this.selectedTags[index] = currentTag;

        this.select.emit({ type: type, item: item, selected: this.selectedTags[index]});
    }
}
