class State {
    constructor(v) {
        this.currentValue = v;
        this.initialValue = v;
        this.observers = []
        this.appliedCallback = null
    }

    observe(owner, callback) {
        this.observers.push({ owner, callback })
    }

    set value(v) {
        if (this.currentValue !== v) {
            this.currentValue = v;
            for (const obs of this.observers) {
                if (obs.owner.isConnected) {
                    if (this.appliedCallback) {
                        obs.callback(this.appliedCallback(v))
                    } else {
                        obs.callback(v)
                    }
                }
            }
        }
    }

    reset() {
        this.currentValue = this.initialValue;
    }

    get value() {
        return this.currentValue;
    }

    get appliedValue() {
        if (this.appliedCallback) return this.appliedCallback(this.currentValue)
        return this.currentValue;
    }

    valueOf() {
        return this.currentValue; 
    }

    apply(callback) {
        this.appliedCallback = callback
        callback(this.currentValue)
        return this
    }
}

function stateOf(data) {
    return new State(data)
}

function stateOf$1(data) {
    if (data === null || data === undefined) {
        return stateOf(null)
    } else if (data instanceof State) {
        return data
    } else {
        return stateOf(data)
    }
}


export { State, stateOf, stateOf$1 }

