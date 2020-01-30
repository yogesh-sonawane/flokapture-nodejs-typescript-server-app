import { LineDetails } from "../../models";

export default class UniverseArrayExtensions extends Array {
    removeCommentedAndBlankLines = function (inputArray: string[], commentChar: string): LineDetails[] {
        var lines = inputArray || [];
        var lineDetails = Array<LineDetails>();
        lines.forEach((line, index) => {
            const ld: LineDetails = {
                parsedLine: line.trim(),
                originalLine: line,
                lineIndex: index
            };
            lineDetails.push(ld);
        });

        const inputLines = lineDetails.filter(function (line) {
            return !((typeof line.parsedLine === "undefined"
                || line.parsedLine === ""
                || line.parsedLine === null
                || /\\s+/.test(line.parsedLine)))
                && !line.parsedLine.startsWith(commentChar);
        });
        return inputLines;
    };
    combineAllBrokenLines = function (inputArray: LineDetails[], lineBreakElement: string = "_", keepOrRemove: boolean = true): LineDetails[] {
        if (inputArray && inputArray.length <= 0) return inputArray;
        var tempList: LineDetails[] = [];
        var indexPosition = -1;
        var tempString = "";
        var regex = new RegExp("[" + lineBreakElement + "\\s]$", "ig");
        for (var i = 0; i < inputArray.length; i++) {
            indexPosition++;
            const lineDetails = inputArray[i];
            const strInput = inputArray[i].parsedLine.trimRight();
            if (regex.test(strInput)) {
                if (strInput.trim().startsWith("'")) continue;
                for (let index = 0; index < inputArray.length; index++) {
                    const element = inputArray[index].parsedLine.trimRight();
                    if (regex.test(element)) {
                        if (keepOrRemove) {
                            tempString += element.slice(element.length - 1, 1).trim() + " ";
                        }
                        else {
                            tempString += element.trim() + " ";
                        }
                        indexPosition++;
                        continue;
                    }

                    tempString += element.trim();
                    lineDetails.parsedLine = tempString;
                    tempList.push(lineDetails);
                    tempString = "";
                    break;
                }
                i = indexPosition;
            }
            else {
                tempList.push(lineDetails);
            }
        }
        return tempList;
    };
};

const universeArrayExtensions: UniverseArrayExtensions = new UniverseArrayExtensions();

export { universeArrayExtensions, UniverseArrayExtensions };