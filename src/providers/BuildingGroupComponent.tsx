import { Id64Array } from "@itwin/core-bentley";
import React from "react";
import { Button, Flex, ToggleSwitch } from "@itwin/itwinui-react"; 
import { useActiveViewport } from "@itwin/appui-react";
import { ColorPickerButton } from "@itwin/imodel-components-react";
import { ColorDef } from "@itwin/core-common";


export interface BuildingGroup {
    name: string;
    buildings: Id64Array;
    color: ColorDef
  }

  export interface GroupListItemProps {
    item: BuildingGroup;
    handleItemChange: (oldItem: BuildingGroup, newItem: BuildingGroup) => void;
  }

  export const BuildingGroupListItem: React.FC<GroupListItemProps> = ({
    item,
    handleItemChange,
  }: GroupListItemProps) => {
    const viewport = useActiveViewport();
    
    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
          const newItem = { ...item, name: e.target.value };
          handleItemChange(item, newItem);

      }
    
    const selectedSavedBuildings = async () => {
        if (viewport) {
          viewport.iModel.selectionSet.emptyAll();
          viewport.iModel.selectionSet.add(item.buildings);
          viewport.hilite = { ...viewport.hilite, color: item.color }
        }
      }

    const clearSavedBuilding = async () => {
        handleItemChange(item, {...item, buildings:[]});
        if (viewport) {
         viewport.iModel.selectionSet.emptyAll();
         viewport.iModel.selectionSet.add([]);
       }
       }

    const zoomBuilding = async () => {
        if (viewport) {
          viewport?.zoomToElements(item.buildings)
        }
      
      }

    function saveBuilding(): void {
        if (viewport?.iModel.selectionSet.isActive) { // If something is selected
          const newSelectedBuildings = [...item.buildings, ...viewport.iModel.selectionSet.elements]; // Merge the current saved selection with what is currently selected
          handleItemChange(item, {...item, buildings: newSelectedBuildings})
         
        }
      }

      async function onColorChange(newColor: ColorDef) {
        if (viewport) {
          viewport.hilite = { ...viewport.hilite, color: newColor };
        }
        handleItemChange(item,{...item, color:newColor}); 
      }

    return (
      <div>
         <input type="text" value={item.name} onChange={onNameChange} />
         <Button onClick={saveBuilding}>Save Selected Button</Button>
         <ColorPickerButton initialColor={item.color} onColorPick={onColorChange}></ColorPickerButton> 
         <Button onClick={selectedSavedBuildings}>Select Saved Buildings</Button>
         <Button onClick={clearSavedBuilding}> Clear Saved </Button>
         <Button onClick={zoomBuilding}> Zoom </Button>
      </div>
    )
  }
 



