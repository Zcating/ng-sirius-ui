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
        private readonly nodes: Node<T>[]
    ) { }

    queryAllNodeValues(): (T | null)[] {
        return this.nodes.map(node => node.value);
    }

    queryNodeValuesByTag(theTag: 0 | 1, predicate: (value: T) => boolean): (T | null)[] {
        const index = this.nodes.findIndex((node) => predicate(node.value));
        return this.nodes[index]?.edges.map((tag, i) => {
            return tag === theTag ? this.nodes[i].value : null;
        }) || [];
    }
}

export function createGraph(data: ISirSkuData) {
    const nodes: Node<ISirSkuSpec>[] = [];
    for (const category of data.specCategories) {
        for (const spec of category.specs) {
            nodes.push(new Node(spec));
        }
    }

    for (const node of nodes) {
        node.edges = new Array(nodes.length).fill(0);
    }


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
                if (x === -1 || y === -1 || x === y) {
                    continue;
                }
                nodes[x].edges[y] = 1;
            }
        }
    }

    return new SkuGraph(nodes);
}

export function union<T>(arr1: T[], arr2: T[]) {
    return arr1.map((value, index) => value === arr2[index] ? value : null);
}

export function intersection<T>(arr1: T[], arr2: T[]) {
    return arr1.map((value, index) => value || arr2[index] || null);
}
