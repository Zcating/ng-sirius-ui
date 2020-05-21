import { SirAny } from './any';

export type SirClassType = string | string[] | Set<string> | SirClassObject;

export type SirClassObject = {[key in string]: SirAny};

export type SirStyleObject = {[key in string]: SirAny};
