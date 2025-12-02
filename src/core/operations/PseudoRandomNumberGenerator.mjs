/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";
import BigNumber from "bignumber.js";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Pseudo-Random Number Generator operation
 */
class PseudoRandomNumberGenerator extends Operation {

    /**
     * PseudoRandomNumberGenerator constructor
     */
    constructor() {
        super();

        this.name = "Pseudo-Random Number Generator";
        this.module = "Ciphers";
        this.description = "加密安全的伪随机数生成器（PRNG）。<br><br>此操作在可用时使用浏览器内置的 <code>crypto.getRandomValues()</code> 方法；若不可用，则回退到基于 Fortuna 的 PRNG 算法。";
        this.infoURL = "https://wikipedia.org/wiki/Pseudorandom_number_generator";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "字节数",
                "type": "number",
                "value": 32
            },
            {
                "name": "输出格式",
                "type": "option",
                "value": ["Hex", "Integer", "Byte array", "Raw"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [numBytes, outputAs] = args;

        let bytes;

        if (isWorkerEnvironment() && self.crypto) {
            bytes = new ArrayBuffer(numBytes);
            const CHUNK_SIZE = 65536;
            for (let i = 0; i < numBytes; i += CHUNK_SIZE) {
                self.crypto.getRandomValues(new Uint8Array(bytes, i, Math.min(numBytes - i, CHUNK_SIZE)));
            }
            bytes = Utils.arrayBufferToStr(bytes);
        } else {
            bytes = forge.random.getBytesSync(numBytes);
        }

        let value = new BigNumber(0),
            i;

        switch (outputAs) {
            case "Hex":
                return forge.util.bytesToHex(bytes);
            case "Integer":
                for (i = bytes.length - 1; i >= 0; i--) {
                    value = value.times(256).plus(bytes.charCodeAt(i));
                }
                return value.toFixed();
            case "Byte array":
                return JSON.stringify(Utils.strToCharcode(bytes));
            case "Raw":
            default:
                return bytes;
        }
    }

}

export default PseudoRandomNumberGenerator;
