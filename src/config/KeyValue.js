const _ = require('lodash');

class KeyValue {
    constructor(key, value, defaultValue, description) {
        this.key = key;
        this.value = value;
        this.defaultValue = defaultValue;
        this.description = description;
    }
}

KeyValue.prototype.toString = function() {
    return `${this.key}=${this.value} || ${this.defaultValue} || ${this.description}`;
}

KeyValue.prototype.hasValue = function() {
    return  !_.isUndefined(this.value) &&
            !_.isNull(this.value);
}

KeyValue.prototype.get = function() {
    return this.value;
}

KeyValue.prototype.getOrDefault = function() {
    return this.hasValue() ? this.get() : this.defaultValue;
}

module.exports = KeyValue;