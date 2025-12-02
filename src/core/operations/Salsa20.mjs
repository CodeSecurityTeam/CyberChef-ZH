/**
 * @author joostrijneveld [joost@joostrijneveld.nl]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toHex } from "../lib/Hex.mjs";
import { salsa20Block } from "../lib/Salsa20.mjs";

/**
 * Salsa20 operation
 */
class Salsa20 extends Operation {

    /**
     * Salsa20 constructor
     */
    constructor() {
        super();

        this.name = "Salsa20";
        this.module = "Ciphers";
        this.description = "Salsa20 是由 Daniel J. Bernstein 设计并提交给 eSTREAM 项目的流密码；Salsa20/8 与 Salsa20/12 是减轮变体。它与 ChaCha 流密码关系密切。<br><br><b>密钥：</b>Salsa20 使用 16 或 32 字节的密钥（128 或 256 位）。<br><br><b>随机数（Nonce）：</b>Salsa20 使用 8 字节随机数（64 位）。<br><br><b>计数器：</b>Salsa20 使用 8 字节计数器（64 位），密钥流开始时计数器从 0 开始，每处理 64 字节递增一次。";
        this.infoURL = "https://wikipedia.org/wiki/Salsa20";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "随机数（Nonce）",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64", "Integer"]
            },
            {
                "name": "计数器",
                "type": "number",
                "value": 0,
                "min": 0
            },
            {
                "name": "轮数",
                "type": "option",
                "value": ["20", "12", "8"]
            },
            {
                "name": "输入",
                "type": "option",
                "value": ["Hex", "Raw"]
            },
            {
                "name": "输出",
                "type": "option",
                "value": ["Raw", "Hex"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string, args[0].option),
            nonceType = args[1].option,
            rounds = parseInt(args[3], 10),
            inputType = args[4],
            outputType = args[5];

        if (key.length !== 16 && key.length !== 32) {
            throw new OperationError(`Invalid key length: ${key.length} bytes.

Salsa20 uses a key of 16 or 32 bytes (128 or 256 bits).`);
        }

        let counter, nonce;
        if (nonceType === "Integer") {
            nonce = Utils.intToByteArray(parseInt(args[1].string, 10), 8, "little");
        } else {
            nonce = Utils.convertToByteArray(args[1].string, args[1].option);
            if (!(nonce.length === 8)) {
                throw new OperationError(`Invalid nonce length: ${nonce.length} bytes.

Salsa20 uses a nonce of 8 bytes (64 bits).`);
            }
        }
        counter = Utils.intToByteArray(args[2], 8, "little");

        const output = [];
        input = Utils.convertToByteArray(input, inputType);

        let counterAsInt = Utils.byteArrayToInt(counter, "little");
        for (let i = 0; i < input.length; i += 64) {
            counter = Utils.intToByteArray(counterAsInt, 8, "little");
            const stream = salsa20Block(key, nonce, counter, rounds);
            for (let j = 0; j < 64 && i + j < input.length; j++) {
                output.push(input[i + j] ^ stream[j]);
            }
            counterAsInt++;
        }

        if (outputType === "Hex") {
            return toHex(output);
        } else {
            return Utils.arrayBufferToStr(Uint8Array.from(output).buffer);
        }
    }

    /**
     * Highlight Salsa20
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        const inputType = args[4],
            outputType = args[5];
        if (inputType === "Raw" && outputType === "Raw") {
            return pos;
        }
    }

    /**
     * Highlight Salsa20 in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        const inputType = args[4],
            outputType = args[5];
        if (inputType === "Raw" && outputType === "Raw") {
            return pos;
        }
    }

}

export default Salsa20;
