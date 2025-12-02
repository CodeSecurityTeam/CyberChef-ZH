/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {smbhash} from "ntlm";

/**
 * LM Hash operation
 */
class LMHash extends Operation {

    /**
     * LMHash constructor
     */
    constructor() {
        super();

        this.name = "LM Hash";
        this.module = "Crypto";
        this.description = "LM 哈希（LAN Manager 哈希）是旧版微软操作系统中用于存储密码的过时算法。其安全性很弱，在现代硬件上可使用彩虹表在数秒内破解。";
        this.infoURL = "https://wikipedia.org/wiki/LAN_Manager#Password_hashing_algorithm";
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
        return smbhash.lmhash(input);
    }

}

export default LMHash;
