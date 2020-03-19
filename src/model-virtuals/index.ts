const languageMasterVirtuals = {
    path: "LanguageMaster",
    value: {
        from: "LanguageMaster",
        localField: "LanguageId",
        foreignField: "_id",
        as: "LanguageMaster",
        ref: "LanguageMaster",
        autopopulate: true,
        justOne: true
    },
    unWind: true,
    fields: ["LanguageId", "LanguageName"]
};

const fileTypeMasterVirtuals = {
    path: "FileTypeMaster",
    value: {
        from: "FileTypeMaster",
        localField: "FileTypeMasterId",
        foreignField: "_id",
        as: "FileTypeMaster",
        ref: "FileTypeMaster",
        autopopulate: true,
        justOne: true
    },
    // fields: [""],
    unWind: true
};

const workspaceMasterVirtuals = {
    path: "WorkspaceMaster",
    value: {
        from: "WorkspaceMaster",
        localField: "WorkspaceId",
        foreignField: "_id",
        as: "WorkspaceMaster", 
        ref: "WorkspaceMaster",
        autopopulate: true,
        justOne: true
    },
    unWind: true,
    fields: { _id: 1, WorkspaceName: 1, WorkspaceDescription: 1 }
};

const projectMasterVirtuals = {
    path: "ProjectMaster",
    value: {
        from: "ProjectMaster",
        localField: "ProjectId",
        foreignField: "_id",
        as: "ProjectMaster",
        ref: "ProjectMaster",
        autopopulate: true,
        justOne: true
    },
    // fields: [""],
    unWind: true
};

const fileMasterVirtuals = {
    path: "FileMaster",
    value: {
        from: "FileMaster",
        localField: "FileId",
        foreignField: "_id",
        as: "FileMaster", 
        ref: "FileMaster",
        autopopulate: true,
        justOne: true
    },
    // fields: [""],
    unWind: true,
    fields: ["_id", "FileId", "ProjectId", "FileTypeMasterId", "FileName", "FileNameWithoutExt", "WorkFlowStatus", "ProjectMaster", "FileTypeExtensionMaster"]
};

const referenceFileMasterVirtuals = {
    path: "FileMaster",
    value: {
        from: "FileMaster",
        localField: "ReferenceFileId",
        foreignField: "_id",
        as: "ReferenceFileMaster",
        ref: "FileMaster",
        autopopulate: true,
        justOne: true
    },    
    unWind: true,
    fields: ["_id", "FileId", "FileName", "FileNameWithoutExt", "WorkFlowStatus", "ProjectMaster", "FileTypeExtensionMaster"]
};


const baseCommandMasterVirtuals = {
    path: "BaseCommandMaster",
    value: {
        from: "BaseCommandMaster",
        localField: "BaseCommandId",
        foreignField: "_id",
        as: "BaseCommandMaster",
        ref: "BaseCommandMaster",
        autopopulate: true,
        justOne: true
    },
    unWind: true,
};

export {
    languageMasterVirtuals,
    workspaceMasterVirtuals,
    projectMasterVirtuals,
    fileTypeMasterVirtuals,
    fileMasterVirtuals,
    baseCommandMasterVirtuals,
    referenceFileMasterVirtuals
};