import { Methods, getParams, Method } from '../models/model.interface.js'

interface WsRegister {
	type?: 'response' | 'Register',
	queryId: string,
	params: any,
	method: 'execute' | 'migrate',
	callback: Function,
	done?: Function
}

export class _IndexedDBWorkerQueue {

	private myWorker:  Worker | null;
	webWorkerModuleSupport = false

	constructor() {

		this.webWorkerModuleSupport = this.supportsWorkerType()

		if(this.webWorkerModuleSupport) {
			
			this.myWorker = new Worker(new URL('./worker.js', import.meta.url),{ type: "module" });

			this.myWorker.onmessage =  (oEvent) => {
				const data = oEvent.data
				this.onmessage(data)
			}

			this.myWorker.onerror = (error) => {
				console.log('myWorker', error);
			};
		}
	}

	// https://stackoverflow.com/a/62963963/14115342
	supportsWorkerType() {
		let supports = false;
		const tester = {
			get type() { return supports = true; } // it's been called, it's supported
		}
		try {
			const worker = new Worker('blob://', tester as any);
		} finally {
			return supports;
		}
	}

	private  workerQueues: {[key: string]:  WsRegister} = {}

	register(data: WsRegister) {
		try { 
			this.myWorker.postMessage(data.params);
			this.workerQueues[data.queryId] = data
			return data.queryId
		} catch (error) {
			console.log(error)
			return false
		}
		
	}

	async onmessage (data: any) {
		const value = this.workerQueues[data.queryId]
		value[data.run](data)
	}

	finish(queryId) {
		try {
			delete this.workerQueues[queryId]
		} catch (error) {}
	}

	updateFunction(queryId, run , func:Function) {
		
		this.workerQueues[queryId][run] = (message) =>{
			func(message.value)
		}
	}

}


export const IndexedDBWorkerQueue = new _IndexedDBWorkerQueue()