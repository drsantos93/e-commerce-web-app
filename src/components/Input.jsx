import {forwardRef} from "react"
import {TextField} from "@mui/material"

const CustomInput = forwardRef(function CustomInput(props, inputRef){
    return (
        <TextField inputRef={inputRef} {...props}  />
    )
})

export default CustomInput