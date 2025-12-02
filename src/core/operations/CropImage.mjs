/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";
import Jimp from "jimp/es/index.js";

/**
 * Crop Image operation
 */
class CropImage extends Operation {

    /**
     * CropImage constructor
     */
    constructor() {
        super();

        this.name = "Crop Image";
        this.module = "Image";
        this.description = "将图像裁剪到指定区域，或自动裁剪边缘。<br><br><b><u>自动裁剪</u></b><br>自动裁剪图像的同色边框。<br><br><u>自动裁剪容差</u><br>像素间色差容忍度的百分比值。<br><br><u>仅自动裁剪真实边框</u><br>仅裁剪真实边框（所有边必须具有相同边框）。<br><br><u>对称自动裁剪</u><br>强制自动裁剪为对称（上下、左右裁剪相同量）。<br><br><u>自动裁剪保留边框</u><br>在图像周围保留的边框像素数。";
        this.infoURL = "https://wikipedia.org/wiki/Cropping_(image)";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "X 位置",
                type: "number",
                value: 0,
                min: 0
            },
            {
                name: "Y 位置",
                type: "number",
                value: 0,
                min: 0
            },
            {
                name: "宽度",
                type: "number",
                value: 10,
                min: 1
            },
            {
                name: "高度",
                type: "number",
                value: 10,
                min: 1
            },
            {
                name: "自动裁剪",
                type: "boolean",
                value: false
            },
            {
                name: "自动裁剪容差（%）",
                type: "number",
                value: 0.02,
                min: 0,
                max: 100,
                step: 0.01
            },
            {
                name: "仅自动裁剪真实边框",
                type: "boolean",
                value: true
            },
            {
                name: "对称自动裁剪",
                type: "boolean",
                value: false
            },
            {
                name: "自动裁剪保留边框（像素）",
                type: "number",
                value: 0,
                min: 0
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [xPos, yPos, width, height, autocrop, autoTolerance, autoFrames, autoSymmetric, autoBorder] = args;
        if (!isImage(input)) {
            throw new OperationError("Invalid file type.");
        }

        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`Error loading image. (${err})`);
        }
        try {
            if (isWorkerEnvironment())
                self.sendStatusMessage("Cropping image...");
            if (autocrop) {
                image.autocrop({
                    tolerance: (autoTolerance / 100),
                    cropOnlyFrames: autoFrames,
                    cropSymmetric: autoSymmetric,
                    leaveBorder: autoBorder
                });
            } else {
                image.crop(xPos, yPos, width, height);
            }

            let imageBuffer;
            if (image.getMIME() === "image/gif") {
                imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
            } else {
                imageBuffer = await image.getBufferAsync(Jimp.AUTO);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`Error cropping image. (${err})`);
        }
    }

    /**
     * Displays the cropped image using HTML for web apps
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data) {
        if (!data.byteLength) return "";
        const dataArray = new Uint8Array(data);

        const type = isImage(dataArray);
        if (!type) {
            throw new OperationError("Invalid file type.");
        }

        return `<img src="data:${type};base64,${toBase64(dataArray)}">`;
    }

}

export default CropImage;
