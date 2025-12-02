/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import ExifParser from "exif-parser";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Extract EXIF operation
 */
class ExtractEXIF extends Operation {

    /**
     * ExtractEXIF constructor
     */
    constructor() {
        super();

        this.name = "Extract EXIF";
        this.module = "Image";
        this.description = [
            "从图像中提取 EXIF 数据。",
            "<br><br>",
            "EXIF 是嵌入在图像（JPEG、JPG、TIFF）与音频文件中的元数据。",
            "<br><br>",
            "照片的 EXIF 通常包含图像文件本身的信息以及用于拍摄的设备信息。",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Exif";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        try {
            const parser = ExifParser.create(input);
            const result = parser.parse();

            const lines = [];
            for (const tagName in result.tags) {
                const value = result.tags[tagName];
                lines.push(`${tagName}: ${value}`);
            }

            const numTags = lines.length;
            lines.unshift(`Found ${numTags} tags.\n`);
            return lines.join("\n");
        } catch (err) {
            throw new OperationError(`Could not extract EXIF data from image: ${err}`);
        }
    }

}

export default ExtractEXIF;
