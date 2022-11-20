import { ArrOperatorOverwrite, ObjOperatorOverwrite, operator, OperatorsKeysArray } from './object-operator.js';
export class ObjectConditionOperator {
    constructor(row, TableSchema) {
        this.row = row;
        this.TableSchema = TableSchema;
        this.schemeFields = {} = {};
        for (const field of this.TableSchema.fields) {
            this.schemeFields[field.name] = field;
        }
        this.schemeFields[this.TableSchema.id.keyPath] = {
            keyPath: this.TableSchema.id.keyPath,
            name: this.TableSchema.id.keyPath,
            className: 'IntegerField',
        };
    }
    async run(args) {
        return new Promise(async (resolve, reject) => {
            const loop = async (o) => {
                // https://stackoverflow.com/a/38597076/14115342
                await Object.keys(o).forEach(async (k) => {
                    if (o[k].constructor.name === 'Array') {
                        await loop(o[k]);
                    }
                    else {
                        const result = await this.execute(o[k]);
                        if (result) {
                            resolve(true);
                        }
                    }
                });
                return o;
            };
            await loop(args);
            resolve(false);
        });
    }
    async execute(objOperator) {
        const keys = Object.keys(objOperator);
        for (let field of keys) {
            const element = field.split('__');
            if (element.length == 1) {
                element.push('eq');
            }
            let operation = element[element.length - 1];
            if (OperatorsKeysArray.includes(operation)) {
                operation = element.pop();
            }
            else {
                operation = 'eq';
            }
            const fieldName = element[0];
            const fieldPath = element.join('.');
            if (OperatorsKeysArray.includes(operation)) {
                const arg = objOperator[field];
                let operationResult;
                try {
                    if (this.schemeFields[fieldName].className == 'indexedDBJsonField') {
                        operationResult = await ObjOperatorOverwrite[operation]({ fieldName, arg, row: this.row, TableSchema: this.TableSchema, element: fieldName, fieldPath });
                    }
                    else if (this.schemeFields[fieldName].className == 'indexedDBArrayField') {
                        operationResult = await ArrOperatorOverwrite[operation]({ fieldName, arg, row: this.row, TableSchema: this.TableSchema, element: fieldName, fieldPath });
                    }
                    else {
                        operationResult = await operator[operation]({ fieldName, arg, row: this.row, TableSchema: this.TableSchema, element: fieldName, fieldPath });
                    }
                }
                catch (err) {
                    // console.log(this.TableSchema, this.schemeFields[fieldName])
                    throw ('Field ' + fieldName + ' does not exit on the table' + err);
                }
                if (!operationResult) {
                    return false;
                }
            }
        }
        return true;
    }
}
