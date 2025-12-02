/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * Snefru operation
 */
class Snefru extends Operation {

    /**
     * Snefru constructor
     */
    constructor() {
        super();

        this.name = "Snefru";
        this.module = "Crypto";
        this.description = "Snefru 是一种由 Ralph Merkle 于 1990 年在 Xerox PARC 工作期间发明的密码哈希函数，支持 128 位与 256 位输出。其名称来源于埃及法老 Sneferu，延续了 Khufu 与 Khafre 分组密码的命名传统。<br><br>原始设计被 Eli Biham 与 Adi Shamir 证明不安全，他们通过差分密码分析找到了哈希碰撞。随后通过将算法主循环的迭代次数从 2 次增加到 8 次对设计进行了修改。";
        this.infoURL = "https://wikipedia.org/wiki/Snefru";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "大小",
                type: "number",
                value: 128,
                min: 32,
                max: 480,
                step: 32
            },
            {
                name: "轮数",
                type: "option",
                value: ["8", "4", "2"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return runHash("snefru", input, {
            length: args[0],
            rounds: args[1]
        });
    }

}

export default Snefru;
