
import { FieldType } from '../../sql/query/interface.js'
import { field } from './field.js'

export class CharField extends field{
	maxLength:number | undefined
	minLength:number | undefined
	choices: any[] | undefined

	type: FieldType.CHAR
	
	constructor(data?:{maxLength?:number, minLength?:number}) {
		super()
		Object.assign(this, data);
	}

}
