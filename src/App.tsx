import React,{useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Button,Container} from "@rally/starship-components-srihari";
import StarshipTable, {IColumn} from './StarshipTable';
import SearchDecorator from "./SearchDecorator";
import UMTable,{IColumn as IUmColumn, UmTableContext, IUmTableContext,ITableSortClassContext} from './UmTable';
import './UmTablecss.scss';
import UMFilterGroup, { IFilterElement,FilterElementType } from './FilterGroup';
import {BenefitApiMock} from './services/BenefitApiMock';
import {BenefitApiInterface,UserBenefitsResponse,BenefitApi} from './services/api';
import BenefitsController from './BenefitsController';
const data = [{
    "id": 1,
    "first_name": "Jeanette",
    "last_name": "Penddreth",
    "email": "jpenddreth0@census.gov",
    "gender": "Female",
    "ip_address": "26.58.193.2"
}, {
    "id": 2,
    "first_name": "Giavani",
    "last_name": "Frediani",
    "email": "gfrediani1@senate.gov",
    "gender": "Male",
    "ip_address": "229.179.4.212"
}, {
    "id": 3,
    "first_name": "Noell",
    "last_name": "Bea",
    "email": "nbea2@imageshack.us",
    "gender": "Female",
    "ip_address": "180.66.162.255"
}, {
    "id": 4,
    "first_name": "Willard",
    "last_name": "Valek",
    "email": "wvalek3@vk.com",
    "gender": "Male",
    "ip_address": "67.76.188.26"
}];


function App() {
  let BenefitApiService: BenefitApiInterface = new BenefitApi();
  function typeTranform(value:any,row:any) {
  return (<h3>{value}</h3>);
  }

  function rowRender(row:any) {
    return (<div>
      <h1>{row.id}</h1>
      <h2>{row.type}</h2>
    </div>);
	}
  
  const [benefits,setBenefits] = useState<UserBenefitsResponse>()
  

	const umcolumns: IUmColumn[] = [{ "title": "Id", "index": "id", isSortable: true },
    { "title": "First Name", "index": "first_name", "render": typeTranform},
    { "title": "Last Name", "index": "last_name", isSortable: true },
    { "title": "Email", "index": "email", isSortable: true },
    { "title": "Gender", "index": "gender" },
	{ "title": "IP Address", "index": "ip_address" }]
	 const ummTableContextdata :IUmTableContext = {
	 tableCalsses:"UmTable starshipTable",
	sortClasses:{
		dafaulSort:"UmTh-Sort",
		sortasc:"UmTh-sort-ascent",
		sortdesc:"UmTh-sort-descent"
	}
  }

  

  return (
    <div className="App">
      <UmTableContext.Provider value={ummTableContextdata}>
	  	<BenefitsController benfitService={BenefitApiService}></BenefitsController>
	  </UmTableContext.Provider>	  
    </div>


  );
}

export default App;
