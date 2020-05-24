import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import {
    ISirSkuCustomStepperConfig,
    ISirSkuMessageConfig,
    ISirSkuData,
    ISirSkuProperty,
    ISirSkuReturnData,
    ISirSkuInitialSkuData,
    ISirSkuSpec,
    ISirSkuGoods,
    ISirSkuCombination,
    ISirSkuPropertyContent
} from './sku.model';
import { SkuService } from './sku.service';

@Component({
    selector: 'sir-sku',
    templateUrl: './sku.component.html',
    styleUrls: ['./sku.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SirSkuComponent implements OnInit, OnDestroy, OnChanges {

    @Input() visible: boolean = false;

    @Input() sku?: ISirSkuData;

    @Input() goods?: ISirSkuGoods;

    @Input() goodsId: number | string = 0;

    @Input() priceTag: string = '￥';

    @Input() hideStock: boolean = false;

    @Input() hideQuotaText: boolean = false;

    @Input() hideSelectedText: boolean = false;

    @Input() stockThreshold: number = 0;

    @Input() showAddCartButton: boolean = true;

    @Input() buyText: boolean = false;

    @Input() addCartText: string = 'add cart';

    @Input() quota: number = 0;

    @Input() quotaUsed: number = 0;

    @Input() resetStepperOnHide: boolean = false;

    @Input() resetSelectedSkuOnHide: boolean = false;

    @Input() disableStepperOnput: boolean = false;

    @Input() closeOnClickOverlay: boolean = false;

    @Input() stepperTitle: string = '购买数量';

    @Input() customStepperConfig?: ISirSkuCustomStepperConfig;

    @Input() messageConfig?: ISirSkuMessageConfig;

    @Input() initialSku?: ISirSkuInitialSkuData;

    @Input() getContainer: string | (() => Element) = '';

    @Input() showSoldoutSku: boolean = true;

    @Input() enableSafeAreaInsetBottom: boolean = true;

    @Input() startSaleCount: number = 1;

    @Input() properties: ISirSkuProperty[] = [];

    @Input() previewOnClickImage: boolean = true;

    @Output() visibleChange = new EventEmitter<boolean>();

    @Output() getSkuData = new EventEmitter<ISirSkuReturnData>();

    currentSpecificationValue?: ISirSkuSpec;
    currentCombination?: ISirSkuCombination;
    currentPropertyIndex: number = 0;
    currentPrice: number = 0;

    skuReturnData?: ISirSkuReturnData;

    get specCtegories$() {
        return this.skuService.specCtegories$;
    }

    get selectionText$() {
        return this.skuService.specCtegories$.pipe(
            map((categories) => {
                if (!categories) {
                    return '';
                }
                let finishSelected = false;
                const text = categories.reduce((prev, curr, index) => {
                    finishSelected = !!curr.selected && finishSelected;
                    if (!curr.selected) {
                        return prev + curr.name + (categories.length === index + 1 ? '。' : '，');
                    } else {
                        return '';
                    }
                }, '请选择');
                if (finishSelected) {

                }
                return text;
            })
        );
    }


    private destroy$ = new Subject<void>();

    constructor(private skuService: SkuService) { }

    ngOnInit(): void {
        this.updateSku();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        const { sku } = simpleChanges;
        if (!sku?.firstChange) {
            this.updateSku();
        }
    }

    updateSku() {
        if (!this.sku) {
            return;
        }
        this.skuService.skuData = this.sku;
        this.currentSpecificationValue = this.sku.specCategories[0].specs[0];
        this.currentCombination = this.sku.combinations[0];
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    select({ type, item }: { type: 'spec', item: ISirSkuSpec } & { type: 'property', item: ISirSkuPropertyContent }) {
        if (type === 'property') {
            this.skuService.selectProperty();
        } else {
            this.skuService.selectSpec(item);
        }
    }
}
