/**
 * @author sg5506844 [sg5506844@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import rison from "rison";

/**
 * Rison Encode operation
 */
class RisonEncode extends Operation {

    /**
     * RisonEncode constructor
     */
    constructor() {
        super();

        this.name = "Rison Encode";
        this.module = "Encodings";
        this.description = "Rison 是一种针对 URI 紧凑性优化的数据序列化格式。它是 JSON 的轻微变体，在进行 URI 编码后更为优雅。Rison 与 JSON 表达相同的数据结构，因此可无损双向转换。";
        this.infoURL = "https://github.com/Nanonid/rison";
        this.inputType = "Object";
        this.outputType = "string";
        this.args = [
            {
                name: "编码选项",
                type: "option",
                value: ["Encode", "Encode Object", "Encode Array", "Encode URI"]
            },
        ];
    }

    /**
     * @param {Object} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [encodeOption] = args;
        switch (encodeOption) {
            case "Encode":
                return rison.encode(input);
            case "Encode Object":
                return rison.encode_object(input);
            case "Encode Array":
                return rison.encode_array(input);
            case "Encode URI":
                return rison.encode_uri(input);
            default:
                throw new OperationError("Invalid encode option");
        }
    }
}

export default RisonEncode;
