/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import GostDigest from "../vendor/gost/gostDigest.mjs";
import { toHexFast } from "../lib/Hex.mjs";

/**
 * GOST hash operation
 */
class GOSTHash extends Operation {

    /**
     * GOSTHash constructor
     */
    constructor() {
        super();

        this.name = "GOST Hash";
        this.module = "Hashing";
        this.description = "GOST 哈希函数定义于标准 GOST R 34.11-94 与 GOST 34.311-95，是一种 256 位的密码学哈希函数。最初在俄罗斯国家标准 GOST R 34.11-94（信息技术—密码信息安全—哈希函数）中定义，独联体其它成员国采用等效标准 GOST 34.311-95。<br><br>注意不要与新修订标准 GOST R 34.11-2012 中定义的 Streebog 哈希函数混淆。<br><br>GOST 哈希函数基于 GOST 分组密码。";
        this.infoURL = "https://wikipedia.org/wiki/GOST_(hash_function)";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "算法",
                type: "argSelector",
                value: [
                    {
                        name: "GOST 28147 (1994)",
                        off: [1],
                        on: [2]
                    },
                    {
                        name: "GOST R 34.11 (Streebog, 2012)",
                        on: [1],
                        off: [2]
                    }
                ]
            },
            {
                name: "摘要长度",
                type: "option",
                value: ["256", "512"]
            },
            {
                name: "sBox",
                type: "option",
                value: ["E-TEST", "E-A", "E-B", "E-C", "E-D", "E-SC", "E-Z", "D-TEST", "D-A", "D-SC"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [version, length, sBox] = args;

        const versionNum = version === "GOST 28147 (1994)" ? 1994 : 2012;
        const algorithm = {
            name: versionNum === 1994 ? "GOST 28147" : "GOST R 34.10",
            version: versionNum,
            mode: "HASH"
        };

        if (versionNum === 1994) {
            algorithm.sBox = sBox;
        } else {
            algorithm.length = parseInt(length, 10);
        }

        try {
            const gostDigest = new GostDigest(algorithm);

            return toHexFast(gostDigest.digest(input));
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default GOSTHash;
