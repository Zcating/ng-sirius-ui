import { SirAny } from 'ng-sirius/core/types/any';
import { ISirSkuSpec, ISirSkuCombination } from './sku.model';

export class Node<T = SirAny> {

    edges: number[] = [];

    constructor(public readonly value: T) {
    }
}

export class SkuGraph {

    static create(specInfos: ISirSkuSpec[], combinations: ISirSkuCombination[]) {
        const nodes: Node<ISirSkuSpec>[] = specInfos.map(value => new Node(value));

        for (const node of nodes) {
            node.edges = new Array(nodes.length).fill(0);
        }


        for (const comb of combinations) {
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


    get nodeCount() {
        return this.nodes.length;
    }

    private constructor(
        private readonly nodes: Node<ISirSkuSpec>[]
    ) { }

    queryAllNodeValues(): (ISirSkuSpec | null)[] {
        return this.nodes.map(node => node.value);
    }

    queryNodeBits(target?: ISirSkuSpec): number[] {
        if (!target) {
            return new Array(this.nodeCount).fill(1);
        }
        const index = this.nodes.findIndex((node) => node.value.id === target.id);
        return this.nodes[index]?.edges;
    }

    getUnion(bits: number[], target: ISirSkuSpec, process?: (value: number[]) => number[]) {
        let value = this.queryNodeBits(target);
        if (process) {
            value = process(value);
        }
        return this.union(bits, value);
    }

    getIntersection(bits: number[], target: ISirSkuSpec, process?: (value: number[]) => number[]) {
        let value = this.queryNodeBits(target);
        if (process) {
            value = process(value);
        }
        return this.intersection(bits, value);
    }


    inverse(arr: number[]): number[] {
        return arr.map(value => !value ? 1 : 0);
    }

    intersection(arr1: number[], arr2: number[]) {
        return arr1.map((value, index) => value === arr2[index] ? value : 0);
    }

    union(arr1: number[], arr2: number[]) {
        return arr1.map((value, index) => value || arr2[index] || 0);
    }
}

