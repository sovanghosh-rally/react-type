import React from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Search from "@material-ui/icons/Search";
import { createMuiTheme } from '@material-ui/core/styles';

export default function TextSearch() {
    return (
        <div>
            <TextField
                id="input-with-icon-textfield"
                label="Search Field"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    )
                }}
            />
        </div>
    );
}
