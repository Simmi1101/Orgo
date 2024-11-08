import React from "react";
import { TiGroup } from "react-icons/ti";
import Contacts from "./Contacts";


function GetAllContacts() {
    const handleClick = () => {
        
            <Contacts/>
        
    }
    console.log("clicked");
    
  return (
      <TiGroup onClick={()=>handleClick()}/>
  );
}

export default GetAllContacts

