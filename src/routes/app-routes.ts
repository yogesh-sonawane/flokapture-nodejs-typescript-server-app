const homeRoutes = [
    ["api/home/get-status", "home#getStatus", "get"]
];
const workspaceMasterRoutes = [
    ["api/workspace-master/get-all", "workspace-master#getAll", "get"],
    ["api/workspace-master/add-workspace", "workspace-master#addWorkspace", "post"]
];
var languageMasterRoutes = [
    ["api/language-master/get-all", "language-master#getAllLanguages", "get"],
    ["api/language-master/add-language", "language-master#addLanguage", "post"],
    ['api/language-master/find-by-id', "language-master#findById", "get"],
    ['api/language-master/delete', "language-master#deleteItem", "delete"]
];
const projectMasterRoutes = [
    ["api/project-master/add-project", "project-master#addProject", "post"],
    ["api/project-master/get-all", "project-master#getAll", "get"],
    ["api/project-master/upload-project", "project-master#uploadProject", "post"],
    ["api/project-master/get-process-steps", "project-master#getProjectProcessSteps", "get"]
];

const userMasterRoutes = [
    ["api/user-master/add-user", "user-master#createUser", "post"],
    ["api/user-master/user-login", "user-master#userLogin", "post"]
];

const roleMasterRoutes = [
    ["api/role-master/get-all", "role-master#getAll", "get"],
    ["api/role-master/add-role", "role-master#addRole", "post"]
];

const fileTypeMasterRoutes = [
    ["api/file-type-master/add-item", "file-type-master#addFileTypeMaster", "post"],
    ["api/file-type-master/get-documents", "file-type-master#getDocuments", "post"],
    ["api/file-type-master/get-all", "file-type-master#getAll", "get"],

    // Base command reference master routes...
    ["api/base-command-master/add-item", "base-command-master#addBaseCommandMaster", "post"],
    ["api/base-command-master/get-documents", "base-command-master#getBaseCommandMaster", "get"],

    // File content master routes...
    ["api/file-content-master/get-doc", "file-content-master#getDoc", "get"]
];

const projectProcessingRoutes = [
    ["api/process-universe-project/start-process", "process-universe-project#startProcessing", "post"]
];

const fileMasterRoutes = [
    ["api/file-master/get-all", "file-master#getAll", "get"],
    ["api/file-master/get-documents", "file-master#getDocuments", "post"]
];

var appRoutes: any[] = Array.prototype.concat(
    homeRoutes,
    workspaceMasterRoutes,
    languageMasterRoutes,
    projectMasterRoutes,
    userMasterRoutes,
    roleMasterRoutes,
    fileTypeMasterRoutes,
    projectProcessingRoutes,
    fileMasterRoutes
);

module.exports = appRoutes;