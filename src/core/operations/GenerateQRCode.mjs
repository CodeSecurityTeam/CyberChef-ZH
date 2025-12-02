/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { generateQrCode } from "../lib/QRCode.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { isImage } from "../lib/FileType.mjs";
import Utils from "../Utils.mjs";

/**
 * Generate QR Code operation
 */
class GenerateQRCode extends Operation {

    /**
     * GenerateQRCode constructor
     */
    constructor() {
        super();

        this.name = "Generate QR Code";
        this.module = "Image";
        this.description = "根据输入文本生成快速响应（QR）码。<br><br>QR 码是一种矩阵条码（二维条码），最初于 1994 年为日本汽车行业设计。条码是包含附着对象信息的可机读光学标签。";
        this.infoURL = "https://wikipedia.org/wiki/QR_code";
        this.inputType = "string";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                "name": "图像格式",
                "type": "option",
                "value": ["PNG", "SVG", "EPS", "PDF"]
            },
            {
                "name": "模块大小（像素）",
                "type": "number",
                "value": 5,
                "min": 1
            },
            {
                "name": "边距（模块数）",
                "type": "number",
                "value": 4,
                "min": 0
            },
            {
                "name": "纠错级别",
                "type": "option",
                "value": ["Low", "Medium", "Quartile", "High"],
                "defaultIndex": 1
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const [format, size, margin, errorCorrection] = args;

        return generateQrCode(input, format, size, margin, errorCorrection);
    }

    /**
     * Displays the QR image using HTML for web apps
     *
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data, args) {
        if (!data.byteLength && !data.length) return "";
        const dataArray = new Uint8Array(data),
            [format] = args;
        if (format === "PNG") {
            const type = isImage(dataArray);
            if (!type) {
                throw new OperationError("Invalid file type.");
            }

            return `<img src="data:${type};base64,${toBase64(dataArray)}">`;
        }

        return Utils.arrayBufferToStr(data);
    }

}

export default GenerateQRCode;
