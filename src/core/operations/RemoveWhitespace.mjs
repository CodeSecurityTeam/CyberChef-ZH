/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Remove whitespace operation
 */
class RemoveWhitespace extends Operation {

    /**
     * RemoveWhitespace constructor
     */
    constructor() {
        super();

        this.name = "Remove whitespace";
        this.module = "Default";
        this.description = "可选地从输入数据中移除所有空格、回车、换行、制表符与换页符。<br><br>本操作还支持移除句点（在 ASCII 输出中有时用于表示不可打印字节）。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "空格",
                "type": "boolean",
                "value": true
            },
            {
                "name": "回车 (\\r)",
                "type": "boolean",
                "value": true
            },
            {
                "name": "换行 (\\n)",
                "type": "boolean",
                "value": true
            },
            {
                "name": "制表符",
                "type": "boolean",
                "value": true
            },
            {
                "name": "换页符 (\\f)",
                "type": "boolean",
                "value": true
            },
            {
                "name": "句点",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [
            removeSpaces,
            removeCarriageReturns,
            removeLineFeeds,
            removeTabs,
            removeFormFeeds,
            removeFullStops
        ] = args;
        let data = input;

        if (removeSpaces) data = data.replace(/ /g, "");
        if (removeCarriageReturns) data = data.replace(/\r/g, "");
        if (removeLineFeeds) data = data.replace(/\n/g, "");
        if (removeTabs) data = data.replace(/\t/g, "");
        if (removeFormFeeds) data = data.replace(/\f/g, "");
        if (removeFullStops) data = data.replace(/\./g, "");
        return data;
    }

}

export default RemoveWhitespace;
