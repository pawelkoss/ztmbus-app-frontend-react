
   //wlasny hook
   function useInterval(callback, delay) {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }



   //hook, wywolanie wlasnego hooka z interwałem
/* useEffect(()=>{
   console.log(" hook start ... " + busLine);
     useInterval(() => {
        busLine &&  fetch(`http://localhost:8080/ztm/vehicles/1/${busLine}`)
              .then(response => response.ok ? response.json() : Promise.reject(response))
              .then(json => setResultBus(json.result))
              .catch(error => console.log("Input data error", error))
          },
          10000);
      }, [busLine] ); */





   useEffect(() => {
    //fetch('http://localhost:8080/ztm/vehicles/1/172')
    //.then(res => res.json())
    //.then(json => setResultBus(json.result));
    console.log("hook geolokacja");    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        setOwnPosition({lat: position.coords.latitude, lng: position.coords.longitude});     
      });
    }
}, []
); 


