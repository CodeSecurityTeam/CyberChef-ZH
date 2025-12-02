/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {INPUT_DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * Tail operation
 */
class Tail extends Operation {

    /**
     * Tail constructor
     */
    constructor() {
        super();

        this.name = "Tail";
        this.module = "Default";
        this.description = "类似 UNIX 的 tail 工具。<br>获取最后 n 行。<br>可选地通过为 n 输入负值来选择第 n 行之后的所有行。<br>可更改分隔符以按字段（如逗号）而不是按行进行选择。";
        this.infoURL = "https://wikipedia.org/wiki/Tail_(Unix)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "分隔符",
                "type": "option",
                "value": INPUT_DELIM_OPTIONS
            },
            {
                "name": "数量",
                "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let delimiter = args[0];
        const number = args[1];

        delimiter = Utils.charRep(delimiter);
        const splitInput = input.split(delimiter);

        return splitInput
            .filter((line, lineIndex) => {
                lineIndex += 1;

                if (number < 0) {
                    return lineIndex > -number;
                } else {
                    return lineIndex > splitInput.length - number;
                }
            })
            .join(delimiter);

    }

}

export default Tail;
