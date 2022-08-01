/*
 * Copyright 2019 Esri
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { property, subclass } from "esri/core/accessorSupport/decorators";
import Graphic from "esri/Graphic";
import PolygonSymbol3D from "esri/symbols/PolygonSymbol3D";
import { tsx } from "esri/widgets/support/widget";

import DrawWidget from "./DrawWidget";


const BUILDING_COLOR = "#FFFFFF";
const BUILDING_FLOOR_HEIGHT = 3;

@subclass("app.draw.CreateBuilding")
export default class CreateBuilding extends DrawWidget {

  @property()
  private color: string;

  public postInitialize() {
    this.layer.elevationInfo = {
      mode: "on-the-ground",
    };
  }

  public render() {
    const inactive = "btn btn-large";
    const active = inactive + " active";
    return (
      <div>
        <div class="menu">
          Stories
          <select class="menu-item" id='selectStories'>
          {Array.from(Array(200), (_, index) => index + 1).map((i)=> (
            <option>{i}</option>
          ))}
          </select>
          {
          [{color:'green', label: 'Residential'}, {color:'blue', label: 'Commercial'}, {color:'yellow', label: "Mixed"}].map((buildingType) => (
            <div class="menu-item">
              <button
                class={this.color === buildingType.color? active : inactive}
                onclick={ this.startDrawing.bind(this, buildingType.color) }>{buildingType.label} Building</button>
            </div>
          )) }
        </div>
      </div>
    );
  }

  public updateGraphic(graphic: Graphic): Promise<Graphic[]> {
    return this.updatePolygonGraphic(graphic, BUILDING_COLOR);
  }

  private startDrawing(buildingColor:string) {

    var selectedStories = document.getElementById('selectStories') as HTMLSelectElement;

    const size = (selectedStories.selectedIndex+1) * BUILDING_FLOOR_HEIGHT;
    const color = buildingColor;

    const symbol = new PolygonSymbol3D({
      symbolLayers: [{
        type: "extrude",
        material: {
          color,
        },
        edges: {
          type: "solid",
          color: [100, 100, 100],
        },
        size,
      }] as any,
    });

    this.createPolygonGraphic(symbol, color).finally(() => {
      this.color = '';
    }).catch(() => {
      // Ignore
    });
    this.color = buildingColor;
  }

}
