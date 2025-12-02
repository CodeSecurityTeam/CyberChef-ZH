/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";
import OperationError from "../errors/OperationError.mjs";

/**
 * AES Decrypt operation
 */
class AESDecrypt extends Operation {

    /**
     * AESDecrypt constructor
     */
    constructor() {
        super();

        this.name = "AES Decrypt";
        this.module = "Ciphers";
        this.description = "高级加密标准（AES）是美国联邦信息处理标准（FIPS）。它在为期 5 年的评选中从 15 种设计中选出。<br><br><b>密钥：</b>根据密钥长度使用以下算法：<ul><li>16 字节 = AES-128</li><li>24 字节 = AES-192</li><li>32 字节 = AES-256</li></ul><br><br><b>IV：</b>初始化向量应为 16 字节。如未输入，默认使用 16 个空字节。<br><br><b>填充：</b>在 CBC 和 ECB 模式下默认使用 PKCS#7 填充。<br><br><b>GCM 标签：</b>除非使用 GCM 模式，否则忽略此字段。";
        this.infoURL = "https://wikipedia.org/wiki/Advanced_Encryption_Standard";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "初始向量",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "模式",
                "type": "argSelector",
                "value": [
                    {
                        name: "CBC",
                        off: [5, 6]
                    },
                    {
                        name: "CFB",
                        off: [5, 6]
                    },
                    {
                        name: "OFB",
                        off: [5, 6]
                    },
                    {
                        name: "CTR",
                        off: [5, 6]
                    },
                    {
                        name: "GCM",
                        on: [5, 6]
                    },
                    {
                        name: "ECB",
                        off: [5, 6]
                    },
                    {
                        name: "CBC/NoPadding",
                        off: [5, 6]
                    },
                    {
                        name: "ECB/NoPadding",
                        off: [5, 6]
                    }
                ]
            },
            {
                "name": "输入",
                "type": "option",
                "value": ["Hex", "Raw"]
            },
            {
                "name": "输出",
                "type": "option",
                "value": ["Raw", "Hex"]
            },
            {
                "name": "GCM 标签",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "附加认证数据",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if cannot decrypt input or invalid key length
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            mode = args[2].split("/")[0],
            noPadding = args[2].endsWith("NoPadding"),
            inputType = args[3],
            outputType = args[4],
            gcmTag = Utils.convertToByteString(args[5].string, args[5].option),
            aad = Utils.convertToByteString(args[6].string, args[6].option);

        if ([16, 24, 32].indexOf(key.length) < 0) {
            throw new OperationError(`Invalid key length: ${key.length} bytes

The following algorithms will be used based on the size of the key:
  16 bytes = AES-128
  24 bytes = AES-192
  32 bytes = AES-256`);
        }

        input = Utils.convertToByteString(input, inputType);

        const decipher = forge.cipher.createDecipher("AES-" + mode, key);

        /* Allow for a "no padding" mode */
        if (noPadding) {
            decipher.mode.unpad = function(output, options) {
                return true;
            };
        }

        decipher.start({
            iv: iv.length === 0 ? "" : iv,
            tag: mode === "GCM" ? gcmTag : undefined,
            additionalData: mode === "GCM" ? aad : undefined
        });
        decipher.update(forge.util.createBuffer(input));
        const result = decipher.finish();

        if (result) {
            return outputType === "Hex" ? decipher.output.toHex() : decipher.output.getBytes();
        } else {
            throw new OperationError("Unable to decrypt input with these parameters.");
        }
    }

}

export default AESDecrypt;
