/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import Dish from "../Dish.mjs";
import MagicLib from "../lib/Magic.mjs";

/**
 * Magic operation
 */
class Magic extends Operation {

    /**
     * Magic constructor
     */
    constructor() {
        super();

        this.name = "Magic";
        this.flowControl = true;
        this.module = "Default";
        this.description = "Magic 操作尝试检测输入数据的各种属性，并建议哪些操作可以帮助更好地理解数据。<br><br><b>选项</b><br><u>深度：</u>如果某个操作似乎与数据匹配，它将被运行，结果将被进一步分析。该参数控制递归的最大层数。<br><br><u>强化模式：</u>当开启此模式时，将对各种操作（如 XOR、位旋转和字符编码）进行暴力破解，以尝试检测底层的有效数据。为提高性能，仅对数据的前 100 字节进行暴力破解。<br><br><u>扩展语言支持：</u>在每个阶段，数据的相对字节频率将与多种语言的平均频率进行比较。默认集合包含互联网上最常用的约 40 种语言。扩展列表包含 284 种语言，如果它们的字节频率相似，可能会导致许多语言与数据匹配。<br><br>可选地输入一个正则表达式来匹配您期望找到的字符串，以过滤结果（已知明文）。";
        this.infoURL = "https://github.com/gchq/CyberChef/wiki/Automatic-detection-of-encoded-data-using-CyberChef-Magic";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [
            {
                "name": "深度",
                "type": "number",
                "value": 3
            },
            {
                "name": "强化模式",
                "type": "boolean",
                "value": false
            },
            {
                "name": "扩展语言支持",
                "type": "boolean",
                "value": false
            },
            {
                "name": "已知明文（已知字符串或正则表达式）",
                "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @returns {Object} The updated state of the recipe.
     */
    async run(state) {
        const ings = state.opList[state.progress].ingValues,
            [depth, intensive, extLang, crib] = ings,
            dish = state.dish,
            magic = new MagicLib(await dish.get(Dish.ARRAY_BUFFER)),
            cribRegex = (crib && crib.length) ? new RegExp(crib, "i") : null;
        let options = await magic.speculativeExecution(depth, extLang, intensive, [], false, cribRegex);

        // Filter down to results which matched the crib
        if (cribRegex) {
            options = options.filter(option => option.matchesCrib);
        }

        // Record the current state for use when presenting
        this.state = state;

        dish.set(options, Dish.JSON);
        return state;
    }

    /**
     * Displays Magic results in HTML for web apps.
     *
     * @param {JSON} options
     * @returns {html}
     */
    present(options) {
        const currentRecipeConfig = this.state.opList.map(op => op.config);

        let output = `<table
                class='table table-hover table-sm table-bordered'
                style='table-layout: fixed;'>
            <tr>
                <th>Recipe (click to load)</th>
                <th>Result snippet</th>
                <th>Properties</th>
            </tr>`;

        /**
         * Returns a CSS colour value based on an integer input.
         *
         * @param {number} val
         * @returns {string}
         */
        function chooseColour(val) {
            if (val < 3) return "green";
            if (val < 5) return "goldenrod";
            return "red";
        }

        options.forEach(option => {
            // Construct recipe URL
            // Replace this Magic op with the generated recipe
            const recipeConfig = currentRecipeConfig.slice(0, this.state.progress)
                    .concat(option.recipe)
                    .concat(currentRecipeConfig.slice(this.state.progress + 1)),
                recipeURL = "recipe=" + Utils.encodeURIFragment(Utils.generatePrettyRecipe(recipeConfig));

            let language = "",
                fileType = "",
                matchingOps = "",
                useful = "";
            const entropy = `<span data-toggle="tooltip" data-container="body" title="Shannon Entropy is measured from 0 to 8. High entropy suggests encrypted or compressed data. Normal text is usually around 3.5 to 5.">Entropy: <span style="color: ${chooseColour(option.entropy)}">${option.entropy.toFixed(2)}</span></span>`,
                validUTF8 = option.isUTF8 ? "<span data-toggle='tooltip' data-container='body' title='The data could be a valid UTF8 string based on its encoding.'>Valid UTF8</span>\n" : "";

            if (option.languageScores[0].probability > 0) {
                let likelyLangs = option.languageScores.filter(l => l.probability > 0);
                if (likelyLangs.length < 1) likelyLangs = [option.languageScores[0]];
                language = "<span data-toggle='tooltip' data-container='body' title='Based on a statistical comparison of the frequency of bytes in various languages. Ordered by likelihood.'>" +
                    "Possible languages:\n    " +
                    likelyLangs.map(lang => {
                        return MagicLib.codeToLanguage(lang.lang);
                    }).join("\n    ") +
                    "</span>\n";
            }

            if (option.fileType) {
                fileType = `<span data-toggle="tooltip" data-container="body" title="Based on the presence of magic bytes.">File type: ${option.fileType.mime} (${option.fileType.ext})</span>\n`;
            }

            if (option.matchingOps.length) {
                matchingOps = `Matching ops: ${[...new Set(option.matchingOps.map(op => op.op))].join(", ")}\n`;
            }

            if (option.useful) {
                useful = "<span data-toggle='tooltip' data-container='body' title='This could be an operation that displays data in a useful way, such as rendering an image.'>Useful op detected</span>\n";
            }

            output += `<tr>
                <td><a href="#${recipeURL}">${Utils.generatePrettyRecipe(option.recipe, true)}</a></td>
                <td>${Utils.escapeHtml(Utils.escapeWhitespace(Utils.truncate(option.data, 99)))}</td>
                <td>${language}${fileType}${matchingOps}${useful}${validUTF8}${entropy}</td>
            </tr>`;
        });

        output += "</table><script type='application/javascript'>$('[data-toggle=\"tooltip\"]').tooltip()</script>";

        if (!options.length) {
            output = "Nothing of interest could be detected about the input data.\nHave you tried modifying the operation arguments?";
        }

        return output;
    }

}

export default Magic;
