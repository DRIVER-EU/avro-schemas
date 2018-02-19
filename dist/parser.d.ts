import { ICommandOptions } from './cli';
export declare class Parser {
    constructor(option: ICommandOptions);
    private validateJSON(json, schema);
    private inferSchema(json, schemaFile);
    private loadFile(filename);
    private loadJSON(filename);
    private loadXML(filename);
}
