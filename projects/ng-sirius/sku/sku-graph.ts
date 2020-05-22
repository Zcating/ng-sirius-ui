import { SirAny } from 'ng-sirius/core/types/any';
import { ISirSkuData, ISirSkuSpec } from './sku.model';

export class Node<T = SirAny> {

    edges: number[] = [];

    constructor(public readonly value: T) {

    }
}

export class Edge<T = SirAny> {

    constructor(
        public readonly value: T,
        public previous: number = 0,
        public next: number = 0
    ) { }
}

export class SkuGraph<T = SirAny> {
    constructor(
        private readonly nodes: Node<T>[],
        private readonly edges: number[][]
    ) { }
}

export function createGraph(data: ISirSkuData) {
    const nodes: Node<ISirSkuSpec>[] = [];
    for (const category of data.specCategories) {
        for (const spec of category.specs) {
            nodes.push(new Node(spec));
        }
    }

    const edges = new Array(nodes.length).fill(new Array(nodes.length).fill(0));


    for (const comb of data.combinations) {
        for (const id1 of comb.specIds) {
            for (const id2 of comb.specIds) {
                if (id1 === id2) {
                    continue;
                }
                const x = nodes.findIndex((theNode) => {
                    return theNode.value.id === id1;
                });
                const y = nodes.findIndex((theNode) => {
                    return theNode.value.id === id2;
                });
                edges[x][y] = 1;
            }
        }
    }
    return new SkuGraph(nodes, edges);
}
