/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

/**
 * Render Markdown operation
 */
class RenderMarkdown extends Operation {

    /**
     * RenderMarkdown constructor
     */
    constructor() {
        super();

        this.name = "Render Markdown";
        this.module = "Code";
        this.description = "将输入的 Markdown 渲染为 HTML。为避免 XSS，禁用原生 HTML 渲染。";
        this.infoURL = "https://wikipedia.org/wiki/Markdown";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                name: "自动将 URL 转为链接",
                type: "boolean",
                value: false
            },
            {
                name: "启用语法高亮",
                type: "boolean",
                value: true
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const [convertLinks, enableHighlighting] = args,
            md = new MarkdownIt({
                linkify: convertLinks,
                html: false, // Explicitly disable HTML rendering
                highlight: function(str, lang) {
                    if (lang && hljs.getLanguage(lang) && enableHighlighting) {
                        try {
                            return hljs.highlight(lang, str).value;
                        } catch (__) {}
                    }

                    return "";
                }
            }),
            rendered = md.render(input);

        return `<div style="font-family: var(--primary-font-family)">${rendered}</div>`;
    }

}

export default RenderMarkdown;
