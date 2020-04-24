import React, { useState, useContext } from 'react';
import Moment from 'react-moment';
import cx from 'classnames';

const  moment =  require('moment');

//Creating table context
export const UmTableContext = React.createContext<IUmTableContext>({});
export interface IUmTableContext{
    tableCalsses?:string,
    trheadClasses?:string,
    thClasses?:string,
    trClasses?:string,
    tdClasses?:string,
    sortClasses?:ITableSortClassContext
}
export interface ITableSortClassContext{
    dafaulSort?:string,
    sortasc:string,
    sortdesc:string
}


export interface IColumn{
    title: string | JSX.Element,
    index: string,
    render?: (value: any, row: any) => JSX.Element,
    isSortable?: boolean,
    colSpan?:number,
    classes?:string,
    timeFormat?:string
}
export interface ITableConfig{
    defaultsortColumn?:ISortColumn
}
export enum SortState {
    asc,
    desc,
    noSort
}
export interface ISortColumn{
    index:string,
    state:SortState,
    isTime?:boolean
}

export interface IUmTableProps{
    columns:IColumn[],
    data:any[],
    config?:ITableConfig
}

export default function UmTable(props:IUmTableProps){
    const tableContext = useContext(UmTableContext);
    const tabledata = [...props.data]
    //Sorting
    const sortDefault:string = tableContext.sortClasses && tableContext.sortClasses.dafaulSort ? tableContext.sortClasses.dafaulSort : "";
    const sortAsc:string= tableContext.sortClasses ? tableContext.sortClasses.sortasc : "";
    const sortDesc:string= tableContext.sortClasses ? tableContext.sortClasses.sortdesc : "";
    const defaultSortColumn:ISortColumn = props.config && props.config.defaultsortColumn ? 
                props.config.defaultsortColumn : {index:"",state:SortState.noSort};
    const [sortColumn,setSortColumn] = useState<ISortColumn>(defaultSortColumn);
    function getSortOrderClass(column:IColumn) {
        const sortClasses:string[] = [];
        if(column.index === sortColumn.index ){
            if(sortColumn.state == SortState.asc){
                sortClasses.push(sortAsc);
            }if(sortColumn.state == SortState.desc){
                sortClasses.push(sortDesc);
            }
        }
        return sortClasses;
    }
    function sortData(data:any[]):any[]{
        if (sortColumn.index==="" || SortState.noSort === sortColumn.state) {
            return props.data;
        } else {
            let sortResult = sortColumn.state === SortState.asc ? 1 : -1;
            return data.sort((a:any, b:any) => {
                if(sortColumn.isTime){
                    if (moment(a[sortColumn.index]).isAfter(b[sortColumn.index])){
                        return 1;
                      }
                      if (moment(a[sortColumn.index]).isBefore(b[sortColumn.index])) {
                        return -1
                      }
                      return 0
                }
                if (a[sortColumn.index] > b[sortColumn.index]) {
                    return sortResult;
                }
                if (a[sortColumn.index] < b[sortColumn.index]) {
                    return -(sortResult);
                }
                return 0
            }
            );
        }
    }
    function modifySort(column: IColumn) {
        let index = column.index;
        let newSortColumn:ISortColumn ={
            index:index,
            isTime:column.timeFormat ? true :false,
            state : SortState.asc
        } 
        if (index === sortColumn.index) {
            switch (sortColumn.state) {
                case SortState.asc: {
                    newSortColumn.state = SortState.desc;
                    break;
                }
                case SortState.desc: {
                    newSortColumn.state = SortState.noSort;
                    break;
                }
                case SortState.noSort: {
                    newSortColumn.state = SortState.asc;
                    break;
                }
            }
        } 
        setSortColumn(newSortColumn);
    }

    

    //Setting table header
    function TH(prop:{column:IColumn}){
        const classes = prop.column.classes ? prop.column.classes : ""
        
        return (
        <th className={classes} colSpan={prop.column.colSpan ? prop.column.colSpan : 1} >
            {
                prop.column.isSortable ? <span className={
                    cx(sortDefault,getSortOrderClass(prop.column))
                }
                
                onClick={()=>{
                    modifySort(prop.column);
                }}
                >{prop.column.title}</span> :
                prop.column.title
            }
            
        </th>
        );
    }

    //Setting table data
    function TD(prop:{column:IColumn,row:any}){
        let value =  prop.row[prop.column.index];
        return (
            <td colSpan={prop.column.colSpan ? prop.column.colSpan : 1}>
                {
                    prop.column.render ? prop.column.render(value,prop.row) : 
                prop.column.timeFormat ? <Moment format={prop.column.timeFormat}>{value}</Moment> : value
                }
            </td>       
        );
    }
    return (
        <table className={tableContext.tableCalsses ? tableContext.tableCalsses : ""}>
            <tr className={tableContext.trheadClasses ? tableContext.trheadClasses : ""}>
                {props.columns.map(column =>
                 <TH column={column}/>)}
            </tr>
            {
                sortData(tabledata).map(row=>
                    <tr className={tableContext.trClasses ? tableContext.trClasses : ""}>
                        {props.columns.map(column=>
                            <TD column={column} row={row}/>)}
                    </tr>)
            }
        </table>
    );
}