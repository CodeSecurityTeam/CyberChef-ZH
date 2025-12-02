/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {FORMATS, convertCoordinates} from "../lib/ConvertCoordinates.mjs";

/**
 * Convert co-ordinate format operation
 */
class ConvertCoordinateFormat extends Operation {

    /**
     * ConvertCoordinateFormat constructor
     */
    constructor() {
        super();

        this.name = "Convert co-ordinate format";
        this.module = "Hashing";
        this.description = "在不同格式之间转换地理坐标。<br><br>支持格式：<ul><li>度分秒（DMS）</li><li>度十进分（DDM）</li><li>十进制度（DD）</li><li>Geohash</li><li>军事网格参考系统（MGRS）</li><li>英国国家测量局网格（OSNG）</li><li>通用横轴墨卡托（UTM）</li></ul><br>该操作可尝试自动检测输入坐标格式与分隔符，但不一定总能正确识别。";
        this.infoURL = "https://wikipedia.org/wiki/Geographic_coordinate_conversion";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "输入格式",
                "type": "option",
                "value": ["Auto"].concat(FORMATS)
            },
            {
                "name": "输入分隔符",
                "type": "option",
                "value": [
                    "Auto",
                    "Direction Preceding",
                    "Direction Following",
                    "\\n",
                    "Comma",
                    "Semi-colon",
                    "Colon"
                ]
            },
            {
                "name": "输出格式",
                "type": "option",
                "value": FORMATS
            },
            {
                "name": "输出分隔符",
                "type": "option",
                "value": [
                    "Space",
                    "\\n",
                    "Comma",
                    "Semi-colon",
                    "Colon"
                ]
            },
            {
                "name": "包含方向字母",
                "type": "option",
                "value": [
                    "None",
                    "Before",
                    "After"
                ]
            },
            {
                "name": "精度",
                "type": "number",
                "value": 3
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.replace(/[\s+]/g, "") !== "") {
            const [inFormat, inDelim, outFormat, outDelim, incDirection, precision] = args;
            const result = convertCoordinates(input, inFormat, inDelim, outFormat, outDelim, incDirection, precision);
            return result;
        } else {
            return input;
        }
    }
}

export default ConvertCoordinateFormat;
