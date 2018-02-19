"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var avro = require("avsc");
var parser = require("xml2json");
var Parser = (function () {
    function Parser(option) {
        var json = this.loadFile(option.file);
        if (option.schema) {
            var schema = avro.Type.forSchema(this.loadFile(option.schema));
            this.validateJSON(json, schema);
        }
        else {
            var schemaFile = option.file.replace(path.extname(option.file), '.avsc');
            this.inferSchema(json, schemaFile);
        }
    }
    Parser.prototype.validateJSON = function (json, schema) {
        var errorHook = function (path, part) {
            return console.error('\x1b[1;31m%s\x1b[0m', "Validation error: path " + path.join(', ') + ", part " + JSON.stringify(part, null, 2));
        };
        var isValid = schema.isValid(json, { errorHook: errorHook });
        if (isValid) {
            console.info('The message is valid.');
        }
    };
    Parser.prototype.inferSchema = function (json, schemaFile) {
        var type = avro.Type.forValue(json);
        schemaFile = path.resolve(process.cwd(), schemaFile);
        fs.writeFileSync(schemaFile, JSON.stringify(type.schema(), null, 2));
        console.info("Schema file written to " + schemaFile + ".");
    };
    Parser.prototype.loadFile = function (filename) {
        var ext = path.extname(filename).toLowerCase();
        switch (ext) {
            case '.json':
            case '.geojson':
            case '.avsc':
                return this.loadJSON(filename);
            case '.xml':
                return this.loadXML(filename);
            default:
                console.error("Unknown file type: " + ext + ".");
        }
    };
    Parser.prototype.loadJSON = function (filename) {
        return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filename), 'utf8'));
    };
    Parser.prototype.loadXML = function (filename) {
        return parser.toJson(fs.readFileSync(path.resolve(process.cwd(), filename), 'utf8'), {
            object: true,
            coerce: true
        });
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map