import React from 'react';
import { IoNotifications } from "react-icons/io5";
import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
  } from "@chakra-ui/menu";


const Notification = ({notification}) => {
  console.log("notfication", notification );
  
  return (
    <div>
        <Menu>
            <MenuButton>
                <IoNotifications />
            </MenuButton>
            <MenuList pl={2}>
              {!notification && "No new messages"}
              
                <MenuItem></MenuItem>
          </MenuList>
        </Menu>
      
    </div>
  )
}

export default Notification
