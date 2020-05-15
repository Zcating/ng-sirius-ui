import { Observable } from 'rxjs';

export interface ISirSkuData {
    specifications: ISirSkuSpecification[];
    combinations: ISirSkuCombination[];

    // 默认价格（单位元）
    price: string;

    // 商品总库存
    stockCount: number;

    // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
    collectionId: number;

    // 是否无规格商品
    noneSku: boolean;

    messages: (ISirSkuDateMessage | ISirSkuTextMessage | ISirSkuMessage)[];

    hide_stock: boolean;
}

export interface ISirSkuSpecification {
    key: string;
    values: ISirSkuSpecificationValue[];
    specKey: 'specId_1' | 'specId_2' | 'specId_3';
}

export interface ISirSkuSpecificationValue {
    id: string;
    name: string;
    imgUrl: string;
    previewImgUrl: string;
}

export interface ISirSkuCombination {
    // skuId，下单时后端需要
    id: number;
    // 价格（单位分）
    price: number;
    // 最多包含3个规格值，为0表示不存在该规格
    specId_1: string;
    specId_2: string;
    specId_3: string;
    // 当前 sku 组合对应的库存
    stockCount: number;
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

export interface ISirSkuMessage {
    type: 'id_no' | 'tel' | 'time' | 'email';
    required: boolean;
    placeholder: string;
}



export interface ISirSkuProperty {
    id: number;
    name: string;
    isMultiple: boolean;
    contents: ISirSkuPropertyContent[];
}

export interface ISirSkuPropertyContent {
    id: string,
    name: string,
    price: number,
}

export interface ISirSkuInitialSkuData {
    specId_1: string;
    specId_2: string;
    specId_3: string;
    selectedNum: 3,
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
    handleStepperChange: (currentValue: number) => void,

    // 格式化库存
    stockFormatter: (stockCount: number) => string | number,
}

export interface ISirSkuMessageConfig {
    // 图片上传回调，需要返回一个promise，promise正确执行的结果需要是一个图片url
    uploadImage: () => Observable<string> | Promise<string>;

    // 最大上传的图片大小 (MB)
    uploadMaxSize: number,

    // placeholder 配置
    placeholderMap: { [key in string]: string },

    // 初始留言信息
    // 键：留言 name
    // 值：留言内容
    initialMessages: { [key in string]: string };
}


export interface ISirSkuReturnData {
    // 商品 id
    goodsId: string;
    // 留言信息
    messages: { [key in string]: string },

    // 另一种格式的留言，key 不同
    cartMessages: { [key in string]: string },

    // 选择的商品数量
    selectedCount: number,

    // 选择的 sku 组合
    selectedSkuComb: {
        id: number,
        price: number,
        specId_1: string,
        specId_2: string,
        specId_3: string,
        stockCount: number,
        properties: ISirSkuProperty[],
        propertyPrice: number
    }
}
