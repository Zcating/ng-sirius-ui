import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISirSkuData, ISirSkuSpec } from './sku.model';
import { SkuGraph, createGraph, union, intersection } from './sku-graph';
import { map, withLatestFrom } from 'rxjs/operators';



@Injectable()
export class SkuService {
    private readonly _skuData = new BehaviorSubject<ISirSkuData | null>(null);
    private readonly _optionalSpecs = new BehaviorSubject<(ISirSkuSpec | null)[]>([]);
    private graph?: SkuGraph<ISirSkuSpec> | null;

    skuData$ = this._skuData.asObservable();
    get skuData() { return this._skuData.value; }
    set skuData(value: ISirSkuData | null) { this._skuData.next(value); }

    optionalSpecs$ = this._optionalSpecs.asObservable();
    get optionalSpecs() { return this._optionalSpecs.value; }
    set optionalSpecs(value: (ISirSkuSpec | null)[]) { this._optionalSpecs.next(value); }

    specCtegories$ = this.skuData$.pipe(
        map(data => data?.specCategories),
        withLatestFrom(this.optionalSpecs$),
        map(([categories, specs]) => {
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


    constructor() {
        this._skuData.subscribe((value) => {
            if (!value) {
                this.graph = null;
                this.optionalSpecs = [];
                return;
            }
            this.graph = createGraph(value);
            console.log(this.graph);
            this.optionalSpecs = this.graph.queryAllNodeValues();
        });
    }


    selectSpec(spec: ISirSkuSpec) {
        if (!this.graph || spec.unselectable) {
            return;
        }
        spec.selected = !spec.selected;
        if (spec.selected) {
            this.optionalSpecs = union(this.optionalSpecs, this.graph.queryNodeValuesByTag(1, (value) => spec === value));
        } else {
            this.optionalSpecs = intersection(this.optionalSpecs, this.graph.queryNodeValuesByTag(0, (value) => spec === value));
        }
        console.log(this.optionalSpecs);
    }

    selectProperty() {

    }
}

