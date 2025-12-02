/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import NodeMD6 from "node-md6";

/**
 * MD6 operation
 */
class MD6 extends Operation {

    /**
     * MD6 constructor
     */
    constructor() {
        super();

        this.name = "MD6";
        this.module = "Crypto";
        this.description = "MD6（消息摘要 6）是一种加密哈希函数。它采用类似 Merkle 树的结构，支持对超长输入进行高度并行的哈希计算。";
        this.infoURL = "https://wikipedia.org/wiki/MD6";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "大小",
                "type": "number",
                "value": 256
            },
            {
                "name": "层数",
                "type": "number",
                "value": 64
            },
            {
                "name": "密钥",
                "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [size, levels, key] = args;

        if (size < 0 || size > 512)
            throw new OperationError("Size must be between 0 and 512");
        if (levels < 0)
            throw new OperationError("Levels must be greater than 0");

        return NodeMD6.getHashOfText(input, size, key, levels);
    }

}

export default MD6;
