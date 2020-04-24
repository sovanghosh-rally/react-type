import React from 'react';
import {BenefitApiInterface,UserBenefitsResponse,BenefitModel} from './services/api';
import UMTable,{IColumn as IUmColumn, UmTableContext, IUmTableContext,ITableSortClassContext} from './UmTable';
import UMFilterGroup, { IFilterElement,FilterElementType,filterData } from './FilterGroup';
export interface IBenefitControllerProps{
    benfitService:BenefitApiInterface
}
interface IBenefitControllerState{
    benefitresponse:UserBenefitsResponse,
    benefits:BenefitModel[]
}

export default class BenefitsController extends React.Component<IBenefitControllerProps,IBenefitControllerState> {
    
    constructor(props:IBenefitControllerProps){
        super(props)
        this.state={
            benefitresponse:{benefits:[]},
            benefits:[]
        }
        this.props.benfitService.getAllBenefits("hi").then(
            response=>{
                this.setState({benefitresponse:response.data});
            }
        )
    }
    public render(){
        const filterElements: IFilterElement[] = [
            { index:"isUHC",
              label:"For UHC",
              elementType:FilterElementType.Check},
              {
                index:"carrierName",
                label:"Carrier Name",
                elementType:FilterElementType.TextSearch
              },
              {
                index:"status",
                label:"status",
                elementType:FilterElementType.Select,
                selectValues:[
                    {
                        value:"Active",
                        id:"Active"
                    },
                    {
                        value:"InActive",
                        id:"InActive"
                    }
                ]
              },
              {
                index:"effectiveDate",
                label:"Effective Date",
                elementType:FilterElementType.DateRange
              }
          ]
        const indexPaths= new Map<string,string[]>();
        indexPaths.set("isUHC",["isUHC"]);
        indexPaths.set("carrierName",["carrierName"]);
        indexPaths.set("status",["status"]);
        indexPaths.set("effectiveDate",["effectiveDate"]);
        const benefitColumns:IUmColumn[] = [
            { "title": "coverageType", "index": "coverageType", isSortable: true },
            { "title": "carrierName", "index": "carrierName", isSortable: true },
            { "title": "benefitName", "index": "benefitName", isSortable: true },
            { "title": "groupNumber", "index": "groupNumber", isSortable: true },
        { "title": "isUHC", "index": "isUHC", isSortable: true,render:(value)=>(<span>{value?"UHC" :"Non UHC"}</span>)
            } ,
            { "title": "memberId", "index": "memberId", isSortable: true },
            { "title": "networkId", "index": "networkId", isSortable: true },
            { "title": "status", "index": "status", isSortable: true },
            { "title": "effectiveDate", "index": "effectiveDate", isSortable: true ,timeFormat:"MM/DD/YYYY"},
            { "title": "terminationDate", "index": "terminationDate", isSortable: true, timeFormat:"MM/DD/YYYY" },
            { "title": "lastUpdated", "index": "lastUpdated", isSortable: true ,  timeFormat:"MM/DD/YYYY hh:mm:ss" },
            { "title": "guestUrl", "index": "guestUrl", isSortable: true }
          ]
          
        return (
            <React.Fragment>
                <UMFilterGroup onChange={(filterValues)=>{
                    const filteredBenefits = filterData(filterValues,this.state.benefitresponse.benefits,indexPaths)
                    this.setState({benefits:filteredBenefits});
                }} filterElements={filterElements} index="samplefilter"></UMFilterGroup>
                <UMTable columns={benefitColumns} data={this.state.benefits} />
            </React.Fragment>
            
        )
    }
}