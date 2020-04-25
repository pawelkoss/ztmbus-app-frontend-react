import React, { useRef, useState, useEffect } from 'react';
import { Tab } from 'semantic-ui-react';
//import useSignUpForm from './CustomHooks';


// komponent
const FormBusLine = ({ valueProp, onInputChange, onHandleSubmit, checkInput })=> {

  // https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=f2e5503e927d-4ad3-9500-4ab9e55deb59&apikey=46657b26-69bc-489e-8985-e7e2c0422f72&type=2`, {mode: 'no-cors'})
//const distinct = (value, index, self) => self.indexOf(value) === index;


const parseDistinct = (listTab) => {
    const lines = listTab.map((item)=> item.Lines);
    return [... new Set(lines)];
  }

const getAllBusesList =() => {
  let url = 'http://127.0.0.1/devjs/react/start/src/data/all-buses.json';
     fetch(url)
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(json => setListBus(parseDistinct(json.result))    )
    .catch(error => console.log("Input data error", error));
}
const getAllTramList =() => {
     let url = 'http://127.0.0.1/devjs/react/start/src/data/allTrams.json';
     fetch(url)
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(json => setListTram(parseDistinct(json.result))    )
    .catch(error => console.log("Input data error", error));
}

const inputHandler = (event)=>{
  console.log("inputHandle: onInput z Form: " + checkInput);
  if(event.target.name=='bt'){
    if(event.target.value=='1') { setCh([true, false]); }
    if(event.target.value=='2') { setCh([false, true]); }
  }
  console.log(`inputHandler: ${event.target.name}`);
  
};

const [ch, setCh] = useState([true, false]); 
const [btnDis, setBtnDis] = useState(true);
useEffect(()=>{
  console.log(`useEffect, ${ch}, btnDis przed check: ${btnDis}, checkInput:${checkInput}`);
  if(ch[0]) { listBus.includes(checkInput) ? setBtnDis(false) : setBtnDis(true);}
  if(ch[1]) { listTram.includes(checkInput) ? setBtnDis(false) : setBtnDis(true); }
 console.log(`ch: ${ch}, btnDis po check ${btnDis}`)
},[ch, checkInput]);

const [listBus, setListBus] = useState([]);
const [listTram, setListTram] = useState([]);
useEffect(() => {
    getAllBusesList();
    getAllTramList();
}, [] );

const panes = [
  { menuItem: 'Pokaż autobusy / tramwaje', render: () => <Tab.Pane> { 
    <form onSubmit={onHandleSubmit} ><label>Podaj dostępny numer linii: </label>
        <input type="text" name="bus" onInput={inputHandler} onChange={()=>onInputChange(event)} value={checkInput} placeholder='wpisz numer ...' required />
        Autobus <input type="radio" defaultChecked name="bt" onInput={inputHandler} onChange={onInputChange} value='1' ></input>  | 
        Tramwaj<input type="radio"  name="bt" onInput={inputHandler} onChange={onInputChange} value='2' ></input>
        <button type="submit" disabled={btnDis}> Pokaż na mapie </button>
    </form>
    
    } </Tab.Pane>  },
  
  { menuItem: 'Dostępne autobusy', render: () => <Tab.Pane>{ listBus.map((item, index) => (<button key={index} > {item} </button>) ) }</Tab.Pane> },
  { menuItem: 'Dostępne tramwaje', render: () => <Tab.Pane>{ listTram.map((item, index) => (<button key={index}> {item} </button>) ) }</Tab.Pane> },
  { menuItem: 'Pokaż przystanki', render: () => <Tab.Pane>Nazwa ulicy <input></input> <button> Pokaż przystanki </button></Tab.Pane> },
  { menuItem: 'Pokaz trasę linii', render: () => <Tab.Pane>Rysowanie trasy ...</Tab.Pane> }
]

return (
  
  <Tab panes={panes} />
  );
}


export default FormBusLine;

