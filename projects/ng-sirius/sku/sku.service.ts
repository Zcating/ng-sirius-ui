import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { ISirSkuData, ISirSkuSpec, ISirSkuPropertyContent } from './sku.model';
import { SkuGraph } from './sku-graph';
import { SkuDataProvider } from './sku-data.provider';

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

    private graph: SkuGraph | null = null;

    get categories$() {
        return this.dataProvider.categories$;
    }

    get selectedResult$() {
        return this.dataProvider.selectedResult$;
    }

    set skuData(value: ISirSkuData | null) {
        this.dataProvider.skuData$$.next(value);
    }


    private bitGraph: number[] = [];

    constructor(private dataProvider: SkuDataProvider) {
        dataProvider.graph$.subscribe((value) => {
            this.graph = value;
            this.bitGraph = this.graph?.queryNodeBits() ?? [];
        });
    }


    selectSpec(spec: ISirSkuSpec) {
        if (!this.graph) {
            return;
        }
        spec.selected = !spec.selected;
        if (spec.selected) {
            this.updateBitGraph(this.graph, spec);
        } else {

        }
    }

    selectPropertyContent(content: ISirSkuPropertyContent) {

    }

    private updateBitGraph(graph: SkuGraph, spec: ISirSkuSpec) {
        const bitGraph = graph.getUnion(this.bitGraph, spec);
        this.dataProvider.updateSpecsInfos(bitGraph);
        this.bitGraph = bitGraph;
    }
}

