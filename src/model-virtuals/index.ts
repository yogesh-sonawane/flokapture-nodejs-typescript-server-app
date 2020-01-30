const languageMasterVirtuals = {
    path: "LanguageMaster",
    value: {
        from: "LanguageMaster",
        localField: "LanguageId",
        foreignField: "_id",
        as: "LanguageMaster"
    },
    fields: ["LanguageId", "LanguageName"]
};

const fileTypeMasterVirtuals = {
    path: "FileTypeMaster",
    value: {
        from: "FileTypeMaster",
        localField: "FileTypeMasterId",
        foreignField: "_id",
        as: "FileTypeMaster"
    }
};

const workspaceMasterVirtuals = {
    path: "WorkspaceMaster",
    value: {
        from: "WorkspaceMaster",
        localField: "WorkspaceId",
        foreignField: "_id",
        as: "WorkspaceMaster"
    },
    fields: { _id: 1, WorkspaceName: 1, WorkspaceDescription: 1 }
};

const projectMasterVirtuals = {
    path: "ProjectMaster",
    value: {
        from: "ProjectMaster",
        localField: "ProjectId",
        foreignField: "_id",
        as: "ProjectMaster"
    }
};

const fileMasterVirtuals = {
    path: "FileMaster",
    value: {
        from: "FileMaster",
        localField: "FileId",
        foreignField: "_id",
        as: "FileMaster"
    },
    fields: ["_id", "FileId", "FileName", "FileNameWithoutExt", "WorkFlowStatus", "ProjectMaster", "FileTypeExtensionMaster"]
};

const baseCommandMasterVirtuals = {
    path: "BaseCommandMaster",
    value: {
        from: "BaseCommandMaster",
        localField: "BaseCommandId",
        foreignField: "_id",
        as: "BaseCommandMaster"
    }
};

export {
    languageMasterVirtuals,
    workspaceMasterVirtuals,
    projectMasterVirtuals,
    fileTypeMasterVirtuals,    
    fileMasterVirtuals,
    baseCommandMasterVirtuals
};