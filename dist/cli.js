"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commandLineArgs = require("command-line-args");
var npmPackage = require("../package.json");
var parser_1 = require("./parser");
var CommandLineInterface = (function () {
    function CommandLineInterface() {
    }
    CommandLineInterface.optionDefinitions = [{
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
            description: 'JSON file that needs to be validated against a schema, or for which we want to infer a schema.\'s'
        }, {
            name: 'schema',
            alias: 's',
            type: String,
            typeLabel: '[underline]{String}',
            description: 'The schema file which is used to validate the JSON file.\'s.'
        }];
    CommandLineInterface.sections = [
        {
            header: npmPackage.name + ", v" + npmPackage.version,
            content: npmPackage.license + " license.\n\n    " + npmPackage.description + "\n\n    Use the avro-schemas tool to infer an AVRO schema based on JSON or XML input, or\n    validate a JSON message against a schema.\n    "
        },
        {
            header: 'Options',
            optionList: CommandLineInterface.optionDefinitions
        },
        {
            header: 'Examples',
            content: [{
                    desc: '01. Infer a cap.avsc from the cap.json file.',
                    example: '$ avro-schema-validator cap.json'
                }, {
                    desc: '02. Validate a cap.json against the cap.avsc schema.',
                    example: '$ avro-schema-validator cap.json -s cap.avsc'
                }]
        }
    ];
    return CommandLineInterface;
}());
exports.CommandLineInterface = CommandLineInterface;
var options = commandLineArgs(CommandLineInterface.optionDefinitions);
if (options.help || !options.file) {
    var getUsage = require('command-line-usage');
    var usage = getUsage(CommandLineInterface.sections);
    console.log(usage);
    process.exit(0);
}
else {
    var schemaParser = new parser_1.Parser(options);
}
//# sourceMappingURL=cli.js.map