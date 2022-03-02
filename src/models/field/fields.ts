import {CharField as _CharField} from './char-field.js'
import {JsonField as _JsonField} from './json-field.js'

export function CharField(data?: { maxLength?: number; minLength?: number }) {
    return new _CharField(data)
};

export function JsonField() {
    return new _JsonField()
};