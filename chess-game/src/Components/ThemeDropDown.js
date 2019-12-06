import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import {Dropdown} from 'semantic-ui-react'
import {Themes} from "./Square"

/*
    DOCUMENTATION FOR DROPDOWN SELECTOR
    https://react.semantic-ui.com/modules/dropdown/
 */

/*
    Adding Themes:
    1. Add images to Assets folder
    2. import all of the images in the Square.js file
    3. add switch case for those files in determineImage() in Square.js
    4. add enum for it in Square.js
    5. add theme in themeOptions below
 */

const ThemeDropDown = (props) => {

    //handles the selection
    function handleChange(event, data) {
        props.setFunc(themeOptions[data.value].value)
    }

    //List of themes
    const themeOptions = [
        {
            text: "Traditional",
            value: Themes.TRADITIONAL
        },
        {
            text: "Dogs vs Cats",
            value: Themes.DOGSandCATS
        }
    ];

    //renders dropdown
    return (
        <div>
            <Dropdown
                placeholder='THEME SELECTOR'
                selection
                options={themeOptions}
                onChange={handleChange}
            />
        </div>
    )

};

export default ThemeDropDown;