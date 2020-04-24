import React from "react"

interface ISearchItem {
    column: string,
    isSearching: boolean,
    searchString: string
}

export default class SearchDecorator extends React.Component {
    public render(){
        return (
            <React.Fragment>
                <div><span style={{display:"inline-block"}}>{this.props.children}<span style={{display:"inline-block"}}>
                    S</span></span></div>
                <div><span><input type="text"></input> x</span></div>
            </React.Fragment>
        );
    }
}
