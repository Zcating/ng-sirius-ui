import { Injectable, Type, InjectableProvider } from '@angular/core';
import { BehaviorSubject, observable } from 'rxjs';
import 'reflect-metadata';

import { SirAny } from '../types/any';

type InjectableType = { providedIn: Type<any> | 'root' | 'platform' | 'any' | null; } & InjectableProvider;

const behaviorSubjectKeyMap = new Map<string, (string)[]>();
const asObservableKeyMap = new Map<string, { observableName: string, key: (string) }[]>();

export class ObservableService {
    constructor() {
        const obj = new Map<string, BehaviorSubject<SirAny>>();
        console.log(this);
        for (const key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            } else {
                console.log(key);
            }
            const observableKey = Reflect.getMetadata(key, this);
            if (observableKey === 'observable') {
                // obj[`__${key}__`] = new BehaviorSubject<any>(undefined);
            }
            console.log(observableKey);
        }
    }
}

// export const ObservableService = (injectable?: InjectableType) => {
//     return (constr: Object) => {
//         const obj = new Map<string, BehaviorSubject<SirAny>>();

//         for (const key in constr) {
//             if (!constr.hasOwnProperty(key)) {
//                 continue;
//             }
//             const observableKey = Reflect.getMetadata(key, constr);
//             console.log(key);
//             if (observableKey === 'observable') {
//                 obj.set(`__${key}__`, new BehaviorSubject<any>(undefined));
//             }
//         }
//         console.log(obj);

//         // return Injectable(injectable)(constr);
//     };
// };

export const Observe: PropertyDecorator = (target: Object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(propertyKey, 'observable', target);
};

export function SetObservable(observableName?: string) {

    return (target: Object, propertyKey: string) => {
        if (!observableName) {
            observableName = propertyKey.slice(0, propertyKey.length - 2);
        }
        Reflect.defineMetadata(propertyKey, observableName, target);
    };
}

function updateBehaviorSubjectKeyMap(name: string, key: string) {
    console.log(name, key);
    let value = behaviorSubjectKeyMap.get(name);
    if (!value) {
        value = [];
        behaviorSubjectKeyMap.set(name, value);
    }
    value.push(key);
}

function setAsObservableKey(observableName: string, name: string, propertyKey: string) {
    let value = asObservableKeyMap.get(name);
    if (!value) {
        value = [];
        asObservableKeyMap.set(name, value);
    }
    value.push({ observableName, key: propertyKey });
}



function protectedTarget(target: SirAny) {
    if (!target.__subjectMap__) {
        const obj: { [key: string]: BehaviorSubject<any> } = {};
        target.__subjectMap__ = obj;
        target.__name__ = target.constructor.name;
    }
    return target;
}
