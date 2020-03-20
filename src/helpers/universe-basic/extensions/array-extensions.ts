import { LineDetails, TreeView } from "../../models";
export default class UniverseArrayExtensions extends Array {
    public _globalId: number;
    constructor() {
        super(); this._globalId = 1;
    }
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
    ifBlockStatements = function (allSeqListItems: Array<TreeView>, lstTreeView: Array<TreeView>): Array<TreeView> {
        let indexPosition = -1;
        let ifCounter = 0;
        for (var treeItem of allSeqListItems) {
            indexPosition++;
            if (!(treeItem.StatementReferenceMaster.BaseCommandMaster && treeItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 1)) continue;

            var treeViewList = new Array<TreeView>();
            for (let i = indexPosition; i < lstTreeView.length; i++) {
                treeViewList.push(lstTreeView[i]);
                const baseCommandMaster = lstTreeView[i].StatementReferenceMaster.BaseCommandMaster;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 1)
                    ifCounter++;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 2)
                    ifCounter--;
                if (ifCounter === 0)
                    break;
            }
            var prevParentId = treeViewList[0].ParentId;
            var graphId = "IfBlockStart-" + indexPosition + treeItem.ActualStatementId;
            treeViewList[0].GraphId = graphId;
            for (let j = 1; j < treeViewList.length; j++) {
                const baseCommandMaster = treeViewList[j].StatementReferenceMaster.BaseCommandMaster;
                if (!(treeViewList[j].ParentId === prevParentId)) continue;
                treeViewList[j].ParentId = graphId;

                treeViewList[j].IndentLevel = treeViewList[j].IndentLevel + 2;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 2)
                    treeViewList[j].IndentLevel = treeViewList[0].IndentLevel;
            }
        }
        return lstTreeView;
    };
    loopBlockStatements = function (allSeqListItems: Array<TreeView>, lstTreeView: Array<TreeView>): Array<TreeView> {
        let indexPosition = -1;
        let loopCounter = 0;
        for (const treeItem of allSeqListItems) {
            indexPosition++;
            if (!(treeItem.StatementReferenceMaster.BaseCommandMaster && treeItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 3)) continue;
            var treeViewList = new Array<TreeView>();
            for (let i = indexPosition; i < lstTreeView.length; i++) {
                treeViewList.push(lstTreeView[i]);
                const baseCommandMaster = lstTreeView[i].StatementReferenceMaster.BaseCommandMaster;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 3)
                    loopCounter++;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 4)
                    loopCounter--;
                if (loopCounter == 0)
                    break;
            }
            let curIndentLevel = treeViewList.first().IndentLevel;
            var prevParentId = treeViewList.first().ParentId;
            var graphId = "LoopStart-" + indexPosition + treeItem.ActualStatementId;
            treeViewList.first().GraphId = graphId;
            treeViewList.first().IndentLevel = curIndentLevel + 1;
            for (let j = 1; j < treeViewList.length; j++) {
                if (!(treeViewList[j].ParentId === prevParentId)) continue;

                treeViewList[j].ParentId = graphId;
                let treeGraphId = treeViewList[j].GraphId;
                let childItems = allSeqListItems.filter((value, index) => {
                    return value.ParentId === treeGraphId;
                })
                const baseCommandMaster = lstTreeView[j].StatementReferenceMaster.BaseCommandMaster;
                childItems.forEach(c => { c.IndentLevel = c.IndentLevel + 2; });
                treeViewList[j].IndentLevel = treeViewList[j].IndentLevel + 2;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 4)
                    treeViewList[j].IndentLevel = curIndentLevel + 1;
            }
        }
        return allSeqListItems;
    };
    elseBlockStatements = function (allSeqListItems: Array<TreeView>, lstTreeView: Array<TreeView>): Array<TreeView> {
        let indexPosition = -1;
        for (var treeItem of allSeqListItems) {
            indexPosition++;
            if (!(treeItem.StatementReferenceMaster.BaseCommandMaster && treeItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 10)) continue;
            let endIfCounter = -1;
            var treeViewList = new Array<TreeView>();
            for (let i = indexPosition; i < lstTreeView.length; i++) {
                treeViewList.push(lstTreeView[i]);
                const baseCommandMaster = lstTreeView[i].StatementReferenceMaster.BaseCommandMaster;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 1)
                    endIfCounter--;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 2)
                    endIfCounter++;
                if (endIfCounter === 0)
                    break;
            }
            let curIndentLevel = treeViewList.first().IndentLevel;
            var prevParentId = treeViewList.first().ParentId;
            var graphId = "ElseBlock-" + indexPosition + treeItem.ActualStatementId;
            treeViewList.first().GraphId = graphId;
            var parentIf = allSeqListItems.find(f => f.GraphId === prevParentId);
            treeViewList.first().IndentLevel = parentIf.IndentLevel;
            for (var j = 1; j < treeViewList.length; j++) {
                const baseCommandMaster = lstTreeView[j].StatementReferenceMaster.BaseCommandMaster;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 2) continue;
                if (!(treeViewList[j].ParentId === prevParentId)) continue;

                treeViewList[j].ParentId = graphId;
                treeViewList[j].IndentLevel = curIndentLevel + 1;
            }
        }
        return allSeqListItems;
    };
    processChildItems = function (lstTreeView: Array<TreeView>, currentItem: TreeView): Array<string> {
        let lstDecisions = new Array<string>();
        let carryForward = "T";
        lstDecisions.push(carryForward);
        var allChildItems: Array<TreeView> = lstTreeView.filter((value) => { return value.ParentId === currentItem.GraphId; });
        for (const childItem of allChildItems) {
            if (childItem.StatementReferenceMaster.BaseCommandMaster && childItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 2) continue;
            if (childItem.StatementReferenceMaster.BaseCommandMaster && childItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 1) {
                this.processTreeChildItems(lstTreeView, childItem, carryForward, false, lstDecisions);
            }
            if ([5, 6, 3, 8].includes(childItem.StatementReferenceMaster.BaseCommandMaster && childItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId)) {
                this.processTreeChildItems(lstTreeView, childItem, carryForward, true, lstDecisions);
            }
            if (!(childItem.StatementReferenceMaster.BaseCommandMaster && childItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 10)) continue;
            carryForward = "F";
            this.processTreeChildItems(lstTreeView, childItem, carryForward, false, lstDecisions);
        }
        return lstDecisions;
    };
    processTreeChildItems = function (lstTreeView: Array<TreeView>, currentItem: TreeView, carryForward: string, callIntOrExtOrLoop: boolean, lstDecisions: string[]) {
        var allChildItems: Array<TreeView> = lstTreeView.filter((value) => { return value.ParentId === currentItem.GraphId; });
        if (!callIntOrExtOrLoop) {
            lstDecisions.push(carryForward);
        }
        for (const childItem of allChildItems) {
            if (childItem.StatementReferenceMaster.BaseCommandMaster && childItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 2) continue;
            if (childItem.StatementReferenceMaster.BaseCommandMaster && childItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 1) {
                this.processTreeChildItems(lstTreeView, childItem, carryForward, false, lstDecisions);
            }
            if ([5, 6, 3, 8].includes(childItem.StatementReferenceMaster.BaseCommandMaster && childItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId)) {
                this.processTreeChildItems(lstTreeView, childItem, carryForward, true, lstDecisions);
            }
            if (!(childItem.StatementReferenceMaster.BaseCommandMaster && childItem.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 10)) continue;
            this.processTreeChildItems(lstTreeView, childItem, carryForward, false, lstDecisions);
        }
    };
    setIndentationLevel = function (lstTreeView: Array<TreeView>): Array<TreeView> {
        let lvlNumber = -1;
        let iPos = -1;
        for (var treeItem of lstTreeView) {
            iPos++;
            const baseCommandMaster = treeItem.StatementReferenceMaster.BaseCommandMaster;
            if (!baseCommandMaster) continue;
            if (baseCommandMaster.BaseCommandId !== 1 && baseCommandMaster.BaseCommandId !== 10) continue;
            lvlNumber++;
            treeItem.IndentLevel = lvlNumber; // : treeItem.IndentLevel;
            for (let i = iPos; ;) {
                var graphId = lstTreeView[i].GraphId;
                let allChildItems: Array<TreeView> = lstTreeView.filter((c) => {
                    return c.ParentId === graphId;
                });
                let tempLevel = 0;
                if (allChildItems.length > 0) tempLevel = treeItem.IndentLevel + 1;
                for (var cItem of allChildItems) {
                    cItem.IndentLevel = tempLevel;
                }
                break;
            }
        }
        return lstTreeView;
    };
    setCellValue = function (table: any[][], row: number, column: number, value: string | number): any[][] {
        try {
            table[row][column] = value;
            return table;
        } catch (error) {
            console.log(error);
            return table;
        }
    };
    prepareDecisionMatrix = function (lstTreeView: Array<TreeView>, ifBlockDictionary: [{ treeView: TreeView, decisions: Array<string> }]): string {
        let columnCount: number = lstTreeView.filter((value) => {
            return value.StatementReferenceMaster.BaseCommandMaster &&
                (value.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 1
                    || value.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 10);
        }).length;
        let conditionsCount: number = lstTreeView.filter((value) => {
            return value.StatementReferenceMaster.BaseCommandMaster &&
                value.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 1;
        }).length;
        let actionsCount: number = lstTreeView.filter((value) => {
            return value.StatementReferenceMaster.BaseCommandMaster &&
                (value.StatementReferenceMaster.BaseCommandMaster.BaseCommandId !== 1
                    && value.StatementReferenceMaster.BaseCommandMaster.BaseCommandId !== 2);
        }).length;

        let actionStartAt: number = conditionsCount + 1;
        let totalRows: number = (conditionsCount + actionsCount) + 15;
        let matrixTable: Array<Array<string>> = [];
        for (let rows = 0; rows <= totalRows; rows++) {
            let emptyElement: any[] = [];
            for (let cnt = 0; cnt <= columnCount; cnt++) {
                emptyElement.push('');
            }
            matrixTable.push(emptyElement);
        }
        matrixTable = this.setCellValue(matrixTable, 0, 0, "Conditions:");
        matrixTable = this.setCellValue(matrixTable, actionStartAt, 0, "Actions:");

        let bfCounter = 0;
        let iPosition = -1;
        let eRow: number = 0;
        actionStartAt = actionStartAt + 1;
        for (const treeItem of lstTreeView) {
            iPosition++;
            let commandMaster = treeItem.StatementReferenceMaster.BaseCommandMaster;
            if (commandMaster === null || !(commandMaster.BaseCommandId === 1)) continue;
            for (let i = iPosition; i < lstTreeView.length; i++) {
                var baseCommandMaster = lstTreeView[i].StatementReferenceMaster.BaseCommandMaster;
                let indentLevel: number = lstTreeView[i].IndentLevel;
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 1) {
                    eRow++;
                    var statement: string = lstTreeView[i].GraphName.stripHtmlTags().trim();
                    this.setCellValue(matrixTable, eRow, 0, statement);
                    this.setCellValue(matrixTable, 0, bfCounter + 1, `BF${bfCounter + 1}`);
                    for (const dict of ifBlockDictionary) {
                        if (dict.treeView.GraphId !== lstTreeView[i].GraphId) continue;
                        for (let j = 0; j < dict.decisions.length; j++) {
                            this.setCellValue(matrixTable, eRow, bfCounter + 1 + j, dict.decisions[j]);
                        }
                    }
                    bfCounter++;
                    continue;
                }
                if (baseCommandMaster && baseCommandMaster.BaseCommandId === 10) {
                    this.setCellValue(matrixTable, 0, bfCounter + 1, `BF${bfCounter + 1}`);
                    bfCounter++;
                    continue;
                }
                if (indentLevel === 0 || (baseCommandMaster && baseCommandMaster.BaseCommandId === 2)) continue;
                if (baseCommandMaster && (baseCommandMaster.BaseCommandId === 8 || baseCommandMaster.BaseCommandId === 9)) continue;

                this.setCellValue(matrixTable, actionStartAt, 0, lstTreeView[i].GraphName.stripHtmlTags().trim());
                this.setCellValue(matrixTable, actionStartAt, indentLevel, "X");
                actionStartAt++;
            }
            break;
        }
        let decisionHtml: string = this.prepareDecisionTable(matrixTable);
        // console.log(decisionHtml);
        return decisionHtml;
    };
    prepareDecisionTable = function (matrixTable: Array<Array<string>>): String {
        let decisionHtml: string = "";
        decisionHtml = decisionHtml.concat("<table class='table table-bordered table-striped users' style='border: none; width: 100%;'>");
        let rowCount: number = -1;

        for (const matrixRow of matrixTable) {
            rowCount++;
            if (matrixRow.every(c => c === "")) continue;
            decisionHtml = decisionHtml.concat("\n", "<tr>");
            let column: number = -1;
            let cellFont: string = "";
            if (rowCount === 0) cellFont = "background-color: black; color: white; width: 20%;";
            var cellTitle: string = matrixTable[rowCount][1];
            let colSpan: number = matrixTable.length;
            for (const cellValue of matrixRow) {
                column++;
                // var cellValue: string = matrixTable[rowCount][column];
                if (cellValue == "Actions:")
                    cellFont = "background-color: black; color: white;";
                if (rowCount == 0 && cellValue !== "Conditions:")
                    cellFont = "background-color: black; color: white; width: 3%;"; // width: 3%;    
                let cellString: string = this.prepareCell(cellTitle, cellValue, colSpan, cellFont);
                decisionHtml = decisionHtml.concat(cellString);
                if (cellValue == "Actions:") break;
            }
            decisionHtml = decisionHtml.concat("</tr>");
        }
        decisionHtml = decisionHtml.concat("\n", "</table>");
        return decisionHtml;
    };
    prepareCell = function (cellTitle: string, cellValue: string, colspan: number, cellFont: string): string {
        let cellString: string;
        if (typeof cellTitle !== "undefined" || cellTitle !== "")
            cellTitle = cellTitle.replace("'", "&apos;").replace(">", "&gt;").replace("<", "&lt;");
        if (typeof cellValue !== "undefined" || cellValue !== "")
            cellValue = cellValue.replace("'", "&apos;").replace(">", "&gt;").replace("<", "&lt;");
        // let paddingStyle: string = ";padding: 8px 0px 0px 6px;";
        let paddingStyle: string = "";
        switch (cellValue) {
            case "T":
                cellString = "<td title='" + cellTitle + "' style=' " +
                    "" + cellFont + paddingStyle + "; background-color: #8fbc8b; color: white;'>" + cellValue + "</td>";
                break;
            case "F":
                cellString = "<td title='" + cellTitle + "' style=' " +
                    "" + cellFont + paddingStyle + "; background-color: #ed7d31; color: white;'>" + cellValue + "</td>";
                break;
            case "X":
                cellString = "<td title='" + cellTitle + "' style=' " +
                    "" + cellFont + paddingStyle + "; background-color: #2d7b26; color: white;'>" + cellValue + "</td>";
                break;
            case "Actions:":
                cellString = "<td colspan='" + colspan + "' style='" + cellFont + paddingStyle + ";' >" + cellValue + "</td>";
                break;
            default:
                cellString = "<td title='" + cellTitle + "' for='" + this._globalId + "' style='" +
                    cellFont + paddingStyle + "'>" + cellValue + " <em class='cellHelp' id='" + this._globalId +
                    "' title='" + cellTitle + "'></em></td> ";
                break;
        }
        this._globalId++;
        return cellString;
    };
};

const universeArrayExtensions: UniverseArrayExtensions = new UniverseArrayExtensions();

export { universeArrayExtensions, UniverseArrayExtensions };