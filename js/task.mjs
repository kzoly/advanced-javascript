export class Task {
    // we list property names for our self, so we know what property should have this object
    id = undefined;
    title = undefined;
    isDone = undefined;
    dueDate  = undefined;
    createdAt = undefined;

    constructor(initData) {
        // check if we have initial data
        if (typeof initData !== 'object') { return; }
        // go over the initData propertyNames
        Object.keys(initData)
            .filter(propertyName => this.hasOwnProperty(propertyName))
            .forEach(propertyName => this[propertyName] = initData[propertyName]);
    }
}