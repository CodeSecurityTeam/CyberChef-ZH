/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { format } from "../lib/Ciphers.mjs";
import CryptoJS from "crypto-js";

/**
 * RC4 Drop operation
 */
class RC4Drop extends Operation {

    /**
     * RC4Drop constructor
     */
    constructor() {
        super();

        this.name = "RC4 Drop";
        this.module = "Ciphers";
        this.description = "已发现 RC4 密钥流的前若干字节具有强烈的非随机性并泄露密钥信息。可通过丢弃密钥流的初始部分来防御该攻击，此改进算法通常称为 RC4-drop。";
        this.infoURL = "https://wikipedia.org/wiki/RC4#Fluhrer,_Mantin_and_Shamir_attack";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "口令",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["UTF8", "UTF16", "UTF16LE", "UTF16BE", "Latin1", "Hex", "Base64"]
            },
            {
                "name": "输入格式",
                "type": "option",
                "value": ["Latin1", "UTF8", "UTF16", "UTF16LE", "UTF16BE", "Hex", "Base64"]
            },
            {
                "name": "输出格式",
                "type": "option",
                "value": ["Latin1", "UTF8", "UTF16", "UTF16LE", "UTF16BE", "Hex", "Base64"]
            },
            {
                "name": "丢弃的双字数量",
                "type": "number",
                "value": 192
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const message = format[args[1]].parse(input),
            passphrase = format[args[0].option].parse(args[0].string),
            drop = args[3],
            encrypted = CryptoJS.RC4Drop.encrypt(message, passphrase, { drop: drop });

        return encrypted.ciphertext.toString(format[args[2]]);
    }

    /**
     * Highlight RC4 Drop
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
     * Highlight RC4 Drop in reverse
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

export default RC4Drop;
