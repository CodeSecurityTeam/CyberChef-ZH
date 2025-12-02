/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import ctphjs from "ctph.js";

/**
 * CTPH operation
 */
class CTPH extends Operation {

    /**
     * CTPH constructor
     */
    constructor() {
        super();

        this.name = "CTPH";
        this.module = "Crypto";
        this.description = "上下文触发分块哈希（CTPH），也称模糊哈希，可匹配具有同源性的输入。这类输入在相同顺序上包含相同字节序列，尽管序列之间的字节在内容与长度上可能不同。<br><br>CTPH 最初基于 Andrew Tridgell 的工作与垃圾邮件检测器 SpamSum，后由 Jesse Kornblum 改进并于 2006 年在 DFRWS 会议论文《Identifying Almost Identical Files Using Context Triggered Piecewise Hashing》中发表。";
        this.infoURL = "https://forensics.wiki/context_triggered_piecewise_hashing/";
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
        return ctphjs.digest(input);
    }

}

export default CTPH;
