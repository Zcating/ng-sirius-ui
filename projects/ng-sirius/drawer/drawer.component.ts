import {
    Component,
    OnInit,
    Input,
    TemplateRef,
    Type,
    ViewChild,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    AfterViewInit,
    Injector,
    Renderer2,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import { CdkPortalOutlet, TemplatePortal, PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { OverlayRef, Overlay, OverlayConfig, OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { takeUntil, reduce } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { toCssPixel } from 'ng-sirius/core/utils/convert';
import { SirAny as SiriusAny } from 'ng-sirius/core/types/any';

export const DRAWER_ANIMATE_DURATION = 300;

@Component({
    selector: 'sir-drawer',
    styleUrls: ['./drawer.component.scss'],
    template: `
    <ng-template #drawerTemplate>
        <div
            class="sir-drawer"
            [class.sir-drawer-open]="isOpen"
            [class.sir-drawer-top]="placement === 'top'"
            [class.sir-drawer-bottom]="placement === 'bottom'"
            [class.sir-drawer-right]="placement === 'right'"
            [class.sir-drawer-left]="placement === 'left'"
            [style.transition]="placementChanging ? 'none' : null"
            [style.zIndex]="zIndex"
        >
            <div class="sir-drawer-mask" (click)="maskClick()" *ngIf="mask"></div>
            <div
                class="sir-drawer-content-wrapper"
                [style.width]="cssWidth"
                [style.height]="cssHeight"
                [style.transform]="transform"
                [style.transition]="placementChanging ? 'none' : null"
            >
                <div class="sir-drawer-content">
                    <div class="sir-drawer-wrapper-body" [style.height]="isLeftOrRight ? '100%' : null">
                        <div
                            *ngIf="title || closable"
                            [class.sir-drawer-header]="!!title"
                            [class.sir-drawer-header-no-title]="!title"
                        >
                            <div *ngIf="title" class="sir-drawer-title"></div>
                            <button
                                *ngIf="closable"
                                (click)="closeClick()"
                                class="sir-drawer-close"
                                style="--scroll-bar: 0px;"
                            >X</button>
                        </div>
                        <div class="sir-drawer-body" [ngStyle]="bodyStyle">
                            <ng-content></ng-content>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </ng-template>
`
})
export class SirDrawerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @Input() closable: boolean = true;

    @Input() title: string = '';

    @Input() placement: 'left' | 'right' | 'top' | 'bottom' = 'left';

    @Input() bodyStyle: { [klass: string]: SiriusAny } = {};

    @Input() mask: boolean = true;

    @Input() maskClosable: boolean = true;

    @Input() closeOnNavigation: boolean = true;


    @Input() width: number | string = 256;
    @Input() height: number | string = 256;
    @Input() zIndex = 1000;


    @Input()
    set visible(value: boolean) {
        console.log('value', value);
        this.isOpen = value;
    }

    get visible(): boolean {
        return this.isOpen;
    }

    @Output() readonly sirOnClose: EventEmitter<MouseEvent> = new EventEmitter();
    @Output() readonly sirOnViewInit = new EventEmitter<void>();

    @ViewChild('drawerTemplate', { static: true }) drawerTemplate!: TemplateRef<void>;
    @ViewChild(CdkPortalOutlet, { static: false }) bodyPortalOutlet?: CdkPortalOutlet;


    destroy$ = new Subject<void>();
    overlayRef?: OverlayRef | null;
    portal?: TemplatePortal;
    // focusTrap?: FocusTrap;

    placementChanging = false;

    isOpen: boolean = false;

    private placementChangeTimeoutId?: number;

    get isLeftOrRight(): boolean {
        return this.placement === 'left' || this.placement === 'right';
    }

    get cssWidth(): string | null {
        return this.isLeftOrRight ? toCssPixel(this.width) : null;
    }

    get cssHeight(): string | null {
        return !this.isLeftOrRight ? toCssPixel(this.height) : null;
    }

    get transform(): string | null {
        if (this.visible) {
            return null;
        }

        switch (this.placement) {
            case 'left':
                return `translateX(-100%)`;
            case 'right':
                return `translateX(100%)`;
            case 'top':
                return `translateY(-100%)`;
            case 'bottom':
                return `translateY(100%)`;
        }
    }

    constructor(
        private cdr: ChangeDetectorRef,
        private viewContainerRef: ViewContainerRef,
        private overlay: Overlay
    ) { }

    ngOnInit(): void {
        this.attachOverlay();
        this.updateBodyOverflow();
        this.cdr.detectChanges();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.sirOnViewInit.emit();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { placement, visible } = changes;
        if (visible) {
            const value = changes.visible.currentValue;
            if (value) {
                this.open();
            } else {
                this.close();
            }
        }
        if (placement && !placement.isFirstChange()) {
            this.triggerPlacementChangeCycleOnce();
        }
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        clearTimeout(this.placementChangeTimeoutId);
    }

    open() {
        this.isOpen = true;
        this.attachOverlay();
        this.updateBodyOverflow();
        this.cdr.detectChanges();
    }

    close() {
        this.isOpen = false;
        this.cdr.detectChanges();
        setTimeout(() => {
            this.updateBodyOverflow();
        }, this.getAnimationDuration());
    }

    isTemplateRef(value: object) {
        return value instanceof TemplateRef;
    }

    closeClick() {
        this.sirOnClose.emit();
    }

    maskClick() {
        if (this.maskClosable && this.mask) {
            this.sirOnClose.emit();
        }
    }

    private getOverlayConfig(): OverlayConfig {
        return new OverlayConfig({
            disposeOnNavigation: this.closeOnNavigation,
            positionStrategy: this.overlay.position().global(),
            scrollStrategy: this.overlay.scrollStrategies.block(),
        });
    }

    private updateBodyOverflow(): void {
        if (this.overlayRef) {
            const strategy = this.overlayRef.getConfig().scrollStrategy;
            if (this.isOpen) {
                strategy?.enable();
            } else {
                strategy?.disable();
            }
        }
    }

    private attachOverlay(): void {
        if (!this.overlayRef) {
            this.portal = new TemplatePortal(this.drawerTemplate, this.viewContainerRef);
            this.overlayRef = this.overlay.create(this.getOverlayConfig());
        }
        if (this.overlayRef && !this.overlayRef.hasAttached()) {
            this.overlayRef.attach(this.portal);
            this.overlayRef.detachments().pipe(
                takeUntil(this.destroy$)
            ).subscribe(() => {
                this.disposeOverlay();
            });
        }
    }

    private disposeOverlay(): void {
        this.overlayRef?.dispose();
        this.overlayRef = null;
    }


    private getAnimationDuration(): number {
        return DRAWER_ANIMATE_DURATION;
    }

    // Disable the transition animation temporarily when the placement changing
    private triggerPlacementChangeCycleOnce(): void {
        this.placementChanging = true;
        this.cdr.markForCheck();
        clearTimeout(this.placementChangeTimeoutId);
        this.placementChangeTimeoutId = window.setTimeout(() => {
            this.placementChanging = false;
            this.cdr.markForCheck();
        }, this.getAnimationDuration());
    }
}



