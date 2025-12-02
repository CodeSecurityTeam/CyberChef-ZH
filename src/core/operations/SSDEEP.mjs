/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import ssdeepjs from "ssdeep.js";

/**
 * SSDEEP operation
 */
class SSDEEP extends Operation {

    /**
     * SSDEEP constructor
     */
    constructor() {
        super();

        this.name = "SSDEEP";
        this.module = "Crypto";
        this.description = "SSDEEP 是一种用于计算上下文触发分段哈希（CTPH）的程序。CTPH 亦称为模糊哈希，可匹配具有同源性的输入；此类输入包含顺序相同的若干相同字节序列，尽管这些序列之间的字节在内容与长度上可能不同。<br><br>SSDEEP 哈希现已广泛用于简单的识别用途（例如 VirusTotal 的“基本属性”部分）。尽管存在更“先进”的模糊哈希算法，SSDEEP 仍因其速度快且事实标准地位而成为主要选择之一。<br><br>该操作与 CTPH 操作在原理上相同，但输出格式不同。";
        this.infoURL = "https://forensics.wiki/ssdeep";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return ssdeepjs.digest(input);
    }

}

export default SSDEEP;
