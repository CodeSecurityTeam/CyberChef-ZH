/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import r from "jsrsasign";
import Operation from "../Operation.mjs";

/**
 * Parse ASN.1 hex string operation
 */
class ParseASN1HexString extends Operation {

    /**
     * ParseASN1HexString constructor
     */
    constructor() {
        super();

        this.name = "Parse ASN.1 hex string";
        this.module = "PublicKey";
        this.description = "抽象语法表示（ASN.1）是一种用于描述在电信与计算机网络中表示、编码、传输和解码数据的规则与结构的标准。<br><br>此操作用于解析任意 ASN.1 数据（以十六进制字符串编码：必要时可先使用 ‘To Hex’ 操作），并呈现其树形结构。";
        this.infoURL = "https://wikipedia.org/wiki/Abstract_Syntax_Notation_One";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "起始索引",
                "type": "number",
                "value": 0
            },
            {
                "name": "截断超过此长度的八位字节串",
                "type": "number",
                "value": 32
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [index, truncateLen] = args;
        return r.ASN1HEX.dump(input.replace(/\s/g, "").toLowerCase(), {
            "ommit_long_octet": truncateLen
        }, index);
    }

}

export default ParseASN1HexString;
