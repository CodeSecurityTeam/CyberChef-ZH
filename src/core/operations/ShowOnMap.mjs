/**
 * @author j433866 [j433866@gmail.com]
 * @author 0xff1ce [github.com/0xff1ce]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {FORMATS, convertCoordinates} from "../lib/ConvertCoordinates.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Show on map operation
 */
class ShowOnMap extends Operation {

    /**
     * ShowOnMap constructor
     */
    constructor() {
        super();

        this.name = "Show on map";
        this.module = "Hashing";
        this.description = "在可滑动地图上显示坐标。<br><br>坐标将在显示前转换为十进制度数。<br><br>支持格式：<ul><li>度-分-秒（DMS）</li><li>度-十进制分（DDM）</li><li>十进制度数（DD）</li><li>Geohash</li><li>军事方格参考系统（MGRS）</li><li>英国国家测绘网格（OSNG）</li><li>通用横轴墨卡托投影（UTM）</li></ul><br>此操作在离线环境下无法工作。";
        this.infoURL = "https://osmfoundation.org/wiki/Terms_of_Use";
        this.inputType = "string";
        this.outputType = "string";
        this.presentType = "html";
        this.args = [
            {
                name: "缩放级别",
                type: "number",
                value: 13
            },
            {
                name: "输入格式",
                type: "option",
                value: ["Auto"].concat(FORMATS)
            },
            {
                name: "输入分隔符",
                type: "option",
                value: [
                    "Auto",
                    "Direction Preceding",
                    "Direction Following",
                    "\\n",
                    "Comma",
                    "Semi-colon",
                    "Colon"
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.replace(/\s+/g, "") !== "") {
            const inFormat = args[1],
                inDelim = args[2];
            let latLong;
            try {
                latLong = convertCoordinates(input, inFormat, inDelim, "Decimal Degrees", "Comma", "None", 5);
            } catch (error) {
                throw new OperationError(error);
            }
            latLong = latLong.replace(/[,]$/, "");
            latLong = latLong.replace(/°/g, "");
            return latLong;
        }
        return input;
    }

    /**
     * @param {string} data
     * @param {Object[]} args
     * @returns {string}
     */
    async present(data, args) {
        if (data.replace(/\s+/g, "") === "") {
            data = "0, 0";
        }
        const zoomLevel = args[0];
        const tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            tileAttribution = "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            leafletUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
            leafletCssUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        return `<link rel="stylesheet" href="${leafletCssUrl}" crossorigin=""/>
<style>
    #output-text .cm-content,
    #output-text .cm-line,
    #output-html {
        padding: 0;
        white-space: normal;
    }
</style>
<div id="presentedMap" style="width: 100%; height: 100%;"></div>
<script type="text/javascript">
var mapscript = document.createElement('script');
document.body.appendChild(mapscript);
mapscript.onload = function() {
    var presentMap = L.map('presentedMap').setView([${data}], ${zoomLevel});
    L.tileLayer('${tileUrl}', {
        attribution: '${tileAttribution}'
    }).addTo(presentMap);

    L.marker([${data}]).addTo(presentMap)
        .bindPopup('${data}')
        .openPopup();
};
mapscript.src = "${leafletUrl}";
</script>`;
    }
}

export default ShowOnMap;
