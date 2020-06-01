import { SirAny } from 'ng-sirius/core/types/any';
import { ISirSkuSpec, ISirSkuCombination } from './sku.model';
import { ISkuSpecInfo } from './sku.service';

export class Node<T = SirAny> {

    edges: number[] = [];

    constructor(public readonly value: T) {
    }
}

export class SkuGraph {

    static create(specInfos: ISkuSpecInfo[], combinations: ISirSkuCombination[]) {
        const nodes: Node<ISkuSpecInfo>[] = specInfos.map(value => new Node(value));

        for (const node of nodes) {
            node.edges = new Array(nodes.length).fill(0);
        }

        for (let i = 0; i < specInfos.length; i++) {
            for (let j = i + 1; j < specInfos.length; j++) {
                if (specInfos[i].categoryIndex === specInfos[j].categoryIndex) {
                    nodes[i].edges[j] = 1;
                    nodes[j].edges[i] = 1;
                }
            }
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

    private readonly initNodeBits: number[];
    private readonly staredNodeBits: number[];

    private constructor(
        private readonly nodes: Node<ISirSkuSpec>[],
    ) {
        this.initNodeBits = this.nodes.map(
            value => value.edges.reduce(
                (prev, curr) => prev + curr > 0 ? 1 : 0, 0
            )
        );
        this.staredNodeBits = new Array(this.nodeCount).fill(0);

        for (const node of nodes) {
            console.log(node.edges);
        }
    }


    queryAllNodeValues(): (ISirSkuSpec | null)[] {
        return this.nodes.map(node => node.value);
    }

    queryNodeBits(target?: ISirSkuSpec): number[] {
        if (!target) {
            return this.initNodeBits;
        }
        const index = this.nodes.findIndex((node) => node.value.id === target.id);
        return this.nodes[index]?.edges;
    }


    getIntersection(targets: ISirSkuSpec[]) {
        const result = targets.reduce((prev, current) => {
            return this.intersection(prev, this.queryNodeBits(current));
        }, this.staredNodeBits);
        console.log(result);
        return result.map(value => Number(value >= targets.length));
    }


    private intersection(arr1: number[], arr2: number[]) {
        return arr1.map((value, index) => value + arr2[index]);
    }
}

