/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { bitOp, xor, BITWISE_OP_DELIMS } from "../lib/BitwiseOp.mjs";

/**
 * XOR operation
 */
class XOR extends Operation {

    /**
     * XOR constructor
     */
    constructor() {
        super();

        this.name = "XOR";
        this.module = "Default";
        this.description = "用给定的密钥对输入进行异或。<br>例如：<code>fe023da5</code><br><br><strong>选项</strong><br><u>空值保持：</u>若当前字节为 0x00 或与密钥相同，则跳过。<br><br><u>方案：</u><ul><li>Standard - 每轮后密钥不变</li><li>Input differential - 密钥设为上一个未处理字节的值</li><li>Output differential - 密钥设为上一个已处理字节的值</li><li>Cascade - 密钥设为输入字节移位一位</li></ul>";
        this.infoURL = "https://wikipedia.org/wiki/XOR";
        this.inputType = "ArrayBuffer";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": BITWISE_OP_DELIMS
            },
            {
                "name": "方案",
                "type": "option",
                "value": ["Standard", "Input differential", "Output differential", "Cascade"]
            },
            {
                "name": "空值保持",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        input = new Uint8Array(input);
        const key = Utils.convertToByteArray(args[0].string || "", args[0].option),
            [, scheme, nullPreserving] = args;

        return bitOp(input, key, xor, nullPreserving, scheme);
    }

    /**
     * Highlight XOR
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight XOR in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default XOR;
