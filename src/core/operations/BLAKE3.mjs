/**
 * @author xumptex [xumptex@outlook.fr]
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { blake3 } from "hash-wasm";
/**
 * BLAKE3 operation
 */
class BLAKE3 extends Operation {

    /**
     * BLAKE3 constructor
     */
    constructor() {
        super();

        this.name = "BLAKE3";
        this.module = "Hashing";
        this.description = "使用 BLAKE3（UTF-8 编码）对输入进行哈希，支持可选密钥（同为 UTF-8），以十六进制格式输出结果。";
        this.infoURL = "https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE3";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "大小（字节）",
                "type": "number"
            }, {
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
        const key = args[1];
        const size = args[0];
        // Check if the user want a key hash or not
        if (key === "") {
            return blake3(input, size*8);
        } if (key.length !== 32) {
            throw new OperationError("The key must be exactly 32 bytes long");
        }
        return blake3(input, size*8, key);
    }

}

export default BLAKE3;
