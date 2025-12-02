/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import forge from "node-forge";

/**
 * Triple DES Encrypt operation
 */
class TripleDESEncrypt extends Operation {

    /**
     * TripleDESEncrypt constructor
     */
    constructor() {
        super();

        this.name = "Triple DES Encrypt";
        this.module = "Ciphers";
        this.description = "Triple DES 对每个分组执行三次 DES 以增大密钥长度。<br><br><b>密钥：</b>Triple DES 使用 24 字节（192 位）密钥。<br><br>你可以使用 KDF（密钥派生）操作生成基于口令的密钥。<br><br><b>IV：</b>初始向量应为 8 字节；未输入时默认为 8 个空字节。<br><br><b>填充：</b>在 CBC 与 ECB 模式下使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/Triple_DES";
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
                "name": "初始向量（IV）",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "模式",
                "type": "option",
                "value": ["CBC", "CFB", "OFB", "CTR", "ECB"]
            },
            {
                "name": "输入",
                "type": "option",
                "value": ["Raw", "Hex"]
            },
            {
                "name": "输出",
                "type": "option",
                "value": ["Hex", "Raw"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteArray(args[1].string, args[1].option),
            mode = args[2],
            inputType = args[3],
            outputType = args[4];

        if (key.length !== 24 && key.length !== 16) {
            throw new OperationError(`Invalid key length: ${key.length} bytes

Triple DES uses a key length of 24 bytes (192 bits).`);
        }
        if (iv.length !== 8 && mode !== "ECB") {
            throw new OperationError(`Invalid IV length: ${iv.length} bytes

Triple DES uses an IV length of 8 bytes (64 bits).
Make sure you have specified the type correctly (e.g. Hex vs UTF8).`);
        }

        input = Utils.convertToByteString(input, inputType);

        const cipher = forge.cipher.createCipher("3DES-" + mode,
            key.length === 16 ? key + key.substring(0, 8) : key);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(input));
        cipher.finish();

        return outputType === "Hex" ? cipher.output.toHex() : cipher.output.getBytes();
    }

}

export default TripleDESEncrypt;
