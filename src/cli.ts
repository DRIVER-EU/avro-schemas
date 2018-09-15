import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import * as npmPackage from '../package.json';
import * as getUsage from 'command-line-usage';
import { Parser } from './parser';


export interface ICommandOptions {
  /** Relative path to the schema file */
  schema: string;
  /** Optional output file */
  output?: string;
  /** Relative path to the JSON input file */
  file: string;
  /** If set, always use wrapped union types. */
  wrapped?: boolean;
  /** If true, show the help text */
  help?: boolean;
}

export interface IOptionDefinition extends OptionDefinition {
  description: string;
}

export class CommandLineInterface {
  static optionDefinitions: IOptionDefinition[] = [
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      description: 'Show help text'
    },
    {
      name: 'file',
      alias: 'f',
      type: String,
      defaultOption: true,
      description:
        'JSON or XML file that must be validated against a schema, or for which we want to infer a schema.'
    },
    {
      name: 'schema',
      alias: 's',
      type: String,
      description:
        'The schema file which is used to validate the JSON or XML file.'
    },
    {
      name: 'output',
      alias: 'o',
      type: String,
      description: 'Override the default schema file name.'
    },
    {
      name: 'wrapped',
      alias: 'w',
      type: Boolean,
      description: 'If set, use wrapped union types.'
    }
  ];

  static sections = [
    {
      header: `${npmPackage.name}, v${npmPackage.version}`,
      content: `${npmPackage.license} license.

    ${npmPackage.description}

    Use avro-schema-validator to infer an AVRO schema based on JSON or XML input,
    or validate a JSON message against a schema.

    In some cases, a valid JSON message may be considered invalid when wrapped
    unions are used, e.g. when you have a property 'content', whose type is
    ['int', 'float'], in JSON you would need to wrap its value in order to
    distinguish between an integer and a float. In case normal parsing fails, 
    it retries the validation using the -w option (wrapped).
    `
    },
    {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions
    },
    {
      header: 'Examples',
      content: [
        {
          desc: '01. Infer a cap.avsc schema from the cap.json file.',
          example: '$ avro-schema-validator cap.json'
        },
        {
          desc: '02. Infer a schema, and specify the output file.',
          example: '$ avro-schema-validator cap.json -o mySchema.avsc'
        },
        {
          desc: '03. Validate a cap.json against the cap.avsc schema.',
          example: '$ avro-schema-validator cap.json -s cap.avsc'
        },
        {
          desc: '04. Validate a wrapped cap.json against the cap.avsc schema.',
          example: '$ avro-schema-validator -w cap.json -s cap.avsc'
        }
      ]
    }
  ];
}

const options = commandLineArgs(
  CommandLineInterface.optionDefinitions
) as ICommandOptions;

if (options.help || !options.file) {
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(0);
} else {
  const parser = new Parser(options);
  parser.run();
}
