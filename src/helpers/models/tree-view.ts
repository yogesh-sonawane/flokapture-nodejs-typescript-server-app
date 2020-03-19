import { StatementReferenceMaster } from "../../models";
import { ObjectId } from "mongodb";

export default class TreeView {
    public NodeId: number;
    public HasChild: boolean;
    public GraphId: string;
    public GraphName: string;
    public ParentId: string;
    public SpriteCssClass: string;
    public BaseCommandId: number;
    public PrimaryCommandId: number;
    public ClassCalled: string;
    public MethodCalled: string;
    public ActualStatementId: string;
    public StatementReferenceMaster: StatementReferenceMaster;
    public ActionWorkflowId: number;
    public GroupName: string;
    public GroupId: number;
    public ProgramId: number;
    public Done: boolean;
    public AlternateName: string;
    public BusinessName: string;
    public AnnotateStatement: string;
    public GlobalParentId: string;
    public StatementId: string;
    public IndentLevel: number;

    public prepareTreeViewNode = function (graphId: string, parentId: string, treeNodeId: number, statementId: string | ObjectId, pseudoCode: boolean, statementReference: StatementReferenceMaster) {
        var gName = pseudoCode
            ? typeof statementReference.AlternateName !== "undefined"
                ? statementReference.AlternateName : statementReference.OriginalStatement : statementReference.OriginalStatement;
        var treeItem: TreeView = {
            GraphId: graphId,
            GraphName: gName,
            HasChild: true,
            ParentId: parentId,
            BaseCommandId: statementReference.BaseCommandId,
            StatementReferenceMaster: statementReference,
            ActualStatementId: "Actual-" + statementReference.StatementId.toString(),
            NodeId: ++treeNodeId,
            AlternateName: statementReference.AlternateName,
            GroupName: statementReference.BusinessName,
            BusinessName: statementReference.BusinessName,
            SpriteCssClass: ""
        } as unknown as TreeView;
        return treeItem;
    };
}