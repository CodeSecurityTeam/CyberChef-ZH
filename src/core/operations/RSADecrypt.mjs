/**
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import forge from "node-forge";
import { MD_ALGORITHMS } from "../lib/RSA.mjs";

/**
 * RSA Decrypt operation
 */
class RSADecrypt extends Operation {

    /**
     * RSADecrypt constructor
     */
    constructor() {
        super();

        this.name = "RSA Decrypt";
        this.module = "Ciphers";
        this.description = "使用 PEM 编码的 RSA 私钥解密消息。";
        this.infoURL = "https://wikipedia.org/wiki/RSA_(cryptosystem)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "RSA 私钥（PEM）",
                type: "text",
                value: "-----BEGIN RSA PRIVATE KEY-----"
            },
            {
                name: "密钥口令",
                type: "text",
                value: ""
            },
            {
                name: "加密方案",
                type: "argSelector",
                value: [
                    {
                        name: "RSA-OAEP",
                        on: [3]
                    },
                    {
                        name: "RSAES-PKCS1-V1_5",
                        off: [3]
                    },
                    {
                        name: "RAW",
                        off: [3]
                    }]
            },
            {
                name: "消息摘要算法",
                type: "option",
                value: Object.keys(MD_ALGORITHMS)
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [pemKey, password, scheme, md] = args;
        if (pemKey.replace("-----BEGIN RSA PRIVATE KEY-----", "").length === 0) {
            throw new OperationError("Please enter a private key.");
        }
        try {
            const privKey = forge.pki.decryptRsaPrivateKey(pemKey, password);
            const dMsg = privKey.decrypt(input, scheme, {md: MD_ALGORITHMS[md].create()});
            return forge.util.decodeUtf8(dMsg);
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default RSADecrypt;
