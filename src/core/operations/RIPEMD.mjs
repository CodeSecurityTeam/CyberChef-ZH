/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * RIPEMD operation
 */
class RIPEMD extends Operation {

    /**
     * RIPEMD constructor
     */
    constructor() {
        super();

        this.name = "RIPEMD";
        this.module = "Crypto";
        this.description = "RIPEMD（RACE完整性原语评估消息摘要）是一系列加密哈希函数，由比利时鲁汶天主教大学COSIC研究小组的Hans Dobbertin、Antoon Bosselaers和Bart Preneel开发，并于1996年首次发表。<br><br>RIPEMD基于MD4的设计原则，其性能与更流行的SHA-1类似";
        this.infoURL = "https://wikipedia.org/wiki/RIPEMD";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "Size",
                "type": "option",
                "value": ["320", "256", "160", "128"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const size = args[0];
        return runHash("ripemd" + size, input);
    }

}

export default RIPEMD;
