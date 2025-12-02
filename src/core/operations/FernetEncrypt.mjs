/**
 * @author Karsten Silkenbäumer [github.com/kassi]
 * @copyright Karsten Silkenbäumer 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import fernet from "fernet";

/**
 * FernetEncrypt operation
 */
class FernetEncrypt extends Operation {
    /**
     * FernetEncrypt constructor
     */
    constructor() {
        super();

        this.name = "Fernet Encrypt";
        this.module = "Default";
        this.description = "Fernet 是一种对称加密方法，确保加密消息在无密钥的情况下无法被篡改或读取。使用 URL 安全编码作为密钥格式。Fernet 基于 128 位 AES 的 CBC 模式与 PKCS7 填充，并使用 SHA256 的 HMAC 进行认证。IV 由操作系统随机生成。<br><br><b>密钥：</b>密钥必须为 32 字节（256 位），并以 Base64 编码。";
        this.infoURL = "https://asecuritysite.com/encryption/fer";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥",
                "type": "string",
                "value": ""
            },
        ];
    }
    /**
     * @param {String} input
     * @param {Object[]} args
     * @returns {String}
     */
    run(input, args) {
        const [secretInput] = args;
        try {
            const secret = new fernet.Secret(secretInput);
            const token = new fernet.Token({
                secret: secret,
            });
            return token.encode(input);
        } catch (err) {
            throw new OperationError(err);
        }
    }
}

export default FernetEncrypt;
