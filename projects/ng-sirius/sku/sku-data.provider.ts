import { BehaviorSubject, from, combineLatest } from 'rxjs';

import { ISirSkuData, ISirSkuSpec, ISirSkuSpecCategory, ISirSkuCombination } from './sku.model';
import { map, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { SkuGraph } from './sku-graph';



export interface ISkuSpecInfo extends ISirSkuSpec {
    categoryIndex: number;
}

@Injectable()
export class SkuDataProvider {
    public readonly skuData$$ = new BehaviorSubject<ISirSkuData | null>(null);

    public readonly categories$ = this.skuData$$.pipe(
        map(data => data?.specCategories || [])
    );

    public readonly specInfos$ = this.categories$.pipe(
        map(this.getSpecInfos)
    );

    public readonly combinations$ = this.skuData$$.pipe(map(data => data?.combinations || []));

    public readonly graph$ = combineLatest([this.specInfos$, this.combinations$]).pipe(map(this.getGraph));

    private specInfos: ISkuSpecInfo[] = [];
    private graph: SkuGraph | null = null;
    private specsEmitted = false;
    private graphEmitted = false;

    constructor() {
        this.skuData$$.subscribe((data) => {
            if (!data) {
                return;
            }
            this.specsEmitted = true;
            this.graphEmitted = true;
        });
    }

    getCategoryBy(index: number) {
        return this.categories$.pipe(map(value => value[index] || null));
    }


    private getSpecInfos(categories: ISirSkuSpecCategory[]) {
        if (this.specsEmitted) {
            this.specsEmitted = false;
            const specInfos = [];
            for (let i = 0; i < categories.length; i++) {
                for (const spec of categories[i].specs) {
                    specInfos.push({ ...spec, categoryIndex: i });
                }
            }
            this.specInfos = specInfos;
        }
        return this.specInfos;
    }

    private getGraph(value: [ISkuSpecInfo[], ISirSkuCombination[]]) {
        if (this.graphEmitted) {
            this.graphEmitted = false;
            this.graph = SkuGraph.create(...value);
        }
        return this.graph;
    }
}