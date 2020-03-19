import { Response, Request } from "express";
import { floKaptureService } from "../base-repositories/flokapture-db-service";
import Mongoose from "mongoose";
import { StatementReferenceMaster, FileMaster } from "../models";
import { PartialObject } from "lodash";
import { ObjectId } from "mongodb";
import { TreeView } from "../helpers/models";
import { universeArrayExtensions } from "../helpers";

const getDocuments = function (request: Request, response: Response) {
    const filter: PartialObject<StatementReferenceMaster> = request.body;
    filter.FileId = filter.FileId instanceof ObjectId ? filter.FileId : Mongoose.Types.ObjectId(filter.FileId);
    floKaptureService.StatementReferenceMaster.getDocuments(filter).then(docs => {
        return response.status(200).json(docs).end();
    }).catch(err => {
        return response.status(500).json(err).end();
    });
};
const updateDocuments = function (request: Request, response: Response) {
    const filter: PartialObject<FileMaster> = {
        ProjectId: Mongoose.Types.ObjectId("5e70c7160e2e7b7ef06859ca"),
        FileTypeMasterId: Mongoose.Types.ObjectId("5e05db0b9d1f1a7ff45e2986"),
        Processed: true
    };
    const fieldsToUpdate: PartialObject<FileMaster> = {
        Processed: false
    };
    floKaptureService.FileMaster.updateDocuments(filter, fieldsToUpdate).then((res) => {
        response.status(200).json(res).end();
    }).catch(err => {
        response.status(500).json(err).end();
    });
};
const decisionMatrix = function (request: Request, response: Response) {
    const filter: { gte: string | ObjectId, lte: string | ObjectId, fileId: string | ObjectId, statementId: string } = request.body;
    filter.fileId = filter.fileId instanceof ObjectId ? filter.fileId : Mongoose.Types.ObjectId(filter.fileId);
    filter.gte = filter.gte instanceof ObjectId ? filter.gte : Mongoose.Types.ObjectId(filter.gte);
    filter.lte = filter.lte instanceof ObjectId ? filter.lte : Mongoose.Types.ObjectId(filter.lte);
    floKaptureService.StatementReferenceMaster.getDocuments({
        FileId: filter.fileId,
        _id: {
            $gte: filter.gte,
            $lte: filter.lte
        }
    }).then(results => {
        let lstTreeView: Array<TreeView> = [];
        const treeView: TreeView = new TreeView();
        let treeNodeId = 1;
        let parentId = "StartNode-1";
        // let lastElement: StatementReferenceMaster = results.last();
        // console.log(lastElement);
        const treeItem: TreeView = treeView.prepareTreeViewNode(parentId, "-1", treeNodeId, filter.statementId, false, results.shift());
        lstTreeView.push(treeItem);
        var lstMethodsTree = new Array<TreeView>();
        for (let statementReference of results) {
            var graphAndParentId = "Node-" + statementReference.StatementId;
            if (lstMethodsTree.length > 0) parentId = lstMethodsTree[lstMethodsTree.length - 1].GraphId;
            var treeNode = treeView.prepareTreeViewNode(graphAndParentId, parentId, treeNodeId,
                statementReference.StatementId, false, statementReference);
            if (statementReference.BaseCommandMaster && statementReference.BaseCommandMaster.BaseCommandId === 8)
                lstMethodsTree.push(treeNode);

            lstTreeView.push(treeNode);
        }
        lstTreeView.forEach(v => v.IndentLevel = 0);
        let copyOfLstTreeView: Array<TreeView> = lstTreeView;
        let finalLstTreeView: Array<TreeView> = universeArrayExtensions.ifBlockStatements(copyOfLstTreeView, lstTreeView);
        finalLstTreeView = universeArrayExtensions.loopBlockStatements(finalLstTreeView, finalLstTreeView);
        finalLstTreeView = universeArrayExtensions.elseBlockStatements(finalLstTreeView, finalLstTreeView);

        var ifBlockDictionary: [{ treeView: TreeView, decisions: Array<string> }] = [{ treeView: null, decisions: null }];
        for (const secondTab of finalLstTreeView) {
            if (!(secondTab.StatementReferenceMaster.BaseCommandMaster && secondTab.StatementReferenceMaster.BaseCommandMaster.BaseCommandId === 1)) continue;
            var lstDecisions = universeArrayExtensions.processChildItems(finalLstTreeView, secondTab);
            ifBlockDictionary.push({ treeView: secondTab, decisions: lstDecisions })
        }
        ifBlockDictionary.shift();
        finalLstTreeView.forEach(e => { e.IndentLevel = 0; });
        finalLstTreeView = universeArrayExtensions.setIndentationLevel(finalLstTreeView);
        universeArrayExtensions.prepareDecisionMatrix(finalLstTreeView, ifBlockDictionary);

        response.status(200).json(finalLstTreeView).end();
    }).catch(err => {
        response.status(500).json(err).end();
    });
};
export { getDocuments, decisionMatrix, updateDocuments };