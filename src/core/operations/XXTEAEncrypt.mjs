/**
 * @author devcydo [devcydo@gmail.com]
 * @author Ma Bingyao [mabingyao@gmail.com]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {encrypt} from "../lib/XXTEA.mjs";

/**
 * XXTEA Encrypt operation
 */
class XXTEAEncrypt extends Operation {

    /**
     * XXTEAEncrypt constructor
     */
    constructor() {
        super();

        this.name = "XXTEA Encrypt";
        this.module = "Ciphers";
        this.description = "改进的块 TEA（通常称为 XXTEA）是一种为修复原始 Block TEA 弱点而设计的分组密码。XXTEA 在可变长度的块上运行，块大小为 32 位的任意倍数（最小 64 位）。完整轮数依赖于块大小，至少为 6（小块时可升至 32）。原始 Block TEA 将 XTEA 轮函数应用到块中的每个字并与其最左邻居相加。解密过程的缓慢扩散率很快被利用以攻破该密码。改进的 Block TEA 使用更复杂的轮函数，在处理块中每个字时同时利用其两个相邻字。";
        this.infoURL = "https://wikipedia.org/wiki/XXTEA";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = new Uint8Array(Utils.convertToByteArray(args[0].string, args[0].option));
        return encrypt(new Uint8Array(input), key).buffer;
    }

}

export default XXTEAEncrypt;
