/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var mapIndex;
var mapIdexList;

function addMapSelector() {
    loadJSON('JSON/mapList.json', function(_mapIdexList) {
        mapIdexList = _mapIdexList.all;

        var mapSelector = addElement.tabCont('mapSelector', [], false);
        var mapSelectorBackground = addElement.rect('mapSelectorBackground', c.canvas.width/cScale - 180, 30, 150, 300);
        mapSelectorBackground.offColor = 'green';

        mapIdexList.forEach(function(map, i) {
            var mapButton = addElement.rect('MapButton-' + map.name, c.canvas.width/cScale - 165, 45 + i * 54, 120, 45);

            mapButton.offColor = 'blue';
            mapButton.onColor = 'red';
            mapButton.offBorder = 'black';
            mapButton.onBorder = 'yellow';
            mapButton.textColor = 'black';
            mapButton.text = mapIdexList[i].description;
            mapButton.textSize = 6;
            mapButton.isToggleable = true;
            mapButton.mapId = i;
            mapButton.onClick = function() {
                mapIndex = mapIdexList[mapButton.mapId];
            }
            mapSelector.addTab(mapButton.name);

            if (i == 0) {
                mapButton.onClick();
                mapButton.isOn = true;
            }

            var mapButtonTitle = addElement.rect('MapTitle-' + map.name, c.canvas.width/cScale - 165, 45 + i * 54, 120, 38);
            mapButtonTitle.offColor = null;
            mapButtonTitle.offBorder = null;
            mapButtonTitle.text = map.name;
            mapButtonTitle.textColor = 'black';
        });
        refresh();
    });
}