import * as fs from 'fs';
import * as path from 'path';
import * as avro from 'avsc';
import * as parser from 'xml2json';
import { ICommandOptions } from './cli';

export class Parser {
  constructor(option: ICommandOptions) {
    const json = this.loadFile(option.file);
    if (option.schema) {
      const schema = avro.Type.forSchema(this.loadFile(option.schema));
      this.validateJSON(json, schema);
    } else {
      const schemaFile = option.output || option.file.replace(path.extname(option.file), '.avsc');
      this.inferSchema(json, schemaFile);
    }
  }

  private validateJSON(json: { [key: string]: any }, schema: avro.Type) {
    // For color codes, see here: https://stackoverflow.com/a/41407246/319711
    const errorHook = (path: string[], part: any) =>
      console.error('\x1b[1;31m%s\x1b[0m', `Validation error: path ${path.join(', ')}, part ${JSON.stringify(part, null, 2)}`);
    const isValid = schema.isValid(json, { errorHook });
    if (isValid) {
      console.info('The message is valid.');
    }
  }

  private inferSchema(json: { [key: string]: any }, schemaFile: string) {
    const type = avro.Type.forValue(json);
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
    return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filename), 'utf8'));
  }

  private loadXML(filename: string) {
    return parser.toJson(fs.readFileSync(path.resolve(process.cwd(), filename), 'utf8'), {
      object: true,
      coerce: true
    });
  }
}
