/**
 * @author PenguinGeorge [george@penguingeorge.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import {alphabetName, ALPHABET_OPTIONS} from "../lib/Base85.mjs";

/**
 * To Base85 operation
 */
class ToBase85 extends Operation {

    /**
     * To Base85 constructor
     */
    constructor() {
        super();

        this.name = "To Base85";
        this.module = "Default";
        this.description = "Base85（亦称 Ascii85）是一种用于编码任意字节数据的表示法，通常比 Base64 更高效。<br><br>该操作将数据编码为 ASCII 字符串（可选择字母表，提供预设）。<br><br>例如：<code>hello world</code> 变为 <code>BOu!rD]j7BEbo7</code><br><br>Base85 常用于 Adobe 的 PostScript 和 PDF 文件格式。<br><br><strong>选项</strong><br><u>字母表</u><ul><li>Standard - 标准字母表，亦称 Ascii85</li><li>Z85 (ZeroMQ) - 字符串安全的 Base85 变体，避免引号和反斜杠字符</li><li>IPv6 - 适用于编码 IPv6 地址的 Base85 变体（RFC 1924）</li></ul><u>包含定界符</u><br>在数据开头和结尾添加 '<~' 与 '~>' 定界符，这是 Adobe 的 Base85 实现中的标准做法。";
        this.infoURL = "https://wikipedia.org/wiki/Ascii85";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "字母表",
                type: "editableOption",
                value: ALPHABET_OPTIONS
            },
            {
                name: "包含定界符",
                type: "boolean",
                value: false
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
        const alphabet = Utils.expandAlphRange(args[0]).join(""),
            encoding = alphabetName(alphabet),
            includeDelim = args[1];
        let result = "";

        if (alphabet.length !== 85 ||
            [].unique.call(alphabet).length !== 85) {
            throw new OperationError("Error: Alphabet must be of length 85");
        }

        if (input.length === 0) return "";

        let block;
        for (let i = 0; i < input.length; i += 4) {
            block = (
                ((input[i])          << 24) +
                ((input[i + 1] || 0) << 16) +
                ((input[i + 2] || 0) << 8)  +
                ((input[i + 3] || 0))
            ) >>> 0;

            if (encoding !== "Standard" || block > 0) {
                let digits = [];
                for (let j = 0; j < 5; j++) {
                    digits.push(block % 85);
                    block = Math.floor(block / 85);
                }

                digits = digits.reverse();

                if (input.length < i + 4) {
                    digits.splice(input.length - (i + 4), 4);
                }

                result += digits.map(digit => alphabet[digit]).join("");
            } else {
                result += (encoding === "Standard") ? "z" : null;
            }
        }

        return includeDelim ? `<~${result}~>` : result;
    }
}

export default ToBase85;
