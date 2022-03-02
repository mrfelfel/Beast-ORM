import { uniqueGenerator } from '../utils.js';
/**
 * @description this variable register all methods called in a single query
 * User.filter(...).filter(...) in this case a single query will contain two filter
 */
let queries = {} = {};
// inspire by https://github.com/brianschardt/browser-orm
export class Model {
    constructor(objData) {
        Object.assign(this, objData || {});
    }
    // all non static method call a static method that contain all the logic
    // this way all methods of the model can be called without creating a new instance of it
    filter(...arg) {
        return Model.filter(arg);
    }
    // filter rows in the tables
    static filter(...arg) {
        // generate a unique id to associate methods in a query
        const queryId = uniqueGenerator(); // id = [filter,filter,execute]
        const object = Model.object(queryId, ['filter', arg]);
        // this Object.assign return a new similar instance
        return Object.assign(this, object);
    }
}
/**
 * @param queryId
 * @param some is present when object is being called by that static and non static method
 * @returns all method that can be executed again on this class after executing one like
 */
Model.object = (queryId, some) => {
    if (!queries[queryId]) {
        queries[queryId] = [];
    }
    // all first method called execute this 
    // User."filter()".filter()
    if (some) {
        const methodName = some[0];
        const methodArgs = some[1];
        Model.object(queryId)[methodName](...methodArgs);
    }
    // all second method and beyond will execute from this return
    // User.filter()."filter()"
    return {
        filter: (a, b, c, d) => {
            // register the function name is the query
            queries[queryId].push({ methodName: 'filter', arguments: [a, b, c, d] });
            // return self and merge all method of the property object to self
            return Object.assign(Model, Model.object(queryId));
        },
        select: () => { },
        execute() { }
    };
};
