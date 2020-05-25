import { BehaviorSubject, combineLatest } from 'rxjs';

import { ISirSkuData, ISirSkuSpec, ISirSkuSpecCategory, ISirSkuCombination } from './sku.model';
import { map, } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { SkuGraph } from './sku-graph';



export interface ISkuSpecInfo extends ISirSkuSpec {
    readonly categoryIndex: number;
}

export interface ISkuSelectedResult {
    readonly stockCount: number;
    readonly price: string;
}

@Injectable()
export class SkuDataProvider {
    public readonly skuData$$ = new BehaviorSubject<ISirSkuData | null>(null);
    public readonly finishSelected$$ = new BehaviorSubject(false);
    public readonly specInfos$$ = new BehaviorSubject<ISkuSpecInfo[]>([]);
    public readonly selectedSpecs$$ = new BehaviorSubject<ISkuSpecInfo[]>([]);

    public readonly categories$ = this.skuData$$.pipe(
        map(data => data?.specCategories || [])
    );

    public readonly combinations$ = this.skuData$$.pipe(map(data => data?.combinations || []));

    public readonly graph$ = combineLatest([this.specInfos$$, this.combinations$]).pipe(
        map((value) => this.getGraph(value))
    );

    public readonly selectedResult$ = combineLatest([
        this.skuData$$,
        this.finishSelected$$,
        this.selectedSpecs$$,
        this.combinations$,
    ]).pipe(
        map((value) => this.getResult(value))
    );



    private graph: SkuGraph | null = null;
    private specsEmitted = false;
    private graphEmitted = false;

    private get specInfos() {
        return this.specInfos$$.value;
    }

    constructor() {
        this.skuData$$.subscribe((data) => {
            if (!data) {
                return;
            }
            this.specsEmitted = true;
            this.graphEmitted = true;
        });

        this.categories$.subscribe((categories) => {
            if (this.specsEmitted) {
                this.specsEmitted = false;
                const specInfos = [];
                for (let i = 0; i < categories.length; i++) {
                    for (const spec of categories[i].specs) {
                        specInfos.push({ ...spec, categoryIndex: i });
                    }
                }
                this.specInfos$$.next(specInfos);
            }
        });
    }

    updateSpecsInfos(bits: number[]) {
        if (this.specInfos.length !== bits.length) {
            return;
        }
        for (let i = 0; i < bits.length; i++) {
            this.specInfos[i].unselectable = !!bits[i];
        }
    }


    private getGraph(value: [ISkuSpecInfo[], ISirSkuCombination[]]) {
        if (this.graphEmitted) {
            this.graphEmitted = false;
            this.graph = SkuGraph.create(...value);
        }
        return this.graph;
    }

    private getResult([data, finishSelected, infos, combinations]: [
        ISirSkuData | null,
        boolean,
        ISkuSpecInfo[],
        ISirSkuCombination[]
    ]): ISkuSelectedResult {
        if (!data) {
            return { stockCount: 0, price: '0' };
        }
        if (finishSelected) {
            // TODO: add finish selected logic
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
