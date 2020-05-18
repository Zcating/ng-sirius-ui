import { coerceBooleanProperty, coerceCssPixelValue } from '@angular/cdk/coercion';

export function toBoolean(value: boolean | string): boolean {
    return coerceBooleanProperty(value);
}

export function toCssPixel(value: number | string): string {
    return coerceCssPixelValue(value);
}
