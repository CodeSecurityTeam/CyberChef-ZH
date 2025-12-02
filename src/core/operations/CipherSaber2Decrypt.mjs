/**
 * @author n1073645 [n1073645@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { encode } from "../lib/CipherSaber2.mjs";
import Utils from "../Utils.mjs";

/**
 * CipherSaber2 Decrypt operation
 */
class CipherSaber2Decrypt extends Operation {

    /**
     * CipherSaber2Decrypt constructor
     */
    constructor() {
        super();

        this.name = "CipherSaber2 Decrypt";
        this.module = "Crypto";
        this.description = "CipherSaber 是一种基于 RC4 流密码的简单对称加密协议。它能提供合理的机密性保护，同时设计简单，以致初学者也能记住算法并从零实现。";
        this.infoURL = "https://wikipedia.org/wiki/CipherSaber";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                name: "密钥",
                type: "toggleString",
                value: "",
                toggleValues: ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                name: "轮次",
                type: "number",
                value: 20
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        input = new Uint8Array(input);
        const result = [],
            key = Utils.convertToByteArray(args[0].string, args[0].option),
            rounds = args[1];

        const tempIVP = input.slice(0, 10);
        input = input.slice(10);
        return new Uint8Array(result.concat(encode(tempIVP, key, rounds, input))).buffer;
    }

}

export default CipherSaber2Decrypt;
