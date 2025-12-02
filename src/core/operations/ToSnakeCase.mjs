/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import snakeCase from "lodash/snakeCase.js";
import Operation from "../Operation.mjs";
import { replaceVariableNames } from "../lib/Code.mjs";

/**
 * To Snake case operation
 */
class ToSnakeCase extends Operation {

    /**
     * ToSnakeCase constructor
     */
    constructor() {
        super();

        this.name = "To Snake case";
        this.module = "Code";
        this.description = "将输入字符串转换为蛇形命名。\n<br><br>\n蛇形命名整体为小写，使用下划线作为词边界。\n<br><br>\n例如：this_is_snake_case\n<br><br>\n'尝试上下文感知' 将使该操作尽量对变量和函数名进行友好转换。";
        this.infoURL = "https://wikipedia.org/wiki/Snake_case";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "尝试上下文感知",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const smart = args[0];

        if (smart) {
            return replaceVariableNames(input, snakeCase);
        } else {
            return snakeCase(input);
        }
    }
}

export default ToSnakeCase;
