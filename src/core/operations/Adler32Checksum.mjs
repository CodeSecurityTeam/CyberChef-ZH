/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Adler-32 Checksum operation
 */
class Adler32Checksum extends Operation {

    /**
     * Adler32Checksum constructor
     */
    constructor() {
        super();

        this.name = "Adler-32 Checksum";
        this.module = "Crypto";
        this.description = "Adler-32 是 Mark Adler 于 1995 年提出的校验和算法，是 Fletcher 校验和的改进。与同长度的 CRC 相比，它以速度换取可靠性（更偏重速度）。<br><br>Adler-32 比 Fletcher-16 更可靠，略低于 Fletcher-32。";
        this.infoURL = "https://wikipedia.org/wiki/Adler-32";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const MOD_ADLER = 65521;
        let a = 1,
            b = 0;
        input = new Uint8Array(input);

        for (let i = 0; i < input.length; i++) {
            a += input[i];
            b += a;
        }

        a %= MOD_ADLER;
        b %= MOD_ADLER;

        return Utils.hex(((b << 16) | a) >>> 0, 8);
    }

}

export default Adler32Checksum;
