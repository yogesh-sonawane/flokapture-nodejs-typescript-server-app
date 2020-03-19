interface Array<T> {
    /**
    * Returns last element from array without removing it.
    * null if length < 0.
    */
    last(): T;
    /**
    * Returns first element from array without removing it.
    * null if length < 0.
    */
    first(): T;
}

Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : null;
};
Array.prototype.first = function () {
    return this.length > 0 ? this[0] : null;
};