import React, { useState, useEffect, useRef, useCallback , Fragment} from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow,
  InfoBubble
} from "react-google-maps";
//import * as busData from "./data/bus172.json";
import mapStyles from "./mapStyles";
import FormBusLine from './modules/FormTabs';
//import useInterval from './modules/CustomUseInterval';
import  "../src/sidebar.css";


//http://127.0.0.1/devjs/react/start/src/data/bus172.json
//http://localhost:8080/ztm/vehicles/1/172

function Map() {
//  Zaznaczony pojazd, przystanek
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedBusStop, setSelectedBusStop] = useState(null);
    const [currBusTime, setCurrBusTime] = useState('');

//  Lista pojazdów, przystanków, rozkład jazdy   
    const [resultBus, setResultBus] = useState([]);
    const [resultBusStops, setResultBusStops] = useState([]);
    const [busLineList, setBusLineList] = useState([]);
    const [busLineTimetable, setBusLineTimetable] = useState({line:"", timetable:[]});

//  Ustawienia mapy
    const [mapCenter, setMapCenter] = useState({lat:52.246149, lng:21.017532});
    const [defZoom, setDefZoom] = useState(12);
    const [ownPosition, setOwnPosition] = useState({});

//  Formularze
    const [busLineForm, setBusLineForm] = useState('');   //checkInput in FormTabs
    const [busStopForm, setBusStopForm] = useState('');
    const [btForm, setBtForm] = useState(1);
    const [bt, setBt] = useState(1);
    const [ch, setCh] = useState([true, false]); 

    const svgUrl = ['./../public/bus-red.svg', './../public/tram-yel.svg'];
    const vehicle = ['Autobus','Tramwaj'];
    const urlLocal = "http://localhost:8080";
    const BASEURL = "http://ztm-bus.herokuapp.com";

    const headers = new Headers({
      'Access-Control-Allow-Origin': 'http://plutioidtx.cluster029.hosting.ovh.net/'
    });
    
    function openNav(line) {
      document.getElementById("mySidenav").style.width = "20vw";

      fetch(`${BASEURL}/ztm/timetable/${selectedBusStop.setof}/${selectedBusStop.pistil}/${line}`)
      .then(response => response.ok ? response.json() : Promise.reject(response))
      .then(json => setBusLineTimetable({line: line, timetable: json.result}))
      //.then(json => console.log(json.result))
      .catch(error => console.log("Input data error", error))

     // console.log(`openNav ${line}`)
    }
    function closeNav() {
      document.getElementById("mySidenav").style.width = "0px";
      //console.log(`close`);
    }

 useEffect(() => {
            //console.log("hook geolokacja");    
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                setOwnPosition({lat: position.coords.latitude, lng: position.coords.longitude});     
              });
            }
        }, []
  ); 

   const [currVehNumber, setCurrVehNumber] = useState(null);
   useEffect(() => {
    // console.log("hook sledzenie");
            if(currVehNumber != null && resultBus.length>0){
            const busCurrent = resultBus.filter((bus) => bus.VehicleNumber === currVehNumber)[0];
            //console.log(`current: ${busCurrent}`);
            //setTimeout( setMapCenter({lat:busCurrent.Lat, lng:busCurrent.Lon}), 1000 );
            setCurrBusTime(busCurrent.Time);
            }
            }, [resultBus]
        );
        
  useEffect(() => {
    //console.log("hook resultBusStops");
    //console.log(resultBusStops);
    resultBusStops.length>0 && setMapCenter({lat: +resultBusStops[0].lat, lng: +resultBusStops[0].lon});
            }, [resultBusStops]
        );


function getByBusLine(line, bt) {
  fetch(`${BASEURL}/ztm/vehicles/${bt}/${line}`)
              .then(response => response.ok ? response.json() : Promise.reject(response))
              .then(json => setResultBus(json.result))
              .catch(error => console.log("Input data error", error))
}

function getByBusStopName(street) {
  fetch(`${BASEURL}/ztm/bus-stop/name-db/${street}`)
              .then(response => response.ok ? response.json() : Promise.reject(response))
              .then(json => setResultBusStops(json))
              .catch(error => console.log("Input data error", error))

}





const [busLine, setBusLine] = useState([null,'']);


useEffect(() => {
if(busLine[0]!==null){
  const interval = setInterval(() => {
    console.log('Interval 10 seconds ' + busLine[0]);
    getByBusLine(busLine[0], busLine[1]);
  }, 10000);
  return () => clearInterval(interval);
}
}, [busLine]);


      const handleInputChange = (event)=>{
        event.target.name == 'bus' ? setBusLineForm(event.target.value) : null;
        event.target.name == 'bt' ? setBtForm(event.target.value) : null;
        event.target.name == 'busstop' ? setBusStopForm(event.target.value) : null;
        //console.log("handleInputchange z App:");
        //console.log(event.target.name + " : " + event.target.value);
        //console.log(`handleInputChange target.checked: ${event.target.checked}`);
        if(event.target.checked){
          if(event.target.value=='1') { setCh([true, false]); }
          if(event.target.value=='2') { setCh([false, true]); }
        }
 
      };

      const handleSubmit = (event)=>{
        event.preventDefault();
        setCurrVehNumber(null);
        setSelectedBus(null);
        setBusLine([busLineForm, btForm]);
        setBt(btForm);
        //console.log(`on submit & 1 getdata ${busLineForm} = ${busLine[0]} / ${btForm} = ${busLine[1]}`);
        
        getByBusLine(busLineForm, btForm);
        
    };

    const handleSubmitBusStop = (event)=>{
      event.preventDefault();
      //console.log(`on submit busStop ${busStopForm}`);
      getByBusStopName(busStopForm);
      //console.log(resultBusStops);
      setSelectedBusStop(null);
      setBusLineList([]);
    }

    const resolveBusStop = (busstop)=>{
      setSelectedBusStop(busstop);
      setMapCenter({ lat: +busstop.lat, lng: +busstop.lon });

      fetch(`${BASEURL}/ztm/timetable/${busstop.setof}/${busstop.pistil}`)
      .then(response => response.ok ? response.json() : Promise.reject(response))
      .then(json => lineListGenerator(json.result))
      .catch(error => console.log("Input data error", error))

      //console.log(error);
      const lineListGenerator = (res) =>{
        //console.log(res);
        let lineList = res.map(item=>item.values[0].value);
        setBusLineList(lineList);
        //let lineString='';
        //for (let item of lineList) {
        //  lineString += "<button id='"+item+"'>"+item+"</button>";
       // }
      
        
      }

  
    }

 
  
    return (
    <Fragment>
   
      <GoogleMap defaultZoom={defZoom} center={mapCenter} defaultOptions={{ style: mapStyles }}>
      {                   
       resultBus.map((bus) => (
                <Marker 
                    key = {bus.VehicleNumber} 
                    position = {{ lat: bus.Lat, lng: bus.Lon }}

                    onClick={() => {
                        setSelectedBus(bus);
                        setMapCenter({ lat: bus.Lat, lng: bus.Lon });
                        //setDefZoom(14);
                        setCurrVehNumber(bus.VehicleNumber);
                        setCurrBusTime(bus.Time);
                        
                    }}
                    icon={{
                        url: svgUrl[bt-1],
                        scaledSize: new window.google.maps.Size(25, 25)
                        
                    }}
                />
            ))
      }  
      {   
        resultBusStops.map((busstop)=> (
          
          <Marker
            key = {busstop.id}
            position = {{ lat: +busstop.lat, lng: +busstop.lon}}
            onClick={() => {
              resolveBusStop(busstop);   
           }}

            icon={{
              url: `./../public/busstop-yr.svg`,
              scaledSize: new window.google.maps.Size(25, 25)
            }}

          />
        ))
      }


      {
        <Marker position = {ownPosition} 
        icon ={{url: `./../public/male.svg`, scaledSize: new window.google.maps.Size(25, 25)}}
        />
      }

      {selectedBus && (
        <InfoWindow
          onCloseClick={() => {
            setDefZoom(12);  
            setSelectedBus(null);
            
          }}
          position={mapCenter}
        >
          <div>
        <h1><small>{vehicle[bt-1]} </small>{selectedBus.Lines}</h1> 
            <h3><small>Numer boczny: </small>{selectedBus.VehicleNumber}</h3>
            <h4>Czas GPS: {currBusTime}</h4>
          </div>
        </InfoWindow>
      )}
      {selectedBusStop && (
        <InfoWindow
          onCloseClick={() => {
            setDefZoom(12);  
            setSelectedBusStop(null);
            setBusLineList([]);
            closeNav();
          }}
          position={mapCenter}
        >

          
          <div>
        <h3><small>Przystanek</small><br/>{selectedBusStop.street} {selectedBusStop.pistil}</h3> 
            <h4>Lista linii:</h4>
           
           {
             busLineList.map((item) => <button onClick={()=>openNav(item)}>{item}</button> )
           }
          </div>
        </InfoWindow>
      )}

    </GoogleMap>

    <FormBusLine onInputChange={handleInputChange} onHandleSubmit={handleSubmit} onHandleSubmitBusStop={handleSubmitBusStop} valueProp={busLine} checkInput={busLineForm} ch={ch} busStopInput={busStopForm}/>
    {selectedBusStop && (<Fragment><button onClick={openNav}>open</button>

      <div id="mySidenav" className="sidenav">
        <button id="close" className="closebtn" onClick={closeNav}>&times;</button>
          <li>Przystanek: {selectedBusStop.street} {selectedBusStop.pistil}</li>
          <li>Kierunek: {selectedBusStop.direction}</li>
        <li>Linia: {busLineTimetable.line}</li>
        <li>Godziny odjazdów:</li>
        {
          //.log(busLineTimetable.timetable)
          busLineTimetable.timetable.map((item) => <li>{item.values[5].value}</li>)
        }
      </div>

  </Fragment>
  )}



  </Fragment>
    
    );  //end return

} 

const WrappedMap = withScriptjs(withGoogleMap(Map));

export function App(){
 
  
  /* Set the width of the side navigation to 0 */


    return (
    <div style = {{ width: "90vw", height: "80vh"}}>
 
        <WrappedMap 
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${key}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}  
    />
    </div>
    );
}

