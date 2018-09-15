// See also https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from './parser';
import { expect } from 'chai';
import 'mocha';
import { Type, Schema } from 'avsc';

const readAsJson = (file: string) => JSON.parse(fs.readFileSync(path.resolve(__dirname, file), 'utf8'));

describe('Parser', () => {
  it('should validate example schema', () => {
    const petType = Type.forSchema({
      type: 'record',
      fields: [
        { name: 'kind', type: { type: 'enum', symbols: ['CAT', 'DOG'] } },
        { name: 'name', type: 'string' },
        { name: 'age', type: 'int' }
      ]
    } as Schema);
    const invalid = petType.isValid({ kind: 'PIG', name: 'Babe', age: 2 });
    expect(invalid).to.equal(false, 'PIG is not a valid kind');
    const valid = petType.isValid({ kind: 'DOG', name: 'Lassy', age: 5 });
    expect(valid).to.equal(true, 'DOG is a valid kind');
  });

  it('should validate wrapped cap message', () => {
    const capSchema = readAsJson('../standard/cap/standard_cap-value.avsc');
    const capMessage = readAsJson('../test/messages/standard_cap.json');
    const capType = Type.forSchema(capSchema, { wrapUnions: true });
    const valid = capType.isValid(capMessage);
    expect(valid).to.equal(true, 'Wrapped CAP message should be valid.');
  });

  it('should validate wrapped cap message using parser', () => {
    const parser = new Parser({
      schema: './standard/cap/standard_cap-value.avsc',
      file: './test/messages/standard_cap.json',
      wrapped: true,
    });
    const result = parser.validateJSON();
    expect(result).to.equal(true, 'Wrapped CAP message should be valid using parser.');
  });

  it('should validate wrapped cap message using parser, even when -w is not set', () => {
    const parser = new Parser({
      schema: './standard/cap/standard_cap-value.avsc',
      file: './test/messages/standard_cap.json',
    });
    const result = parser.validateJSON(undefined, undefined, (path: string[], part: any) => null);
    expect(result).to.equal(true, 'Wrapped CAP message should be valid using parser.');
  });

  it('should validate unwrapped cap message', () => {
    const capSchema = readAsJson('../standard/cap/standard_cap-value.avsc');
    const capMessage = readAsJson('../test/messages/unwrapped_cap.json');
    const capType = Type.forSchema(capSchema, { wrapUnions: 'auto' });
    const valid = capType.isValid(capMessage);
    expect(valid).to.equal(true, 'Unwrapped CAP message should be valid.');
  });

  it('should validate unwrapped cap message using parser', () => {
    const parser = new Parser({
      schema: './standard/cap/standard_cap-value.avsc',
      file: './test/messages/unwrapped_cap.json',
    });
    const result = parser.validateJSON();
    expect(result).to.equal(true, 'Unwrapped CAP message should be valid using parser.');
  });
});
