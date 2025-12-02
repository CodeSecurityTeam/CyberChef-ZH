/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {SPLIT_DELIM_OPTIONS, JOIN_DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * Split operation
 */
class Split extends Operation {

    /**
     * Split constructor
     */
    constructor() {
        super();

        this.name = "Split";
        this.module = "Default";
        this.description = "按给定分隔符将字符串拆分为多个部分。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "拆分分隔符",
                "type": "editableOptionShort",
                "value": SPLIT_DELIM_OPTIONS
            },
            {
                "name": "连接分隔符",
                "type": "editableOptionShort",
                "value": JOIN_DELIM_OPTIONS
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const splitDelim = args[0],
            joinDelim = args[1],
            sections = input.split(splitDelim);

        return sections.join(joinDelim);
    }

}

export default Split;
