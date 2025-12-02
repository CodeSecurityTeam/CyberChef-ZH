/**
 * Emulation of the Bombe machine.
 *
 * Tested against the Bombe Rebuild at Bletchley Park's TNMOC
 * using a variety of inputs and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";
import { BombeMachine } from "../lib/Bombe.mjs";
import { ROTORS, ROTORS_FOURTH, REFLECTORS, Reflector } from "../lib/Enigma.mjs";

/**
 * Bombe operation
 */
class Bombe extends Operation {
    /**
     * Bombe constructor
     */
    constructor() {
        super();

        this.name = "Bombe";
        this.module = "Bletchley";
        this.description = "基于波兰和英国密码分析专家的研究成果，本程序模拟了布莱切利庄园用于攻击恩尼格玛密码机的Bombe机器。<br><br>运行此程序需要您提供一个“线索”（crib），即目标密文的一部分的已知明文，以及所使用的转子。（如果您不知道转子，请参阅“Bombe（多次运行）”操作。）该机器会给出恩尼格玛密码机的可能配置。每个建议都包含转子起始位置（从左到右）和已知的插线板对。<br><br>选择线索：首先，请注意恩尼格玛密码机无法将字母加密到自身，这允许您排除一些可能的线索位置。其次，Bombe程序无法模拟恩尼格玛密码机的中间转子步进。您的线索越长，其中发生步进的可能性就越大，这将阻止攻击成功。但是，除此之外，更长的线索通常更好。攻击会生成一个将密文字母映射到明文的“菜单”，目标是生成“循环”：例如，对于密文 ABC 和 crib CAB，我们得到映射 A<->C、B<->A 和 C<->B，从而生成循环 A-B-C-A。循环越多，crib 的效果越好。操作会输出以下内容：如果你的菜单循环太少或太短，通常会产生大量错误输出。尝试使用不同的 crib。如果菜单看起来不错，但没有生成正确答案，则可能是你的 crib 有误，或者你可能重叠了中间转子的步进——尝试使用不同的 crib。<br><br>输出不足以完全解密数据。你必须通过检查来恢复插线板的其余设置。此外，环的位置未被考虑在内：这会影响中间转子的步进时间。如果输出一开始正确，然后出现错误，请同时调整右侧转子上的环和起始位置，直到输出改善。如有必要，对中间转子重复此操作。<br><br>默认情况下，此操作会在每次停止时运行检查机（一个用于验证 Bombe 停止质量的手动过程），并丢弃不合格的停止。如果您想查看硬件对于给定输入实际停止的次数，请禁用检查机。<br><br>有关 Enigma、Typex 和 Bombe 操作的更详细说明，请参阅<a href='https://github.com/gchq/Cyber​​Chef/wiki/Enigma,-the-Bombe,-and-Typex'>此处</a>。</br>";
        this.infoURL = "https://wikipedia.org/wiki/Bombe";
        this.inputType = "string";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [
            {
                name: "Model",
                type: "argSelector",
                value: [
                    {
                        name: "3-rotor",
                        off: [1]
                    },
                    {
                        name: "4-rotor",
                        on: [1]
                    }
                ]
            },
            {
                name: "Left-most (4th) rotor",
                type: "editableOption",
                value: ROTORS_FOURTH,
                defaultIndex: 0
            },
            {
                name: "Left-hand rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "Middle rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "Right-hand rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 2
            },
            {
                name: "Reflector",
                type: "editableOption",
                value: REFLECTORS
            },
            {
                name: "Crib",
                type: "string",
                value: ""
            },
            {
                name: "Crib offset",
                type: "number",
                value: 0
            },
            {
                name: "Use checking machine",
                type: "boolean",
                value: true
            }
        ];
    }

    /**
     * Format and send a status update message.
     * @param {number} nLoops - Number of loops in the menu
     * @param {number} nStops - How many stops so far
     * @param {number} progress - Progress (as a float in the range 0..1)
     */
    updateStatus(nLoops, nStops, progress) {
        const msg = `Bombe run with ${nLoops} loop${nLoops === 1 ? "" : "s"} in menu (2+ desirable): ${nStops} stops, ${Math.floor(100 * progress)}% done`;
        self.sendStatusMessage(msg);
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const model = args[0];
        const reflectorstr = args[5];
        let crib = args[6];
        const offset = args[7];
        const check = args[8];
        const rotors = [];
        for (let i=0; i<4; i++) {
            if (i === 0 && model === "3-rotor") {
                // No fourth rotor
                continue;
            }
            let rstr = args[i + 1];
            // The Bombe doesn't take stepping into account so we'll just ignore it here
            if (rstr.includes("<")) {
                rstr = rstr.split("<", 2)[0];
            }
            rotors.push(rstr);
        }
        // Rotors are handled in reverse
        rotors.reverse();
        if (crib.length === 0) {
            throw new OperationError("Crib cannot be empty");
        }
        if (offset < 0) {
            throw new OperationError("Offset cannot be negative");
        }
        // For symmetry with the Enigma op, for the input we'll just remove all invalid characters
        input = input.replace(/[^A-Za-z]/g, "").toUpperCase();
        crib = crib.replace(/[^A-Za-z]/g, "").toUpperCase();
        const ciphertext = input.slice(offset);
        const reflector = new Reflector(reflectorstr);
        let update;
        if (isWorkerEnvironment()) {
            update = this.updateStatus;
        } else {
            update = undefined;
        }
        const bombe = new BombeMachine(rotors, reflector, ciphertext, crib, check, update);
        const result = bombe.run();
        return {
            nLoops: bombe.nLoops,
            result: result
        };
    }


    /**
     * Displays the Bombe results in an HTML table
     *
     * @param {Object} output
     * @param {number} output.nLoops
     * @param {Array[]} output.result
     * @returns {html}
     */
    present(output) {
        let html = `Bombe run on menu with ${output.nLoops} loop${output.nLoops === 1 ? "" : "s"} (2+ desirable). Note: Rotor positions are listed left to right and start at the beginning of the crib, and ignore stepping and the ring setting. Some plugboard settings are determined. A decryption preview starting at the beginning of the crib and ignoring stepping is also provided.\n\n`;
        html += "<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>Rotor stops</th>  <th>Partial plugboard</th>  <th>Decryption preview</th></tr>\n";
        for (const [setting, stecker, decrypt] of output.result) {
            html += `<tr><td>${setting}</td>  <td>${stecker}</td>  <td>${decrypt}</td></tr>\n`;
        }
        html += "</table>";
        return html;
    }
}

export default Bombe;
