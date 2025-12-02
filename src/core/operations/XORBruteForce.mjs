/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { bitOp, xor } from "../lib/BitwiseOp.mjs";
import { toHex } from "../lib/Hex.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * XOR Brute Force operation
 */
class XORBruteForce extends Operation {

    /**
     * XORBruteForce constructor
     */
    constructor() {
        super();

        this.name = "XOR Brute Force";
        this.module = "Default";
        this.description = "枚举所有可能的异或解。由于浏览器性能限制，当前最大密钥长度为 2。<br><br>可选地输入你预计在明文中出现的字符串用于过滤结果（辅助字符串）。";
        this.infoURL = "https://wikipedia.org/wiki/Exclusive_or";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥长度",
                "type": "number",
                "value": 1
            },
            {
                "name": "样本长度",
                "type": "number",
                "value": 100
            },
            {
                "name": "样本偏移",
                "type": "number",
                "value": 0
            },
            {
                "name": "方案",
                "type": "option",
                "value": ["Standard", "Input differential", "Output differential"]
            },
            {
                "name": "空值保持",
                "type": "boolean",
                "value": false
            },
            {
                "name": "打印密钥",
                "type": "boolean",
                "value": true
            },
            {
                "name": "十六进制输出",
                "type": "boolean",
                "value": false
            },
            {
                "name": "辅助字符串（已知明文）",
                "type": "binaryString",
                "value": ""
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        input = new Uint8Array(input);
        const [
                keyLength,
                sampleLength,
                sampleOffset,
                scheme,
                nullPreserving,
                printKey,
                outputHex,
                rawCrib
            ] = args,
            crib = rawCrib.toLowerCase(),
            output = [];
        let result,
            resultUtf8,
            record = "";

        input = input.slice(sampleOffset, sampleOffset + sampleLength);

        if (isWorkerEnvironment())
            self.sendStatusMessage("Calculating " + Math.pow(256, keyLength) + " values...");

        /**
         * Converts an integer to an array of bytes expressing that number.
         *
         * @param {number} int
         * @param {number} len - Length of the resulting array
         * @returns {array}
         */
        const intToByteArray = (int, len) => {
            const res = Array(len).fill(0);
            for (let i = len - 1; i >= 0; i--) {
                res[i] = int & 0xff;
                int = int >>> 8;
            }
            return res;
        };

        for (let key = 1, l = Math.pow(256, keyLength); key < l; key++) {
            if (key % 10000 === 0 && isWorkerEnvironment()) {
                self.sendStatusMessage("Calculating " + l + " values... " + Math.floor(key / l * 100) + "%");
            }

            result = bitOp(input, intToByteArray(key, keyLength), xor, nullPreserving, scheme);
            resultUtf8 = Utils.byteArrayToUtf8(result);
            record = "";

            if (crib && resultUtf8.toLowerCase().indexOf(crib) < 0) continue;
            if (printKey) record += "Key = " + Utils.hex(key, (2*keyLength)) + ": ";
            record += outputHex ? toHex(result) : Utils.escapeWhitespace(resultUtf8);

            output.push(record);
        }

        return output.join("\n");
    }

}

export default XORBruteForce;
