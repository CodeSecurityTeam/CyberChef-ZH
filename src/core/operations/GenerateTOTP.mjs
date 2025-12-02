/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import * as OTPAuth from "otpauth";

/**
 * Generate TOTP operation
 */
class GenerateTOTP extends Operation {
    /**
     *
     */
    constructor() {
        super();
        this.name = "Generate TOTP";
        this.module = "Default";
        this.description = "时间型一次性密码算法（TOTP）从共享密钥与当前时间计算一次性口令。其已被 IETF 标准 RFC 6238 采纳，是开放认证（OATH）的基石，并广泛用于双因素认证系统。TOTP 可视为计数器为当前时间的 HOTP。<br><br>将密钥作为输入，或留空以随机生成。T0 与 T1 为秒。";
        this.infoURL = "https://wikipedia.org/wiki/Time-based_One-time_Password_algorithm";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "名称",
                "type": "string",
                "value": ""
            },
            {
                "name": "验证码长度",
                "type": "number",
                "value": 6
            },
            {
                "name": "纪元偏移（T0）",
                "type": "number",
                "value": 0
            },
            {
                "name": "时间步长（T1）",
                "type": "number",
                "value": 30
            }
        ];
    }

    /**
     *
     */
    run(input, args) {
        const secretStr = new TextDecoder("utf-8").decode(input).trim();
        const secret = secretStr ? secretStr.toUpperCase().replace(/\s+/g, "") : "";

        const totp = new OTPAuth.TOTP({
            issuer: "",
            label: args[0],
            algorithm: "SHA1",
            digits: args[1],
            period: args[3],
            epoch: args[2] * 1000, // Convert seconds to milliseconds
            secret: OTPAuth.Secret.fromBase32(secret)
        });

        const uri = totp.toString();
        const code = totp.generate();

        return `URI: ${uri}\n\nPassword: ${code}`;
    }
}

export default GenerateTOTP;
