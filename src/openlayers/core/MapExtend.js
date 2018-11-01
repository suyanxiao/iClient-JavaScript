/* Copyright© 2000 - 2018 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import ol from 'openlayers';

/**
 * @function MapExtend
 * @description 扩展 OpenLayers 的一些原始方法。
 * @private
 */
export var MapExtend = function () {
    ol.Map.prototype.forEachFeatureAtPixelDefault = ol.Map.prototype.forEachFeatureAtPixel;

    ol.Map.prototype.forEachFeatureAtPixel= ol.Map.prototype.Tc = function (pixel, callback, opt_options, e) {

        //如果满足高效率图层选取要求优先返回高效率图层选中结果
        const layerFilter = (opt_options && opt_options.layerFilter) ? opt_options.layerFilter : () => {
            return true;
        };

        const layers = this.getLayers().getArray();
        const resolution = this.getView().getResolution();
        const coordinate = this.getCoordinateFromPixel(pixel);
        for (let i = 0; i < layers.length; i++) {
            //当前高效率点图层满足筛选条件/并且可视时，可被选中：
            if (layers[i].getVisible() && layerFilter.call(null, layers[i]) && layers[i].getSource()._forEachFeatureAtCoordinate) {
                layers[i].getSource()._forEachFeatureAtCoordinate(coordinate, resolution, (feature) => {
                    callback(feature, layers[i])
                }, pixel, e);
            }
        }
        return this.forEachFeatureAtPixelDefault(pixel, callback, opt_options);
    }
}();