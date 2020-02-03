import BaseRepository from "./BaseRepository";
import {
    WorkspaceMasterSchema,
    ProjectMasterSchema,
    LanguageMasterSchema,
    LanguageMaster,
    BaseCommandRefSchema,
    ProcessingStepSchema,
    UserMasterSchema,
    RoleMasterSchema,
    FileMasterSchema,
    ProjectDirInfoSchema,
    UniVerseFileMenuSchema,
    UniVerseDataDictionarySchema,
    FileContentMasterSchema,
    StatementReferenceMasterSchema,
    UniVerseDescriptorSchema,
    FileTypeMasterSchema,
    BaseCommandMasterSchema,
    WorkspaceMaster,
    BaseCommandReferenceMaster,
    BaseCommandMaster,
    ProjectMaster,
    FileTypeMaster,
    StatementReferenceMaster,
    FileContentMaster,
    FileMaster,
    ProjectDirInfo,
    RoleMaster,
    UniVerseFileMenuMaster,
    UniVerseDataDictionary,
    UniVerseDescriptorMaster,
    ProjectProcessingStep,
    UserMaster
} from "../models";

import { Db, MongoClient } from "mongodb";
import Mongoose from "mongoose";

const globalAny: any = global;
const dbConnection: Mongoose.Connection = globalAny.dbConnection as Mongoose.Connection;
const mongoDatabase: Db = globalAny.mongoDbConnection as Db;
const mongoClient: MongoClient = globalAny.mongoDbClient as MongoClient;

class FloKaptureService {
    public mongoDbClient: MongoClient;
    public mongooseConnection: Mongoose.Connection; // = dbConnection;
    public mongoDatabase: Db;
    constructor() {
        this.mongoDbClient = mongoClient;
        this.mongooseConnection = dbConnection;
        this.mongoDatabase = mongoDatabase;
    }
    public LanguageMaster = new BaseRepository<LanguageMaster>({ collectionName: "LanguageMaster", schema: LanguageMasterSchema });
    public WorkspaceMaster = new BaseRepository<WorkspaceMaster>({ collectionName: "WorkspaceMaster", schema: WorkspaceMasterSchema });
    public ProjectMaster = new BaseRepository<ProjectMaster>({ collectionName: "ProjectMaster", schema: ProjectMasterSchema });
    public BaseCommandReferenceMaster = new BaseRepository<BaseCommandReferenceMaster>({ collectionName: "BaseCommandReferenceMaster", schema: BaseCommandRefSchema });
    public ProjectProcessingSteps = new BaseRepository<ProjectProcessingStep>({ collectionName: "ProjectProcessingSteps", schema: ProcessingStepSchema });
    public UserMaster = new BaseRepository<UserMaster>({ collectionName: "UserMaster", schema: UserMasterSchema });
    public RoleMaster = new BaseRepository<RoleMaster>({ collectionName: "RoleMaster", schema: RoleMasterSchema });
    public FileMaster = new BaseRepository<FileMaster>({ collectionName: "FileMaster", schema: FileMasterSchema });
    public ProjectDirInfo = new BaseRepository<ProjectDirInfo>({ collectionName: "ProjectDirInfo", schema: ProjectDirInfoSchema });
    public UniVerseFileMenuMaster = new BaseRepository<UniVerseFileMenuMaster>({ collectionName: "UniVerseFileMenuMaster", schema: UniVerseFileMenuSchema });
    public UniVerseDataDictionaryMaster = new BaseRepository<UniVerseDataDictionary>({ collectionName: "UniVerseDataDictionary", schema: UniVerseDataDictionarySchema });
    public FileContentMaster = new BaseRepository<FileContentMaster>({ collectionName: "FileContentMaster", schema: FileContentMasterSchema });
    public StatementReferenceMaster = new BaseRepository<StatementReferenceMaster>({ collectionName: "StatementReferenceMaster", schema: StatementReferenceMasterSchema });
    public UniVerseDescriptorMaster = new BaseRepository<UniVerseDescriptorMaster>({ collectionName: "UniVerseDescriptor", schema: UniVerseDescriptorSchema });
    public FileTypeMaster = new BaseRepository<FileTypeMaster>({ collectionName: "FileTypeMaster", schema: FileTypeMasterSchema });
    public BaseCommandMaster = new BaseRepository<BaseCommandMaster>({ collectionName: "BaseCommandMaster", schema: BaseCommandMasterSchema });
}

const floKaptureService: FloKaptureService = new FloKaptureService();

export {floKaptureService, FloKaptureService};  