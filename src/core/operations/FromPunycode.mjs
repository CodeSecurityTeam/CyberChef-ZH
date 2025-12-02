/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import punycode from "punycode";

/**
 * From Punycode operation
 */
class FromPunycode extends Operation {

    /**
     * FromPunycode constructor
     */
    constructor() {
        super();

        this.name = "From Punycode";
        this.module = "Encodings";
        this.description = "Punycode 是在域名系统（DNS）支持的 ASCII 有限字符集内表示 Unicode 的方法。<br><br>例如：<code>mnchen-3ya</code> 解码为 <code>m\\xfcnchen</code>";
        this.infoURL = "https://wikipedia.org/wiki/Punycode";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "国际化域名",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const idn = args[0];

        if (idn) {
            return punycode.toUnicode(input);
        } else {
            return punycode.decode(input);
        }
    }

}

export default FromPunycode;
