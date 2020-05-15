import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
    ISirSkuCustomStepperConfig,
    ISirSkuMessageConfig,
    ISirSkuData,
    ISirSkuProperty,
    ISirSkuReturnData,
    ISirSkuInitialSkuData
} from './sir-sku.model';

@Component({
    selector: 'sir-sku',
    templateUrl: './sir-sku.component.html',
    styleUrls: ['./sir-sku.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SirSkuComponent implements OnInit, OnDestroy {

    @Input() visible: boolean = false;

    @Input() sku?: ISirSkuData;

    @Input() goods?: {};

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


    @ViewChild('templateRef') templateRef?: TemplateRef<void>;


    private overlayRef?: OverlayRef;

    private destroy$ = new Subject<void>();

    constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) { }

    ngOnInit(): void {
        if (this.templateRef) {
            this.overlayRef = this.overlay.create({hasBackdrop: true});
            this.overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef));

            this.overlayRef.backdropClick().pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.updateVisible(false);
            });
        }
    }
    
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.overlayRef?.dispose();
    }

    open() {
    }

    updateVisible(value: boolean) {
        this.visible = value;
        this.visibleChange.emit(value);
    }

}
