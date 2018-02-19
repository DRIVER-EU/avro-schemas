import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import * as npmPackage from '../package.json';
import { Parser } from './parser';

export interface ICommandOptions {
  schema: string;
  output: string;
  file: string;
  help: boolean;
}

export class CommandLineInterface {
  static optionDefinitions: OptionDefinition[] = [{
    name: 'help',
    alias: 'h',
    type: Boolean,
    typeLabel: '[underline]{Boolean}',
    description: 'Show help text'
  }, {
    name: 'file',
    alias: 'f',
    type: String,
    defaultOption: true,
    typeLabel: '[underline]{String}',
    description: 'JSON or XML file that must be validated against a schema, or for which we want to infer a schema.'
  }, {
    name: 'schema',
    alias: 's',
    type: String,
    typeLabel: '[underline]{String}',
    description: 'The schema file which is used to validate the JSON or XML file.'
  }, {
    name: 'output',
    alias: 'o',
    type: String,
    typeLabel: '[underline]{String}',
    description: 'Override the default schema file name.'
  }];

  static sections = [
    {
      header: `${npmPackage.name}, v${npmPackage.version}`,
      content: `${npmPackage.license} license.

    ${npmPackage.description}

    Use the avro-schemas tool to infer an AVRO schema based on JSON or XML input,
    or validate a JSON message against a schema.
    `
    },
    {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions
    },
    {
      header: 'Examples',
      content: [{
        desc: '01. Infer a cap.avsc schema from the cap.json file.',
        example: '$ avro-schema-validator cap.json'
      }, {
        desc: '02. Infer a schema, and specify the output file.',
        example: '$ avro-schema-validator cap.json -o mySchema.avsc'
      }, {
        desc: '03. Validate a cap.json against the cap.avsc schema.',
        example: '$ avro-schema-validator cap.json -s cap.avsc'
      }]
    }
  ];
}

const options: ICommandOptions = commandLineArgs(
  CommandLineInterface.optionDefinitions
);

if (options.help || !options.file) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(0);
} else {
  const schemaParser = new Parser(options);
}
