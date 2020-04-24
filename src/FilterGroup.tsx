import React,{ useContext, useState } from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import './Filters.scss';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const  moment =  require('moment');
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

  

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#f4895e',
            main: '#F26C36',
            dark: '#a94b25',
            contrastText: '#333333',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    }, typography: {
        fontSize: 13
        , fontFamily: [
            'Helvetica Neue',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    }
});

function getValueFromPath(path:string[],element:any){
    let currValue = element;
    for(let node of path){
        currValue = currValue[node];
        if(currValue === undefined){
            return undefined;
        }
    }
    return currValue
}
function validateRecord(record:any,filterValues:IFilterValues,indexPath:Map<string,string[]>):boolean{
    for (let entry of Array.from(indexPath.entries())) {
        let filterIndex = entry[0];
        let path = entry[1];
        let filterElement = filterValues.values.get(filterIndex);
        let elementType = filterElement?.element.elementType
        let fieldValue = getValueFromPath(path,record);
        console.log(filterElement?.values)
        if(filterElement && filterElement.values && filterElement.values.length >=1){
            switch(elementType){
                case FilterElementType.Check:
                    if(fieldValue !== filterElement.values[0]){
                        return false;
                    }
                    break;
                case FilterElementType.TextSearch:
                    if(!(fieldValue && fieldValue.toLowerCase().includes(filterElement.values[0].toLowerCase()))){
                        return false;
                    }
                    break;
                case FilterElementType.Select:
                    
                    if(!filterElement.values.includes(fieldValue)){
                        return false;
                    }
                    break;
                case FilterElementType.NumberRange:
                    if(fieldValue < filterElement.values[0] || (filterElement.values.length > 1 && fieldValue > filterElement.values[1])){
                        return false;
                    }
                break;
                case FilterElementType.DateRange:
                    let firstValue = moment(filterElement.values[0]);
                    if(moment(fieldValue) < firstValue || (filterElement.values.length > 1
                        && moment(fieldValue) > moment(filterElement.values[2]))){
                            return false;
                        }
                break;
                default:
                    continue;
            }
        }
    }
    return true;
}

export function filterData(filterValues:IFilterValues,data:any[],indexPath:Map<string,string[]>):any[]{  
    return data.filter(
        record => validateRecord(record,filterValues,indexPath)
    );
}

export interface IUMFilterGroupProps{
    filterElements: IFilterElement[],
    index:string,
    onChange?:(filterValues:IFilterValues)=>void,
    onApply?:(filterValues:IFilterValues)=>void
}

export enum FilterElementType{
    TextSearch,
    DateRange,
    NumberRange,
    Check,
    Select
}

export interface ISelectElement{
    id:string,
    value:string
}

export interface IFilterElement{
    index:string,
    label:string,
    elementType:FilterElementType,
    defaultValues?:any[],
    selectValues?:ISelectElement[]
}
export interface IFilterValue{
    element:IFilterElement,
    values?:any[]
}

export interface IFilterValues{
    values : Map<string,IFilterValue>
}

interface IFilterElementProps{
    element:IFilterElement,
    values:any[] | undefined,
    onChange:(values:any[],element:IFilterElement)=>void
}

function FilterElement(props:IFilterElementProps){
    let value = props.values && props.values.length >0? props.values[0] : undefined;
    switch(props.element.elementType){
        case FilterElementType.TextSearch:
            return  (<TextField id="standard-basic" label={props.element.label} 
            onChange={(e)=>{
                props.onChange([e.target.value],props.element);
            }}
            defaultValue={value? value : ""} placeholder={props.element.label} />)
        case FilterElementType.Check:
            return (
                <React.Fragment>
                     <FormControlLabel
                            control={
                            <Checkbox onChange={(e)=>{
                            props.onChange([e.target.checked],props.element);
                        }}  defaultChecked={value?value : false}/>
                    }
                    label="Primary"
                />
                </React.Fragment>
            )
        case FilterElementType.Select:
            let seletedItems = props.element.selectValues ? props.element.selectValues : [];
            return (
                <React.Fragment>
                    <FormControl>
            <InputLabel id="demo-simple-select-label">{props.element.label}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                onChange={(e)=>{
                                    let value = (e.target.value as string);
                                    props.onChange([value],props.element)
                                }}
                            >
                                {
                                    seletedItems.map(selectItem=>
                                    <MenuItem value={selectItem.id}>{selectItem.value}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                </React.Fragment>
            )
        case FilterElementType.DateRange:
            return (
                <React.Fragment>
                    <TextField
                    id="date"
                    label={props.element.label}
                    type="date"
                    //defaultValue="2017-05-24"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={(e)=>{
                        props.onChange([e.target.value],props.element);
                    }}
                />
                </React.Fragment>
                
            )
        default:
            return (<h1>
                Elementtype not implemented
            </h1>)
    }
}

export default function UMFilterGroup(props:IUMFilterGroupProps){
    
    let defaultValues:Map<string,IFilterValue> = new Map<string,IFilterValue>();
    props.filterElements.forEach(filterElement=>{
        defaultValues.set(filterElement.index,{element:filterElement,values:filterElement.defaultValues});
    });
    const [filterValues,setFilterValues] = useState<IFilterValues>({values:defaultValues});

    function onChange(values:any[],element:IFilterElement){
        let filterPrev = filterValues;
        filterPrev.values.set(element.index,{element:element,values:values});
        setFilterValues(filterPrev);
        if(props.onChange){
            props.onChange(filterPrev);
        }
    }
    const classes = useStyles();
    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
            <div className="filterContainer">
            <div className="filterLabel">
                    Filter <i className="material-icons">keyboard_arrow_down</i>
                </div>
                <div className="filterList">
                        {props.filterElements.map(filterElement=><div className="filter"><FilterElement 
                    element={filterElement} 
                    values={filterValues.values.get(filterElement.index)?.values} 
                    onChange={onChange} ></FilterElement></div>)}
                </div>
            </div>
            
            </div>
        </ThemeProvider>
        
    )
}