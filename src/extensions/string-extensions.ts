interface String {
    /**
    * Removes html tag and returns plain text.
    * @param: this string
    */
    stripHtmlTags(): string;
};

String.prototype.stripHtmlTags = function (): string {
    if (typeof this === "undefined" || null === this) return "";
    let inputString: string = this;
    inputString = inputString.replace(new RegExp("</?span( [^>]*|/)?>", "i"), "");  // RegExp.(source, @"</?span( [^>]*|/)?>", string.Empty);
    inputString = inputString.replace(new RegExp("</?img( [^>]*|/)?>", "i"), "i");
    var regEx = new RegExp("<.*?>", "i");
    var ignoreStatement = regEx.exec(inputString);
    if (!ignoreStatement /* && ignoreStatement.length > 2 && typeof ignoreStatement[1] === "number" */) return inputString;
    let plainText: string = inputString.replace(new RegExp("<.*?>", "i"), "");
    let myString: string = plainText.replace(/\s+/i, " ");
    plainText = myString.replace(/\s/i, "");
    return plainText;
};