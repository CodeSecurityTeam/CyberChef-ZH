/**
 * @author Oshawk [oshawk@protonmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Drop nth bytes operation
 */
class DropNthBytes extends Operation {

    /**
     * DropNthBytes constructor
     */
    constructor() {
        super();

        this.name = "Drop nth bytes";
        this.module = "Default";
        this.description = "从指定起始字节开始，删除每第 n 个字节。";
        this.infoURL = "";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "删除间隔",
                type: "number",
                value: 4
            },
            {
                name: "起始索引",
                type: "number",
                value: 0
            },
            {
                name: "应用到每一行",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const n = args[0];
        const start = args[1];
        const eachLine = args[2];

        if (parseInt(n, 10) !== n || n <= 0) {
            throw new OperationError("'Drop every' must be a positive integer.");
        }
        if (parseInt(start, 10) !== start || start < 0) {
            throw new OperationError("'Starting at' must be a positive or zero integer.");
        }

        let offset = 0;
        const output = [];
        for (let i = 0; i < input.length; i++) {
            if (eachLine && input[i] === 0x0a) {
                output.push(0x0a);
                offset = i + 1;
            } else if (i - offset < start || (i - (start + offset)) % n !== 0) {
                output.push(input[i]);
            }
        }

        return output;
    }

}

export default DropNthBytes;
