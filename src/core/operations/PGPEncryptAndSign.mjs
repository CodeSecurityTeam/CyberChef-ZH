/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import kbpgp from "kbpgp";
import { ASP, importPrivateKey, importPublicKey } from "../lib/PGP.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as es6promisify from "es6-promisify";
const promisify = es6promisify.default ? es6promisify.default.promisify : es6promisify.promisify;

/**
 * PGP Encrypt and Sign operation
 */
class PGPEncryptAndSign extends Operation {

    /**
     * PGPEncryptAndSign constructor
     */
    constructor() {
        super();

        this.name = "PGP Encrypt and Sign";
        this.module = "PGP";
        this.description = [
            "输入：要签名的明文。",
            "<br><br>",
            "参数：签名者的 ASCII 封装私钥（必要时包含私钥密码）",
            "以及收件人的 ASCII 封装 PGP 公钥。",
            "<br><br>",
            "本操作使用 PGP 生成加密的数字签名。",
            "<br><br>",
            "Pretty Good Privacy（OpenPGP）是一种用于消息加密、解密与签名的加密标准。",
            "<br><br>",
            "该功能使用 Keybase 的 PGP 实现。",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Pretty_Good_Privacy";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "签名者私钥",
                "type": "text",
                "value": ""
            },
            {
                "name": "私钥口令",
                "type": "string",
                "value": ""
            },
            {
                "name": "收件人公钥",
                "type": "text",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if failure to sign message
     */
    async run(input, args) {
        const message = input,
            [privateKey, passphrase, publicKey] = args;
        let signedMessage;

        if (!privateKey) throw new OperationError("Enter the private key of the signer.");
        if (!publicKey) throw new OperationError("Enter the public key of the recipient.");
        const privKey = await importPrivateKey(privateKey, passphrase);
        const pubKey = await importPublicKey(publicKey);

        try {
            signedMessage = await promisify(kbpgp.box)({
                "msg": message,
                "encrypt_for": pubKey,
                "sign_with": privKey,
                "asp": ASP
            });
        } catch (err) {
            throw new OperationError(`Couldn't sign message: ${err}`);
        }

        return signedMessage;
    }

}

export default PGPEncryptAndSign;
