/**
 * @author Danh4 [dan.h4@ncsc.gov.uk]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Cbor from "cbor";

/**
 * CBOR Encode operation
 */
class CBOREncode extends Operation {

    /**
     * CBOREncode constructor
     */
    constructor() {
        super();

        this.name = "CBOR Encode";
        this.module = "Serialise";
        this.description = "简明二进制对象表示（CBOR）是一种基于 JSON 的二进制数据序列化格式。与 JSON 类似，它可以传输包含键值对的数据对象，但更为简洁，从而提升处理与传输速度，代价是可读性降低。该格式在 IETF RFC 8949 中定义。";
        this.infoURL = "https://wikipedia.org/wiki/CBOR";
        this.inputType = "JSON";
        this.outputType = "ArrayBuffer";
        this.args = [];
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        return new Uint8Array(Cbor.encodeCanonical(input)).buffer;
    }

}

export default CBOREncode;
