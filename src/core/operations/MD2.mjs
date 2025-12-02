/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * MD2 operation
 */
class MD2 extends Operation {

    /**
     * MD2 constructor
     */
    constructor() {
        super();

        this.name = "MD2";
        this.module = "Crypto";
        this.description = "MD2（消息摘要2）算法是 Ronald Rivest 于 1989 年开发的一种加密哈希函数，针对 8 位计算机进行了优化。<br><br>尽管 MD2 自 2014 年起已不再被认为是安全的，但它仍在公钥基础设施中作为使用 MD2 和 RSA 生成的证书的一部分使用。该消息摘要算法默认包含 18 轮运算。";
        this.infoURL = "https://wikipedia.org/wiki/MD2_(cryptography)";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "轮数",
                type: "number",
                value: 18,
                min: 0
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return runHash("md2", input, {rounds: args[0]});
    }

}

export default MD2;
