/**
 * Emulation of the Typex machine.
 *
 * Tested against a genuine Typex machine using a variety of inputs
 * and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import {LETTERS, Reflector} from "../lib/Enigma.mjs";
import {ROTORS, REFLECTORS, TypexMachine, Plugboard, Rotor} from "../lib/Typex.mjs";

/**
 * Typex operation
 */
class Typex extends Operation {
    /**
     * Typex constructor
     */
    constructor() {
        super();

        this.name = "Typex";
        this.module = "Bletchley";
        this.description = "使用二战时期的 Typex 密码机进行加/解密。<br><br>Typex 最初由英国皇家空军在二战前制造，基于 Enigma 并进行了改进，包括使用五个具有更多步进点且可更换接线内核的转子。它被广泛用于英国及英联邦军队。后来出现了多个变体；此处模拟的是二战时期的 Typex Mark 22，并为反射器与输入提供插线板。Typex 转子经常更换且未公开：此处提供一组随机示例。<br><br>配置反射器插线板时，在反射器输入框内输入成对连接的字母字符串，例如：<code>AB CD EF</code> 表示 A 连接到 B，C 连接到 D，E 连接到 F（需要连接全部字母）。此外还提供输入插线板：与 Enigma 的插线板不同，它不限制为成对，因此其输入方式类似于转子（无步进）。要自定义转子，请按顺序输入该转子将 A 到 Z 映射到的字母，后可选地接 <code>&lt;</code> 与步进点列表。<br><br>关于 Enigma、Typex 与 Bombe 的更详细说明请参见 <a href='https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex'>此页面</a>。";
        this.infoURL = "https://wikipedia.org/wiki/Typex";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "第 1（左侧）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 1 转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第 1 转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 1 转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 2 转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "第 2 转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第 2 转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 2 转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 3（中间）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 2
            },
            {
                name: "第 3 转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第 3 转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 3 转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 4（静态）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 3
            },
            {
                name: "第 4 转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第 4 转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 4 转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 5（右侧，静态）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 4
            },
            {
                name: "第 5 转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第 5 转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 5 转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "反射器",
                type: "editableOption",
                value: REFLECTORS
            },
            {
                name: "插线板",
                type: "string",
                value: ""
            },
            {
                name: "Typex 键盘仿真",
                type: "option",
                value: ["None", "Encrypt", "Decrypt"]
            },
            {
                name: "严格输出",
                hint: "Remove non-alphabet letters and group output",
                type: "boolean",
                value: true
            },
        ];
    }

    /**
     * Helper - for ease of use rotors are specified as a single string; this
     * method breaks the spec string into wiring and steps parts.
     *
     * @param {string} rotor - Rotor specification string.
     * @param {number} i - For error messages, the number of this rotor.
     * @returns {string[]}
     */
    parseRotorStr(rotor, i) {
        if (rotor === "") {
            throw new OperationError(`Rotor ${i} must be provided.`);
        }
        if (!rotor.includes("<")) {
            return [rotor, ""];
        }
        return rotor.split("<", 2);
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const reflectorstr = args[20];
        const plugboardstr = args[21];
        const typexKeyboard = args[22];
        const removeOther = args[23];
        const rotors = [];
        for (let i=0; i<5; i++) {
            const [rotorwiring, rotorsteps] = this.parseRotorStr(args[i*4]);
            rotors.push(new Rotor(rotorwiring, rotorsteps, args[i*4 + 1], args[i*4+2], args[i*4+3]));
        }
        // Rotors are handled in reverse
        rotors.reverse();
        const reflector = new Reflector(reflectorstr);
        let plugboardstrMod = plugboardstr;
        if (plugboardstrMod === "") {
            plugboardstrMod = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        const plugboard = new Plugboard(plugboardstrMod);
        if (removeOther) {
            if (typexKeyboard === "Encrypt") {
                input = input.replace(/[^A-Za-z0-9 /%£()',.-]/g, "");
            } else {
                input = input.replace(/[^A-Za-z]/g, "");
            }
        }
        const typex = new TypexMachine(rotors, reflector, plugboard, typexKeyboard);
        let result = typex.crypt(input);
        if (removeOther && typexKeyboard !== "Decrypt") {
            // Five character cipher groups is traditional
            result = result.replace(/([A-Z]{5})(?!$)/g, "$1 ");
        }
        return result;
    }

    /**
     * Highlight Typex
     * This is only possible if we're passing through non-alphabet characters.
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        if (args[18] === false) {
            return pos;
        }
    }

    /**
     * Highlight Typex in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        if (args[18] === false) {
            return pos;
        }
    }

}

export default Typex;
