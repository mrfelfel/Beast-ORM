import { TableSchema } from '../../models/register-modal.interface.js';
import { operator } from './object-operator.js'
import { getDeep } from '../../utils.js'

export class ObjectConditionOperator {

	constructor(private row, private TableSchema:TableSchema) {}

	async run(args): Promise<boolean| any> {
		
		return new Promise(async(resolve, reject) => {
			const loop = async (o) => {
				// https://stackoverflow.com/a/38597076/14115342
				await Object.keys(o).forEach( async (k) => {
					if ( o[k].constructor.name === 'Array') {
						await loop(o[k]);
					} else {
						const result = await this.execute(o[k])
						if(result) {
							resolve(true)
						}
					}
				});
				return o
			}
			await loop(args)
			resolve(false)
		})

	}

	private async execute(objOperator: any): Promise<boolean> {

		const keys = Object.keys(objOperator)

		for(let field of keys) {

			const element = field.split('__')
			
			if(element.length == 1) {
				element.push('eq')
			}

			const operation = element.pop()
			const fieldName = element.join('.')
			
			if(operator[operation]) {
				const rowFieldValue = getDeep(this.row, fieldName)
				const arg = objOperator[field];

				const operationResult: boolean = await operator[operation](field, arg, rowFieldValue, this.row, this.TableSchema)
				if(!operationResult) {
					
					return false
				}
			}
		}

		return true
	}

}