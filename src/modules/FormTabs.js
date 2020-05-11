import React, { useRef, useState, useEffect } from 'react';
import { Tab } from 'semantic-ui-react';
import Demo from './Autocomplete';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';




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
  // todo: autosugestia
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
    <form onSubmit={onHandleSubmit} >
    <Box display="flex" flexDirection="row" >
      <Box><label>Linia: </label></Box>
        <Box p={1}>
          <TextField width="50%" variant="outlined" label="Podaj dostępny numer linii" type="text" name="bus" onInput={inputHandler} onChange={()=>onInputChange(event)} value={busInput} required placeholder='wpisz numer ...' />
        </Box>
        <Box p={1}>
          Autobus <input type="radio" checked={ch[0]} name="bt"  onChange={onInputChange} value='1' ></input>
        </Box>
        <Box p={1}>
          Tramwaj <input type="radio" checked={ch[1]}  name="bt"  onChange={onInputChange} value='2' ></input>
        </Box>
        <Box p={1}>
          <Button variant="contained" color ="primary" type="submit" disabled={btnDis}> Pokaż na mapie </Button>
        </Box>
        
    </Box>
    </form>
    
    } </Tab.Pane>  },
  
  { menuItem: 'Dostępne autobusy', render: () => <Tab.Pane>{ listBus.map((item, index) => (<button key={index} disabled={true}> {item} </button>) ) }</Tab.Pane> },
  { menuItem: 'Dostępne tramwaje', render: () => <Tab.Pane>{ listTram.map((item, index) => (<button key={index} disabled={true}> {item} </button>) ) }</Tab.Pane> },
  { menuItem: 'Pokaż przystanki', render: () => <Tab.Pane>{
    <form onSubmit={onHandleSubmitBusStop}>
      <Box display="flex" flexDirection="row" >
        <Box p={1}>
          <Demo /> 
        </Box>
        <Box p={1}>
          <Button variant="contained" color ="primary" type="submit"> Pokaż przystanki </Button>
        </Box>
      </Box>
      

    </form>
  } </Tab.Pane> },
]

return (
  
  <Tab panes={panes} />
  );
}


export default FormBusLine;

