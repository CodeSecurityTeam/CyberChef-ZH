/**
 * @author mikecat
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Levenshtein Distance operation
 */
class LevenshteinDistance extends Operation {

    /**
     * LevenshteinDistance constructor
     */
    constructor() {
        super();

        this.name = "Levenshtein Distance";
        this.module = "Default";
        this.description = "莱文斯坦距离（亦称编辑距离）用于度量两个字符串的差异，统计将一个字符串变为另一个字符串所需的单字符操作次数（插入、删除、替换）。";
        this.infoURL = "https://wikipedia.org/wiki/Levenshtein_distance";
        this.inputType = "string";
        this.outputType = "number";
        this.args = [
            {
                name: "样本分隔符",
                type: "binaryString",
                value: "\\n"
            },
            {
                name: "插入代价",
                type: "number",
                value: 1
            },
            {
                name: "删除代价",
                type: "number",
                value: 1
            },
            {
                name: "替换代价",
                type: "number",
                value: 1
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {number}
     */
    run(input, args) {
        const [delim, insCost, delCost, subCost] = args;
        const samples = input.split(delim);
        if (samples.length !== 2) {
            throw new OperationError("Incorrect number of samples. Check your input and/or delimiter.");
        }
        if (insCost < 0 || delCost < 0 || subCost < 0) {
            throw new OperationError("Negative costs are not allowed.");
        }
        const src = samples[0], dest = samples[1];
        let currentCost = new Array(src.length + 1);
        let nextCost = new Array(src.length + 1);
        for (let i = 0; i < currentCost.length; i++) {
            currentCost[i] = delCost * i;
        }
        for (let i = 0; i < dest.length; i++) {
            const destc = dest.charAt(i);
            nextCost[0] = currentCost[0] + insCost;
            for (let j = 0; j < src.length; j++) {
                let candidate;
                // insertion
                let optCost = currentCost[j + 1] + insCost;
                // deletion
                candidate = nextCost[j] + delCost;
                if (candidate < optCost) optCost = candidate;
                // substitution or matched character
                candidate = currentCost[j];
                if (src.charAt(j) !== destc) candidate += subCost;
                if (candidate < optCost) optCost = candidate;
                // store calculated cost
                nextCost[j + 1] = optCost;
            }
            const tempCost = nextCost;
            nextCost = currentCost;
            currentCost = tempCost;
        }

        return currentCost[currentCost.length - 1];
    }

}

export default LevenshteinDistance;
