/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import bcrypt from "bcryptjs";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Bcrypt operation
 */
class Bcrypt extends Operation {

    /**
     * Bcrypt constructor
     */
    constructor() {
        super();

        this.name = "Bcrypt";
        this.module = "Crypto";
        this.description = "bcrypt 是一种密码哈希函数，由 Niels Provos 和 David Mazières 设计，基于 Blowfish 密码，于 1999 年在 USENIX 发表。除使用盐抵御彩虹表攻击外，bcrypt 还是自适应函数：可随时间增加迭代次数（轮次）以降低速度，从而在计算能力提升的情况下仍能抵御暴力破解。<br><br>在输入中输入密码以生成其哈希值。";
        this.infoURL = "https://wikipedia.org/wiki/Bcrypt";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "轮次",
                "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const rounds = args[0];
        const salt = await bcrypt.genSalt(rounds);

        return await bcrypt.hash(input, salt, null, p => {
            // Progress callback
            if (isWorkerEnvironment())
                self.sendStatusMessage(`Progress: ${(p * 100).toFixed(0)}%`);
        });

    }

}

export default Bcrypt;
