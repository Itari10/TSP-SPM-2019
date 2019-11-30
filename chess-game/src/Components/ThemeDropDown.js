import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import {Dropdown} from 'semantic-ui-react'
import {Themes} from "./Square"

/*
    DOCUMENTATION FOR DROPDOWN SELECTOR
    https://react.semantic-ui.com/modules/dropdown/
 */

const ThemeDropDown = (props) => {

    //handles the selection
    function handleChange(event, data) {
        let theme = {[data.name]: data.value}; //finds theme value from the selected
        props.setFunc(theme);
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