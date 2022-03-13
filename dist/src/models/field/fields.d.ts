import { CharField as _CharField } from './char-field.js';
import { JsonField as _JsonField } from './json-field.js';
import { BooleanField as _BooleanField } from './boolean-field.js';
import { TextField as _TextField } from './text-field.js';
import { IntegerField as _IntegerField } from './integer-field.js';
import { DateField as _DateField } from './date-field.js';
import { BigIntegerField as _BigIntegerField } from './big-integer-field.js';
import { AutoFieldParams, CharFieldParams, IntegerFieldParams, TextFieldParams } from './interface.js';
import { AutoField as _AutoField } from './auto-field.js';
import { indexedDBJsonField } from './indexedDB-json-field.js';
import { indexedDBArrayField } from './indexedDB-array-field.js';
export declare function CharField(data?: CharFieldParams): _CharField;
export declare function JsonField(): _JsonField;
export declare function BooleanField(): _BooleanField;
export declare function TextField(data?: TextFieldParams): _TextField;
export declare function IntegerField(data?: IntegerFieldParams): _IntegerField;
export declare function DateField(): _DateField;
export declare function BigIntegerField(): _BigIntegerField;
export declare function AutoField(data: AutoFieldParams): _AutoField;
export declare const indexedDB: {
    fields: {
        JsonField: () => indexedDBJsonField;
        ArrayField: ({ type }: {
            type?: any;
        }) => indexedDBArrayField;
    };
};
