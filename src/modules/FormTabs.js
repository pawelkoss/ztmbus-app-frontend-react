import React, { useRef, useState, useEffect } from 'react';
import { Tab } from 'semantic-ui-react';
//import useSignUpForm from './CustomHooks';


// komponent
const FormBusLine = ({ onInputChange, onHandleSubmit, onHandleSubmitBusStop, checkInput: busInput, ch, busStopInput})=> {

  // https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=f2e5503e927d-4ad3-9500-4ab9e55deb59&apikey=46657b26-69bc-489e-8985-e7e2c0422f72&type=2`, {mode: 'no-cors'})
//const distinct = (value, index, self) => self.indexOf(value) === index;
//const [ch, setCh] = useState([true, false]); 

const parseDistinct = (listTab) => {
    const lines = listTab.map((item)=> item.Lines);
    return [... new Set(lines)];
  }

const getAllBusesList =() => {
  let url = './../src/data/all-buses.json';
     fetch(url)
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(json => setListBus(parseDistinct(json.result))    )
    .catch(error => console.log("Input data error", error));
}
const getAllTramList =() => {
     let url = './../src/data/allTrams.json';
     fetch(url)
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(json => setListTram(parseDistinct(json.result))    )
    .catch(error => console.log("Input data error", error));
}

const inputHandler = (event)=>{
  //console.log("onInput z Form: " + busInput);
  
  //console.log(event.target.name);
};


const [btnDis, setBtnDis] = useState(true);
useEffect(()=>{
  //console.log(`useEffect, ${ch}, btnDis przed check: ${btnDis}, busInput:${busInput}`);
  if(ch[0]) { listBus.includes(busInput) ? setBtnDis(false) : setBtnDis(true);}
  if(ch[1]) { listTram.includes(busInput) ? setBtnDis(false) : setBtnDis(true); }
 //console.log(`ch: ${ch}, btnDis po check ${btnDis}`)
},[ch, busInput]);

const [listBus, setListBus] = useState([]);
const [listTram, setListTram] = useState([]);
useEffect(() => {
    getAllBusesList();
    getAllTramList();
}, [] );

const panes = [
  { menuItem: 'Szukaj autobusu tramwaju', render: () => <Tab.Pane> { 
    <form onSubmit={onHandleSubmit} ><label>Podaj dostępny numer linii: </label>
        <input type="text" name="bus" onInput={inputHandler} onChange={()=>onInputChange(event)} value={busInput} required placeholder='wpisz numer ...' />
        Autobus <input type="radio" checked={ch[0]} name="bt"  onChange={onInputChange} value='1' ></input>  | 
        Tramwaj<input type="radio" checked={ch[1]}  name="bt"  onChange={onInputChange} value='2' ></input>
        <button type="submit" disabled={btnDis}> Pokaż na mapie </button>
    </form>
    
    } </Tab.Pane>  },
  
  { menuItem: 'Dostępne autobusy', render: () => <Tab.Pane>{ listBus.map((item, index) => (<button key={index} > {item} </button>) ) }</Tab.Pane> },
  { menuItem: 'Dostępne tramwaje', render: () => <Tab.Pane>{ listTram.map((item, index) => (<button key={index}> {item} </button>) ) }</Tab.Pane> },
  { menuItem: 'Pokaż przystanki', render: () => <Tab.Pane>{
    <form onSubmit={onHandleSubmitBusStop} ><label>Nazwa przystanku lub ulicy </label>
    <input type="text" name="busstop" onInput={inputHandler} onChange={onInputChange} value={busStopInput} required placeholder='wpisz nazwę ...'></input> 
    <button type="submit"> Pokaż przystanki </button>
    </form>
  } </Tab.Pane> },
]

return (
  
  <Tab panes={panes} />
  );
}


export default FormBusLine;

