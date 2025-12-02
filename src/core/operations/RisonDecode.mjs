/**
 * @author sg5506844 [sg5506844@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import rison from "rison";

/**
 * Rison Decode operation
 */
class RisonDecode extends Operation {

    /**
     * RisonDecode constructor
     */
    constructor() {
        super();

        this.name = "Rison Decode";
        this.module = "Encodings";
        this.description = "Rison 是一种针对 URI 紧凑性优化的数据序列化格式。它是 JSON 的轻微变体，在进行 URI 编码后更为优雅。Rison 与 JSON 表达相同的数据结构，因此可无损双向转换。";
        this.infoURL = "https://github.com/Nanonid/rison";
        this.inputType = "string";
        this.outputType = "Object";
        this.args = [
            {
                name: "解码选项",
                type: "editableOption",
                value: ["Decode", "Decode Object", "Decode Array"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {Object}
     */
    run(input, args) {
        const [decodeOption] = args;
        switch (decodeOption) {
            case "Decode":
                return rison.decode(input);
            case "Decode Object":
                return rison.decode_object(input);
            case "Decode Array":
                return rison.decode_array(input);
            default:
                throw new OperationError("Invalid Decode option");
        }
    }
}

export default RisonDecode;
