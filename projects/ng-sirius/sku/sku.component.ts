import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import {
    ISirSkuCustomStepperConfig,
    ISirSkuMessageConfig,
    ISirSkuData,
    ISirSkuPropertyCategory,
    ISirSkuReturnData,
    ISirSkuInitialSkuData,
    ISirSkuSpec,
    ISirSkuGoods,
    ISirSkuCombination,
    ISirSkuProperty
} from './sku.model';
import { SkuService, ISkuSelectedResult, ISkuSpecInfo } from './sku.service';
import { SkuRowEventData } from './components/sku-row.component';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'sir-sku',
    templateUrl: './sku.component.html',
    styleUrls: ['./sku.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SirSkuComponent implements OnInit, OnDestroy, OnChanges {

    @Input() visible: boolean = false;

    @Input() sku?: ISirSkuData;

    // @Input() goods?: ISirSkuGoods;

    @Input() goodsId: string = '';

    @Input() priceTag: string = '￥';

    @Input() hideStock: boolean = false;

    @Input() hideQuotaText: boolean = false;

    @Input() hideSelectedText: boolean = false;

    @Input() stockThreshold: number = 0;

    @Input() showAddCartButton: boolean = true;

    @Input() actionNormalText: string = 'add cart';

    @Input() actionMainText: string = 'buy';

    @Input() singleAction = false;

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

    @Input() previewOnClickImage: boolean = true;

    @Output() visibleChange = new EventEmitter<boolean>();

    @Output() sirOnMainAction = new EventEmitter<ISirSkuReturnData>();

    @Output() sirOnNormalAction = new EventEmitter<ISirSkuReturnData>();

    bodyStyle = {
        maxHeight: '80vh',
        minHeight: '50vh',
        padding: '0 16px'
    };

    currentPropertyIndex: number = 0;
    currentPrice: number = 0;
    selectedCount: number = 0;
    selectedResult: ISkuSelectedResult | null = null;

    get specCtegories$() {
        return this.skuService.categories$;
    }

    get quantifier() {
        return this.sku?.quantifier ?? '件';
    }

    get selectionText$() {
        return new BehaviorSubject('');
    }

    get MaxSelectedCount() {
        return this.selectedResult?.stockCount || 10;
    }

    private destroy$ = new Subject<void>();

    constructor(private skuService: SkuService) {
    }

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
        
        this.skuService.selectedResult$.pipe(
            takeUntil(this.destroy$)
        ).subscribe((value) => {
            this.selectedResult = value;
            // console.log(value);
        });
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    select({ type, item }: SkuRowEventData) {
        if (type === 'spec') {
            this.skuService.selectSpec(item as ISkuSpecInfo);
        }
    }

    normalActionClick() {
        this.sirOnNormalAction.emit({
            goodsId: this.goodsId,
            selectedCount: this.selectedCount,
            selectedSkuComb: {
                id: this.selectedResult?.id || '',
                stockCount: this.selectedResult?.stockCount || 0,
                price: this.selectedResult?.price || '',
                specIds: this.selectedResult?.specIds
            }
        });
    }

    mainActionClick() {
        this.sirOnMainAction.emit({
            goodsId: this.goodsId,
            selectedCount: this.selectedCount,
            selectedSkuComb: {
                id: this.selectedResult?.id || '',
                stockCount: this.selectedResult?.stockCount || 0,
                price: this.selectedResult?.price || '',
                specIds: this.selectedResult?.specIds
            }
        });
    }
}
