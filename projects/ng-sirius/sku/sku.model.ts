import { Observable } from 'rxjs';

// stock keeping unit data
export interface ISirSkuData {
    readonly specCategories: ISirSkuSpecCategory[];

    readonly combinations: ISirSkuCombination[];

    readonly price: string;

    readonly stockCount: number;

    readonly collectionId: number;

    readonly noneSku: boolean;

    readonly hiddenStock: boolean;

    readonly quantifier?: string;
}

export interface ISirSkuSpecCategory {
    readonly name: string;
    readonly specs: ISirSkuSpec[];
    selected?: boolean;
}

export interface ISirSkuSpec {
    readonly id: string;
    readonly name: string;
    readonly imgUrl?: string;
    readonly previewImgUrl?: string;
}


export interface ISirSkuCombination {
    id: string;
    price: string;
    stockCount: number;
    specIds: string[];
}


export interface ISirSkuTextMessage {
    type: 'text';
    multiple: boolean;
    name: string;
    required: boolean;
    placeholder: string;
}

export interface ISirSkuDateMessage {
    type: 'date';
    datetime: boolean;
    required: boolean;
    placeholder: string;
}

export type Messages = (ISirSkuDateMessage | ISirSkuTextMessage | ISirSkuMessage)[];


export interface ISirSkuMessage {
    type: 'id_no' | 'tel' | 'time' | 'email';
    required: boolean;
    placeholder: string;
}

export interface ISirSkuPropertyCategory {
    id: number;
    name: string;
    isMultiple: boolean;
    properties: ISirSkuProperty[];
}

export interface ISirSkuProperty {
    id: string;
    name: string;
    price: number;
}

export interface ISirSkuInitialSkuData {
    specId_1: string;
    specId_2: string;
    specId_3: string;
    selectedNum: 3;
    selectedProp: { [key in string | number]: number };
}

export interface ISirSkuGoods {
    picture: string;
}



export interface ISirSkuLimitData {
    action: 'minus' | 'plus';
    type: number;
    quota: number;
    quotaUsed: number;
    startSaleCount: number;
}

export interface ISirSkuCustomStepperConfig {
    // 自定义限购文案
    quotaText: string;

    // 库存
    stockCount: number;

    // 自定义步进器超过限制时的回调
    handleOverLimit: (data: ISirSkuLimitData) => void;

    // 步进器变化的回调
    handleStepperChange: (currentValue: number) => void;

    // 格式化库存
    stockFormatter: (stockCount: number) => string | number;
}

export interface ISirSkuMessageConfig {
    // 图片上传回调，需要返回一个promise，promise正确执行的结果需要是一个图片url
    uploadImage: () => Observable<string> | Promise<string>;

    // 最大上传的图片大小 (MB)
    uploadMaxSize: number;

    // placeholder 配置
    placeholderMap: { [key in string]: string };

    // 初始留言信息
    // 键：留言 name
    // 值：留言内容
    initialMessages: { [key in string]: string };
}


export interface ISirSkuReturnData {
    // 商品 id
    goodsId: string;

    // 选择的商品数量
    selectedCount: number;

    // 选择的 sku 组合
    selectedSkuComb: {
        id: number,
        price: number,
        stockCount: number,
        categories: ISirSkuPropertyCategory[],
        propertyPrice: number
    };
}
