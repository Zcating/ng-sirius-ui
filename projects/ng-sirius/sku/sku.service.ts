import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { ISirSkuData, ISirSkuSpec, ISirSkuPropertyContent } from './sku.model';
import { SkuGraph } from './sku-data';

export interface CategorySpecConn {
    categoryId: string;
    spec: ISirSkuSpec;
}

export interface CombInfo {
    price: number | string;
    stockCount: number;
}

@Injectable()
export class SkuService {
    private readonly _skuData = new BehaviorSubject<ISirSkuData | null>(null);
    private readonly _optionalSpecs = new BehaviorSubject<(ISirSkuSpec | null)[]>([]);
    private readonly _selectedSpecs = new BehaviorSubject<CategorySpecConn[]>([]);
    private graph?: SkuGraph<ISirSkuSpec> | null;

    skuData$ = this._skuData.asObservable();
    get skuData() { return this._skuData.value; }
    set skuData(value: ISirSkuData | null) { this._skuData.next(value); }

    optionalSpecs$ = this._optionalSpecs.asObservable();
    get optionalSpecs() { return this._optionalSpecs.value; }
    set optionalSpecs(value: (ISirSkuSpec | null)[]) { this._optionalSpecs.next(value); }

    selectedSpecs$ = this._selectedSpecs.asObservable();
    get selectedSpecs() { return this._selectedSpecs.value; }
    set selectedSpecs(value) { this._selectedSpecs.next(value); }


    specCtegories$ = this.optionalSpecs$.pipe(
        withLatestFrom(
            this.skuData$.pipe(
                map(data => data?.specCategories)
            )
        ),
        map(([specs, categories]) => {
            if (!categories) {
                return categories;
            }
            for (const category of categories) {
                let selected = false;
                for (const spec of category.specs) {
                    // calculate the category if is selected.
                    selected = spec.selected || selected;

                    if (spec.selected) {
                        continue;
                    }
                    spec.unselectable = !specs.some((value) => value?.id === spec.id);
                    if (spec.unselectable) {
                        spec.selected = false;
                    }
                }
                category.selected = selected;
            }
            return categories;
        })
    );

    currentCombination$ = this.selectedSpecs$.pipe(
        withLatestFrom(this.skuData$),
        map(([specConns, data]) => {
            if (!data) {
                return;
            }
            if (data.specCategories.length === specConns.length) {
                let combInfo: CombInfo | undefined;
                for (const comb of data.combinations) {
                    let flag = false;
                    for (let i = 0; i < specConns.length; i++) {
                        const specId = specConns[i].spec.id;
                        const combSpecId = comb.specIds[i];
                        flag = specId === combSpecId || flag;
                    }
                    if (flag) {
                        combInfo = {
                            stockCount: comb.stockCount,
                            price: comb.price
                        };
                    }
                }
                return combInfo;
            } else {
                return {
                    stockCount: data.stockCount,
                    price: data.price
                } as CombInfo;
            }
        })
    );

    constructor() {
        this.skuData$.subscribe((value) => {
            if (!value) {
                this.graph = null;
                this.optionalSpecs = [];
                return;
            }
            this.graph = SkuGraph.create(value);
            this.optionalSpecs = this.graph.queryAllNodeValues();
        });
    }


    selectSpec(categoryId: string, spec: ISirSkuSpec) {
        if (!this.graph || spec.unselectable) {
            return;
        }
        spec.selected = !spec.selected;
        const predicate = (value: ISirSkuSpec | null) => spec.id === value?.id;
        if (spec.selected) {
            this.optionalSpecs = this.graph.getUnion(this.optionalSpecs, 1, predicate);
            this.selectedSpecs = [...this.selectedSpecs, { spec, categoryId }];
        } else {
            const nagativeSpecs = this.graph.getIntersection(this.optionalSpecs, 0, predicate);
            const selectedSpecs = this.selectedSpecs.filter((value) => value.spec.id !== spec.id);
            // addtion infomation
            this.optionalSpecs = nagativeSpecs.filter((specs) => !selectedSpecs.some((value) => specs?.id === value.spec.id));
            this.selectedSpecs = selectedSpecs;
        }
    }

    selectPropertyContent(content: ISirSkuPropertyContent) {

    }
}

