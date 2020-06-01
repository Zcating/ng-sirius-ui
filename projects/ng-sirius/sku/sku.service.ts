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

export interface ISkuCategoryInfo extends ISirSkuSpecCategory {
    readonly specs: ISkuSpecInfo[];
    selected?: boolean;
}

export interface ISkuSelectedResult {
    readonly stockCount: number;
    readonly price: string;
    readonly picture: string;
    readonly id?: string;
    readonly specIds?: string[];
}

@Injectable()
export class SkuService {

    private readonly skuData$$ = new BehaviorSubject<ISirSkuData | null>(null);
    private readonly combinations$$ = new BehaviorSubject<ISirSkuCombination[]>([]);
    private readonly categories$$ = new BehaviorSubject<ISkuCategoryInfo[]>([]);
    private readonly specInfos$$ = new BehaviorSubject<ISkuSpecInfo[]>([]);
    private readonly selectedSpecs$$ = new BehaviorSubject<ISkuSpecInfo[]>([]);
    private readonly finishSelected$$ = new BehaviorSubject(false);
    private readonly selectedResult$$ = new BehaviorSubject<ISkuSelectedResult | null>(null);

    private startedBits: number[] = [];
    private graph?: SkuGraph;

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
                properties.push({ ...property });
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
            this.selectedSpecs$$.next([]);
            this.selectedResult$$.next({ price: data.price, stockCount: data.stockCount, picture: data.picture });
        });
    }

    selectSpec(specInfo: ISkuSpecInfo) {
        if (!this.graph) {
            return;
        }
        const graph = this.graph;
        const categories = this.categories$$.value;
        const prevSpecs = this.selectedSpecs$$.value;

        specInfo.selected = !specInfo.selected;
        categories[specInfo.categoryIndex].selected = specInfo.selected;

        for (const value of this.specInfos$$.value) {
            if (specInfo.id !== value.id && specInfo.categoryIndex === value.categoryIndex) {
                value.selected = false;
            }
        }
        
        let selectedSpecInfos;
        if (specInfo.selected) {
            // you should filter specification` by the same 'categoryId'
            selectedSpecInfos = [...prevSpecs.filter(value => value.categoryIndex !== specInfo.categoryIndex), specInfo];
        } else {
            selectedSpecInfos = prevSpecs.filter(value => value !== specInfo);
        }

        let bits;
        if (selectedSpecInfos.length) {
            bits = graph.getIntersection(selectedSpecInfos);
        } else {
            bits = graph.queryNodeBits();
        }

        for (let i = 0; i < bits.length; i++) {
            this.specInfos$$.value[i].unselectable = !bits[i];
        }

        this.selectedSpecs$$.next(selectedSpecInfos);
        this.selectedResult$$.next(this.getResult(selectedSpecInfos));
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
        this.graph = SkuGraph.create(specInfos, data.combinations);
        this.startedBits = this.graph.queryNodeBits();
    }


    private getResult(selectedSpecs: ISkuSpecInfo[]): ISkuSelectedResult {
        const data = this.skuData$$.value;
        const combinations = data?.combinations;
        if (!data || !combinations) {
            return { stockCount: 0, price: '0', picture: '' };
        }

        const foundedSpec = selectedSpecs.find(value => !!value.imgUrl);
        const picture = foundedSpec?.imgUrl || data.picture;

        if (selectedSpecs.length === data.specCategories.length) {
            let result;
            for (const combination of combinations) {
                let tag = true;
                for (const id of combination.specIds) {
                    tag = selectedSpecs.some(info => info.id === id) && tag;
                }

                if (tag) {
                    result = {
                        stockCount: combination.stockCount,
                        price: combination.price,
                        id: combination.id,
                        picture,
                        specIds: [...combination.specIds]
                    };
                    break;
                }
            }
            return result || { stockCount: data.stockCount, price: data.price, picture };
        } else {
            return { stockCount: data.stockCount, price: data.price, picture};
        }
    }
}

