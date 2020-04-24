import React, { useState } from 'react'
import { func, number } from 'prop-types';
import './index.css';
 
interface ITableProps {
    data: any[],
    columns: IColumn[],
    renderRowExpansion?: IRowExpander,
    keyColumn?: string
}
 
export interface IRowExpander {
    render: (row: any) => JSX.Element,
    isSingleRender?: boolean
}
 
export interface IColumn {
    title: string,
    index: string,
    render?: (value: any, row: any) => JSX.Element,
    isSearchable?: boolean
}
 
export default function StarshipTable(props: ITableProps) {
    enum SortState {
        asc,
        desc,
        noSort
    }
    const defaultSortColumn = {
        "column": "",
        "state": SortState.noSort
    };
 
    interface ISortColumn {
        column: string,
        state: SortState,
    }
 
    interface ISearchItem {
        column: string,
        isSearching: boolean,
        searchString: string
    }
 
    const defaultExpansion: number[] = [];
    const defaultSearchableColumns: ISearchItem[] = props.columns.filter(column => {
        return column.isSearchable;
    }).map(column => {
        return {
            column: column.index,
            isSearching: false,
            searchString: ""
        };
    });
 
    const [sortcolumn, setSortColumn] = useState<ISortColumn>(defaultSortColumn);
 
    const [rowexpansionIndexs, setExpansionIndex] = useState<number[]>(defaultExpansion);
 
   const [searchableColumns, setSearchableColumns] = useState<ISearchItem[]>(defaultSearchableColumns);
 
    const data = props.data.slice();
 
    function sortData(field: string) {
        if (field === defaultSortColumn.column || SortState.noSort === sortcolumn.state) {
            return props.data;
        } else {
            let sortResult = sortcolumn.state === SortState.asc ? 1 : -1;
            return data.sort((a, b) => {
                if (a[field] > b[field]) {
                    return sortResult;
                }
                if (a[field] < b[field]) {
                    return -(sortResult);
                }
                return 0
            }
            );
        }
    }
 
    function setSortColumnState(columnName: string) {
        if (columnName === sortcolumn.column) {
            switch (sortcolumn.state) {
                case SortState.asc: {
                    setSortColumn({ "column": columnName, "state": SortState.desc })
                    break;
                }
                case SortState.desc: {
                    setSortColumn({ "column": columnName, "state": SortState.noSort })
                    break;
                }
                case SortState.noSort: {
                    setSortColumn({ "column": columnName, "state": SortState.asc })
                    break;
                }
            }
        } else {
            setSortColumn({ "column": columnName, "state": SortState.asc })
        }
    }
 
    function getColumnTitle(column: IColumn) {
        if (column.index === sortcolumn.column) {
            switch (sortcolumn.state) {
                case SortState.asc: {
                    return <span>{column.title} &darr; </span>
                    break;
                }
                case SortState.desc: {
                    return <span>{column.title} &uarr; </span>
                    break;
                }
                case SortState.noSort: {
                    return <span>{column.title}</span>
                    break;
                }
            }
        }
        return <span>{column.title}</span>;
    }
 
    function getExpansionState(index: number) {
        if (rowexpansionIndexs.includes(index)) {
            // setExpansionIndex(rowexpansionIndexs.splice(rowexpansionIndexs.indexOf(index), 1));
            return (<span onClick={(e) => { setExpansionIndex(defaultExpansion) }}> - </span>);
        } else {
            // setExpansionIndex(rowexpansionIndexs.concat(index))
            return (<span onClick={() => { setExpansionIndex([index]) }}> + </span>);
        }
    }
    function createHeader(column: IColumn) {
        return (<th><div><span onClick={(e) => {
            setExpansionIndex(defaultExpansion);
            setSortColumnState(column.index);
        }}>{getColumnTitle(column)}</span>
            <span className="searchSymbol"> <span >&nbsp; &#9740;</span></span></div>
            {/* <div><input type="text"></input> X </div> */}
        </th>);
    }
 
    return (
        <div>
            <div className="title">Person's Information</div>
            <div className="starshipTableContainer">
                <table className="starshipTable">
                    <tr>
                        {props.columns.map(column =>
                            createHeader(column))}
 
                        {/* For + */}
                        <th></th>
                    </tr>
                    {sortData(sortcolumn.column).map((row, index) =>
                        <React.Fragment>
                            <tr>
                                {props.columns.map(column =>
                                    <td>{columnRender(column, row)}</td>)}
                                <td>
                                    {getExpansionState(index)}
                                </td>
                            </tr>
                            {rowExpander(row, index)}
                        </React.Fragment>
                    )}
                </table>
            </div>
        </div>
    )
    function columnRender(column: IColumn, row: any) {
        if (column.render) {
            return column.render(row[column.index], row);
        } else
            return row[column.index];
    }
    function rowExpander(row: any, index: number) {
        if (props.renderRowExpansion && rowexpansionIndexs.includes(index)) {
            return <tr><td colSpan={props.columns.length + 1} >{props.renderRowExpansion.render(row)}</td></tr>;
        } else
            return;
    }
}