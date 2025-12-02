/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";

/**
 * Derive PBKDF2 key operation
 */
class DerivePBKDF2Key extends Operation {

    /**
     * DerivePBKDF2Key constructor
     */
    constructor() {
        super();

        this.name = "Derive PBKDF2 key";
        this.module = "Ciphers";
        this.description = "PBKDF2 是一种基于口令的密钥派生函数。它属于 RSA 实验室的 PKCS 标准系列，具体为 PKCS #5 v2.0，同时也作为 IETF 的 RFC 2898 发布。<br><br>在很多密码学应用中，用户安全最终取决于口令；由于口令通常不能直接用作密钥，因此需要进行处理。<br><br>盐值为任意口令提供更大的密钥空间；迭代次数提高从口令派生密钥的成本，从而增加攻击难度。<br><br>如果盐值参数为空，将自动生成随机盐。";
        this.infoURL = "https://wikipedia.org/wiki/PBKDF2";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "口令",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["UTF8", "Latin1", "Hex", "Base64"]
            },
            {
                "name": "密钥长度",
                "type": "number",
                "value": 128
            },
            {
                "name": "迭代次数",
                "type": "number",
                "value": 1
            },
            {
                "name": "哈希函数",
                "type": "option",
                "value": ["SHA1", "SHA256", "SHA384", "SHA512", "MD5"]
            },
            {
                "name": "盐值",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const passphrase = Utils.convertToByteString(args[0].string, args[0].option),
            keySize = args[1],
            iterations = args[2],
            hasher = args[3],
            salt = Utils.convertToByteString(args[4].string, args[4].option) ||
                forge.random.getBytesSync(keySize),
            derivedKey = forge.pkcs5.pbkdf2(passphrase, salt, iterations, keySize / 8, hasher.toLowerCase());

        return forge.util.bytesToHex(derivedKey);
    }

}

export default DerivePBKDF2Key;
