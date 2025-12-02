/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import bson from "bson";
import OperationError from "../errors/OperationError.mjs";

/**
 * BSON serialise operation
 */
class BSONSerialise extends Operation {

    /**
     * BSONSerialise constructor
     */
    constructor() {
        super();

        this.name = "BSON serialise";
        this.module = "Serialise";
        this.description = "BSON 是一种数据交换格式，主要用于 MongoDB 的数据存储与网络传输。它以二进制形式表示简单数据结构、关联数组（在 MongoDB 中称为对象或文档），以及多个对 MongoDB 有意义的数据类型。名称源自 JSON，意为“二进制 JSON”。<br><br>输入数据需为有效 JSON。";
        this.infoURL = "https://wikipedia.org/wiki/BSON";
        this.inputType = "string";
        this.outputType = "ArrayBuffer";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        if (!input) return new ArrayBuffer();

        try {
            const data = JSON.parse(input);
            return bson.serialize(data).buffer;
        } catch (err) {
            throw new OperationError(err.toString());
        }
    }

}

export default BSONSerialise;
