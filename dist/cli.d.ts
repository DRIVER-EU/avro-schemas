/// <reference types="command-line-args" />
import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
export interface ICommandOptions {
    schema: string;
    file: string;
    help: boolean;
}
export declare class CommandLineInterface {
    static optionDefinitions: OptionDefinition[];
    static sections: ({
        header: string;
        content: string;
        optionList?: undefined;
    } | {
        header: string;
        optionList: commandLineArgs.OptionDefinition[];
        content?: undefined;
    } | {
        header: string;
        content: {
            desc: string;
            example: string;
        }[];
        optionList?: undefined;
    })[];
}
