/**
 * @author n1073645 [n1073645@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import * as LS47 from "../lib/LS47.mjs";

/**
 * LS47 Decrypt operation
 */
class LS47Decrypt extends Operation {

    /**
     * LS47Decrypt constructor
     */
    constructor() {
        super();

        this.name = "LS47 Decrypt";
        this.module = "Crypto";
        this.description = "这是对 Alan Kaminsky 描述的 ElsieFour 密码的小幅改进。我们使用 7×7 字符替代原始的（勉强可用的）6×6，以便加密一些结构化信息；同时描述了一个简单的密钥扩展算法，便于记忆口令。其安全性考量与 ElsieFour 相同。<br>LS47 字母表包含以下字符：<code>_abcdefghijklmnopqrstuvwxyz.0123456789,-+*/:?!'()</code><br>LS47 密钥是上述字母表的一个排列，并以 7×7 网格表示用于加/解密。";
        this.infoURL = "https://github.com/exaexa/ls47";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "密码",
                type: "string",
                value: ""
            },
            {
                name: "填充长度",
                type: "number",
                value: 10
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        this.paddingSize = parseInt(args[1], 10);

        LS47.initTiles();

        const key = LS47.deriveKey(args[0]);
        return LS47.decryptPad(key, input, this.paddingSize);
    }

}

export default LS47Decrypt;
