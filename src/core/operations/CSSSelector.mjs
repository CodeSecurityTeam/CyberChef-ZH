/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import xmldom from "@xmldom/xmldom";
import nwmatcher from "nwmatcher";

/**
 * CSS selector operation
 */
class CSSSelector extends Operation {

    /**
     * CSSSelector constructor
     */
    constructor() {
        super();

        this.name = "CSS selector";
        this.module = "Code";
        this.description = "使用 CSS 选择器从 HTML 文档中提取信息";
        this.infoURL = "https://wikipedia.org/wiki/Cascading_Style_Sheets#Selector";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "CSS 选择器",
                "type": "string",
                "value": ""
            },
            {
                "name": "分隔符",
                "type": "binaryShortString",
                "value": "\\n"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [query, delimiter] = args,
            parser = new xmldom.DOMParser();
        let dom,
            result;

        if (!query.length || !input.length) {
            return "";
        }

        try {
            dom = parser.parseFromString(input);
        } catch (err) {
            throw new OperationError("Invalid input HTML.");
        }

        try {
            const matcher = nwmatcher({document: dom});
            result = matcher.select(query, dom);
        } catch (err) {
            throw new OperationError("Invalid CSS Selector. Details:\n" + err.message);
        }

        const nodeToString = function(node) {
            return node.toString();
            /* xmldom does not return the outerHTML value.
            switch (node.nodeType) {
                case node.ELEMENT_NODE: return node.outerHTML;
                case node.ATTRIBUTE_NODE: return node.value;
                case node.TEXT_NODE: return node.wholeText;
                case node.COMMENT_NODE: return node.data;
                case node.DOCUMENT_NODE: return node.outerHTML;
                default: throw new Error("Unknown Node Type: " + node.nodeType);
            }*/
        };

        return result
            .map(nodeToString)
            .join(delimiter);
    }

}

export default CSSSelector;
