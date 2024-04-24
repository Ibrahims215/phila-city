import { useActiveViewport } from "@itwin/appui-react";
import React, { useEffect } from "react";
import RealityDataApi from "./RealityDataApi";
import "./MyFirstWidget.css";
import { Button, Flex, ToggleSwitch } from "@itwin/itwinui-react";
import { ColorDef, ContextRealityModelProps } from "@itwin/core-common";
import { ColorPickerButton } from "@itwin/imodel-components-react";
export const MyFirstWidget: React.FC = () => {
  const viewport = useActiveViewport();

 
  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [realitonyModels, setRealityModelList] = React.useState<ContextRealityModelProps[]>([]);
  const [classicfier, setClassifier] = React.useState<string>("");
  const [listOfThings, setlistOfThings] = React.useState<string[]>([]) 
  const [hiliteColor, setHiliteColor] = React.useState<ColorDef>(ColorDef.green
  );
  
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

  const buttonClicked = async () => {
    setlistOfThings([...listOfThings, "Purple"])


  }
  const removeTop= async () => {
    setlistOfThings(listOfThings.slice(1))


  }
  const onColorChange = async (newColor: ColorDef) => {
    if (viewport) {
      viewport.hilite = {...viewport.hilite, color: newColor};
    }  
    setHiliteColor (newColor)
  }


  async function clickButton() {
    setlistOfThings([...listOfThings, "bip"]);


  }

  const thingList = listOfThings.map((thing: string) => <li>{thing}</li>);
  return (

    
    <div>
      This is my first widget, hello I'm Ibrahim 
      <ToggleSwitch onChange={togglePhillyReality} label='Philly Reality Data' />
      <p></p>
      <Flex>
      <ColorPickerButton initialColor={hiliteColor} onColorPick={onColorChange}></ColorPickerButton> 
       Select hilite color 
       </Flex>
      <p></p>
      <Button onClick={buttonClicked}>Money</Button>
      <Button onClick={clickButton}>Green</Button>
      <Button onClick={removeTop}>delete</Button>
      
      <ul>
        {thingList}
      </ul>
    </div>
  );
};

