/**
 * @author GCHQ Contributor [3]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Protobuf from "../lib/Protobuf.mjs";

/**
 * Protobuf Decode operation
 */
class ProtobufDecode extends Operation {

    /**
     * ProtobufDecode constructor
     */
    constructor() {
        super();

        this.name = "Protobuf Decode";
        this.module = "Protobuf";
        this.description = "将 Protobuf 编码的数据解码为 JSON 表示，字段键使用字段号。<br><br>若定义了 .proto 模式，解码将参考该模式，仅解码一个消息实例。<br><br><u>显示未知字段</u><br>在使用模式时，显示输入中存在但未在模式中定义的字段。<br><br><u>显示类型</u><br>在字段名旁显示其类型；对于未定义字段，显示线类型与示例类型。";
        this.infoURL = "https://wikipedia.org/wiki/Protocol_Buffers";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.args = [
            {
                name: "模式（.proto 文本）",
                type: "text",
                value: "",
                rows: 8,
                hint: "Drag and drop is enabled on this ingredient"
            },
            {
                name: "显示未知字段",
                type: "boolean",
                value: false
            },
            {
                name: "显示类型",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        input = new Uint8Array(input);
        try {
            return Protobuf.decode(input, args);
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default ProtobufDecode;
