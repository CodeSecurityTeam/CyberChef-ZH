/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";


/**
 * RC2 Encrypt operation
 */
class RC2Encrypt extends Operation {

    /**
     * RC2Encrypt constructor
     */
    constructor() {
        super();

        this.name = "RC2 Encrypt";
        this.module = "Ciphers";
        this.description = "RC2（亦称 ARC2）是 Ron Rivest 于 1987 年设计的对称分组密码，“RC”代表 Rivest Cipher。<br><br><b>密钥：</b>RC2 使用可变长度密钥。<br><br>你可以使用 KDF 操作生成基于口令的密钥。<br><br><b>IV：</b>在 CBC 模式下运行时，初始向量应为 8 字节；若 IV 为空则以 ECB 模式运行。<br><br><b>填充：</b>CBC 与 ECB 模式均使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/RC2";
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
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            [,, inputType, outputType] = args,
            cipher = forge.rc2.createEncryptionCipher(key);

        input = Utils.convertToByteString(input, inputType);

        cipher.start(iv || null);
        cipher.update(forge.util.createBuffer(input));
        cipher.finish();

        return outputType === "Hex" ? cipher.output.toHex() : cipher.output.getBytes();
    }

}

export default RC2Encrypt;
