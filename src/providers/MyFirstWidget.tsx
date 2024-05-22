import { useActiveViewport } from "@itwin/appui-react";
import React, { useEffect } from "react";
import RealityDataApi from "./RealityDataApi";
import "./MyFirstWidget.css";
import { Button, Flex, ToggleSwitch } from "@itwin/itwinui-react";
import { ColorDef, ContextRealityModelProps } from "@itwin/core-common";
import { ColorPickerButton } from "@itwin/imodel-components-react";
import { Id64Array } from "@itwin/core-bentley";
import { BuildingGroup, BuildingGroupListItem } from "./BuildingGroupComponent";
export const MyFirstWidget: React.FC = () => {
  const viewport = useActiveViewport();

 
  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [realitonyModels, setRealityModelList] = React.useState<ContextRealityModelProps[]>([]);
  const [classicfier, setClassifier] = React.useState<string>("");
  const [listOfThings, setlistOfThings] = React.useState<string[]>([]) 
  const [hiliteColor, setHiliteColor] = React.useState<ColorDef>(ColorDef.green);
  const [selectedBuildings, setSelectedbuildings] = React. useState<BuildingGroup[]>([])
  
  useEffect(() => {
    const asyncInitialize = async () => {
      if (viewport) {
        const realityModels = await RealityDataApi.getRealityModels(viewport.iModel);
        setRealityModelList(realityModels);
        const classifiers = await RealityDataApi.getAvailableClassifierListForViewport(viewport);
        if(classifiers) {
          setClassifier(classifiers[0].value);
          onColorChange(ColorDef.green);
        }
      }
     
    };

    if (!initialized) {
      void asyncInitialize().then (() => { setInitialized(true);})
    }
  });

  const togglePhillyReality = async (e:React.ChangeEvent<HTMLInputElement>) => {
    if (viewport) {
      for (const model of realitonyModels) {
        if (model.name === "Philadelphia_2015") {
          RealityDataApi.toggleRealityModel(model, viewport, e.target.checked);
          RealityDataApi.setRealityDataClassifier(viewport, classicfier);
        }
      }
    }
  }

  const handleItemChange = (oldItem: BuildingGroup, newItem: BuildingGroup) => {
    const newList = selectedBuildings.map((item) => item.name === oldItem.name ? newItem : item);
    setSelectedbuildings(newList);
  }

  const buildingGroups: JSX.Element[] = []
  selectedBuildings.forEach( (value: BuildingGroup) => {
    buildingGroups.push(<BuildingGroupListItem item={value} handleItemChange={handleItemChange} />);
  });

const addNewGroup = async () => {
  const newSelectedBuildings = [...selectedBuildings,
    {name: "new"+ selectedBuildings.length, buildings: [], color: ColorDef.green}]
    setSelectedbuildings (newSelectedBuildings)
}

const buidingGrouplist = selectedBuildings.map (
  (bg: BuildingGroup) => <BuildingGroupListItem item={bg} handleItemChange={handleItemChange}/>
)
  
  
  async function onColorChange(newColor: ColorDef) {
    if (viewport) {
      viewport.hilite = { ...viewport.hilite, color: newColor };
    }
    setHiliteColor(newColor);
  }




  
  return (

    
    <div>
      This is my first widget, hello I'm Ibrahim 
      <ToggleSwitch onChange={togglePhillyReality} label='Philly Reality Data' />
      <p></p>
      <Flex>
      <ColorPickerButton initialColor={hiliteColor} onColorPick={onColorChange}></ColorPickerButton> 
       Select hilite color 
       </Flex>
       <Button onClick={addNewGroup}>Add New Group</Button>
       {buildingGroups}
    </div>
  );
};

function setHiliteColor(newColor: ColorDef) {
  throw new Error("Function not implemented.");
}

