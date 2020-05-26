import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { ISirSkuData, ISirSkuSpec, ISirSkuSpecCategory, ISirSkuCombination, ISirSkuProperty, ISirSkuPropertyCategory } from './sku.model';
import { SkuGraph } from './sku-graph';

export interface ISkuSpecInfo extends ISirSkuSpec {
    readonly categoryIndex: number;
    selected?: boolean;
    unselectable?: boolean;
}

export interface ISkuPropertyInfo extends ISirSkuProperty {
    readonly categoryIndex: number;
    selected?: boolean;
    unselectable?: boolean;
}

export interface ISkuCategoryInfo extends ISirSkuSpecCategory {
    readonly specs: ISkuSpecInfo[];
}

export interface ISkuSelectedResult {
    readonly stockCount: number;
    readonly price: string;
}

@Injectable()
export class SkuService {

    private readonly skuData$$ = new BehaviorSubject<ISirSkuData | null>(null);
    private readonly combinations$$ = new BehaviorSubject<ISirSkuCombination[]>([]);
    private readonly categories$$ = new BehaviorSubject<ISkuCategoryInfo[]>([]);
    private readonly specInfos$$ = new BehaviorSubject<ISkuSpecInfo[]>([]);
    private readonly selectedSpecs$$ = new BehaviorSubject<ISkuSpecInfo[]>([]);
    private readonly finishSelected$$ = new BehaviorSubject(false);
    private readonly graph$$ = new BehaviorSubject<SkuGraph | null>(null);
    private readonly selectedResult$$ = new BehaviorSubject<ISkuSelectedResult | null>(null);

    private bits: number[] = [];

    public readonly combinations$ = this.combinations$$.asObservable();
    public readonly selectedResult$ = this.selectedResult$$.asObservable();
    public readonly categories$ = this.categories$$.asObservable();


    set skuData(value: ISirSkuData) {
        this.skuData$$.next(value);
    }

    set propertyCategories(categories: ISirSkuPropertyCategory[]) {
        const properties = [];
        for (const category of categories) {
            for (const property of category.properties) {
                properties.push({...property});
            }
        }
    }

    constructor() {
        this.skuData$$.subscribe((data) => {
            if (!data) {
                return;
            }

            this.initSpecsData(data);
            this.combinations$$.next(data.combinations);
            this.selectedResult$$.next({ price: data.price, stockCount: data.stockCount });
        });
    }

    selectSpec(specInfo: ISkuSpecInfo) {
        if (!this.graph$$.value) {
            return;
        }
        const graph = this.graph$$.value;

        specInfo.selected = !specInfo.selected;
        if (specInfo.selected) {
            this.selectedSpecs$$.next([...this.selectedSpecs$$.value, specInfo]);
            // R & Sn
            this.bits = graph.getIntersection(this.bits, specInfo);
        } else if (specInfo.unselectable) {
            const selectedSpecs = this.selectedSpecs$$.value.filter(value => value !== specInfo);
            this.selectedSpecs$$.next(selectedSpecs);

            // Rneg = ~R
            let bits = graph.inverse(this.bits);

            // Rneg & S1 & S2 & ... & S( St which not in S )
            for (const spec of selectedSpecs) {
                bits = graph.getIntersection(bits, spec);
            }
            this.bits = bits;
        }

        const specInfos = [...this.specInfos$$.value];
        for (let i = 0; i < this.bits.length; i++) {
            specInfos[i].unselectable = !this.bits[i];
        }

        this.selectedResult$$.next(this.getResult());
    }


    selectProperty(property: ISirSkuProperty) {

    }

    private initSpecsData(data: ISirSkuData) {
        const categories = data.specCategories;
        const newCategories = [];
        const specInfos = [];
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            const tmpSpecs = [];
            for (const spec of category.specs) {
                const specInfo = { ...spec, categoryIndex: i };
                specInfos.push(specInfo);
                tmpSpecs.push(specInfo);
            }
            newCategories.push({ name: category.name, specs: tmpSpecs });
        }
        this.categories$$.next(newCategories);
        this.specInfos$$.next(specInfos);
        this.graph$$.next(SkuGraph.create(specInfos, data.combinations));
        this.bits = this.graph$$.value!.queryNodeBits();
    }


    private getResult(): ISkuSelectedResult {
        const data = this.skuData$$.value;
        const infos = this.specInfos$$.value;
        const combinations = data?.combinations;
        const selectedSpecs = this.selectedSpecs$$.value;
        if (!data || !combinations) {
            return { stockCount: 0, price: '0' };
        }
        if (selectedSpecs.length === combinations.length) {
            let result;
            for (const combination of combinations) {
                let tag = true;
                for (const info of infos) {
                    tag = combination.specIds.some(id => info.id === id) && tag;
                }
                if (tag) {
                    result = { stockCount: combination.stockCount, price: combination.price };
                }
            }
            return result || { stockCount: data.stockCount, price: data.price };
        } else {
            return { stockCount: data.stockCount, price: data.price };
        }
    }
}

