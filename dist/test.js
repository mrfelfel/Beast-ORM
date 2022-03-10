import { models } from './src/index.js';
import { operator } from './src/sql/Operators/object-operator.js'
import { ObjectConditionOperator } from './src/sql/Operators/Object-condition-operator.js'


window['models']  = models
window['operator'] = operator
window['ObjectConditionOperator'] = ObjectConditionOperator