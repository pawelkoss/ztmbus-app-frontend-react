import React, { useState, useEffect, useRef, useCallback , Fragment} from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
//import * as busData from "./data/bus172.json";
import mapStyles from "./mapStyles";
import FormBusLine from './modules/FormTabs';
//import useInterval from './modules/CustomUseInterval';



//const word = busData.result[0].VehicleNumber;
//console.log(busData.result);
//http://127.0.0.1/devjs/react/start/src/data/bus172.json
//http://localhost:8080/ztm/vehicles/1/172

function Map() {
    const [selectedBus, setSelectedBus] = useState(null);
    const [defZoom, setDefZoom] = useState(13);
    const [resultBus, setResultBus] = useState([]);
    const [resultBusStops, setResultBusStops] = useState([]);
    const [mapCenter, setMapCenter] = useState({lat:52.237049, lng:21.017532});
    const [ownPosition, setOwnPosition] = useState({});
    
    const [busLineForm, setBusLineForm] = useState('');   //checkInput in FormTabs
    const [busStopForm, setBusStopForm] = useState('');
    const [btForm, setBtForm] = useState('');
    const [ch, setCh] = useState([true, false]); 
    

 useEffect(() => {
            console.log("hook geolokacja");    
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                setOwnPosition({lat: position.coords.latitude, lng: position.coords.longitude});     
              });
            }
        }, []
  ); 

   const [currVehNumber, setCurrVehNumber] = useState(null);
   useEffect(() => {
     console.log("hook sledzenie");
            if(currVehNumber != null){
            const busCenter = resultBus.filter((bus) => bus.VehicleNumber === currVehNumber)[0];
            setMapCenter({lat:busCenter.Lat, lng:busCenter.Lon});
            }
            }, [resultBus]
        );
        
  useEffect(() => {
    console.log("hook resultBusStops");
            console.log(resultBusStops);

            }, [resultBusStops]
        );


function getByBusLine(line, bt) {
  fetch(`http://localhost:8080/ztm/vehicles/${bt}/${line}`)
              .then(response => response.ok ? response.json() : Promise.reject(response))
              .then(json => setResultBus(json.result))
              .catch(error => console.log("Input data error", error))
}

function getByBusStopName(street) {
  fetch(`http://localhost:8080/ztm/bus-stop/name-db/${street}`)
              .then(response => response.ok ? response.json() : Promise.reject(response))
              .then(json => setResultBusStops(json))
              .catch(error => console.log("Input data error", error))

}





const [busLine, setBusLine] = useState([null,'']);


useEffect(() => {
if(busLine[0]!==null){
  const interval = setInterval(() => {
    console.log('This will run every 10 seconds ' + busLine[0]);
    getByBusLine(busLine[0], busLine[1]);
  }, 10000);
  return () => clearInterval(interval);
}
}, [busLine]);


      const handleInputChange = (event)=>{
        event.target.name == 'bus' ? setBusLineForm(event.target.value) : null;
        event.target.name == 'bt' ? setBtForm(event.target.value) : null;
        event.target.name == 'busstop' ? setBusStopForm(event.target.value) : null;
        console.log("handleInputchange z App:");
        console.log(event.target.name + " : " + event.target.value);
        console.log(`handleInputChange target.checked: ${event.target.checked}`);
        if(event.target.checked){
          if(event.target.value=='1') { setCh([true, false]); }
          if(event.target.value=='2') { setCh([false, true]); }
        }
 
      };

      const handleSubmit = (event)=>{
        event.preventDefault();
        setBusLine([busLineForm, btForm]);
        console.log(`on submit & 1 getdata ${busLineForm} = ${busLine[0]} / ${btForm} = ${busLine[1]}`);
        
        getByBusLine(busLineForm, btForm);
    };

    const handleSubmitBusStop = (event)=>{
      event.preventDefault();
      console.log(`on submit busStop ${busStopForm}`);
      getByBusStopName(busStopForm);
      console.log(resultBusStops);
    }

    return (<Fragment>
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
                    }}
                    icon={{
                        url: `./../public/bus.svg`,
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
          position={{
            lat: selectedBus.Lat,
            lng: selectedBus.Lon
          }}
        >
          <div>
             <p>{selectedBus.Lines}</p> 
            <h2>{selectedBus.VehicleNumber}</h2>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
    <FormBusLine onInputChange={handleInputChange} onHandleSubmit={handleSubmit} onHandleSubmitBusStop={handleSubmitBusStop} valueProp={busLine} checkInput={busLineForm} ch={ch} busStopInput={busStopForm}/>
  </Fragment>
    
    );  //end return

} 

const WrappedMap = withScriptjs(withGoogleMap(Map));

export function App(){
  

    return (
    <div style = {{ width: "90vw", height: "80vh"}}>
        <WrappedMap 
        googleMapURL={'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBT8TVVtOZRnXdn6DqGI0Md7yk6SGHu4pE'}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}  
    />
    </div>
    );
}

