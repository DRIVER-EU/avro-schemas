import * as fs from 'fs';
import * as path from 'path';
import { Type, Schema } from 'avsc';
import * as parser from 'xml2json';
import { ICommandOptions } from './cli';

export class Parser {
  private json: { [key: string]: any };
  private schemaType: Type;
  private schemaFile: string;

  constructor(private option: ICommandOptions) {
    this.json = this.loadFile(option.file);
    if (option.schema) {
      this.schemaType = Type.forSchema(this.loadJSON(option.schema), {
        wrapUnions: option.wrapped ? true : 'auto'
      });
    } else {
      this.schemaFile =
        option.output ||
        option.file.replace(path.extname(option.file), '.avsc');
    }
  }

  public run() {
    if (this.schemaType) {
      const isValid = this.validateJSON(this.json, this.schemaType);
      console.log(`The message is ${isValid ? '' : 'in'}valid.`);
    } else {
      this.inferSchema(this.json, this.schemaFile);
    }
  }

  public validateJSON(json = this.json, schemaType = this.schemaType, optErrorHook?: (path: string[], part: any) => void) {
    // For color codes, see here: https://stackoverflow.com/a/41407246/319711
    const errorHook = optErrorHook ? optErrorHook : (path: string[], part: any) =>
      console.error(
        '\x1b[1;31m%s\x1b[0m',
        `Validation error: path ${path.join(', ')}, part ${JSON.stringify(
          part,
          null,
          2
        )}`
      );
    const isValid = schemaType.isValid(json, { errorHook });
    if (!isValid && typeof this.option.wrapped === 'undefined') {
      console.info('The message is invalid when using \'auto\' wrap mode. Retrying using wrapped mode (-w option).');
      const newParser = new Parser(Object.assign(this.option, { wrapped: true }));
      return newParser.validateJSON();
    }
    return isValid;
  }

  private inferSchema(json: { [key: string]: any }, schemaFile: string) {
    const type = Type.forValue(json);
    schemaFile = path.resolve(process.cwd(), schemaFile);
    fs.writeFileSync(schemaFile, JSON.stringify(type.schema(), null, 2));
    console.info(`Schema file written to ${schemaFile}.`);
  }

  private loadFile(filename: string) {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.json':
      case '.geojson':
      case '.avsc':
        return this.loadJSON(filename);
      case '.xml':
        return this.loadXML(filename);
      default:
        console.error(`Unknown file type: ${ext}.`);
    }
  }

  private loadJSON(filename: string) {
    return JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), filename), 'utf8')
    );
  }

  private loadXML(filename: string) {
    return parser.toJson(
      fs.readFileSync(path.resolve(process.cwd(), filename), 'utf8'),
      {
        object: true,
        coerce: true
      }
    );
  }
}
