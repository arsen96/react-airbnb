import React from 'react';
import './Map.css';
import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Form } from 'react-bootstrap';

const customIcon = ({price,id}) => {
 return new L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:#ea516c;' class='marker-pin'>"+ price +"€</div>",
    id:id
});
}


function Map({airbnbsMap,updateVisibleItems,getAllLayers,setMap,setIsZoomActive,isZoomActive}) {

  function ManageEvents() {
    const map = useMapEvents({
      zoomend() {
        visibleMarkers(map);
      },
  
      moveend(){
        visibleMarkers(map);
      },
    })
  }

  function visibleMarkers(mapInstance,init = false){
    let layers = [];
    
    mapInstance.eachLayer(function (layer) {
      if(typeof layer.getLatLng === 'function') {
        if(mapInstance.getBounds().contains(layer.getLatLng())) {
            layers.push(layer)
         }
    }
  });

    updateVisibleItems(layers);
  }

  function activateZoomToggle(e){
      setIsZoomActive(e.target.checked)
  }

  return (
    <>
    {airbnbsMap?.length >  0 && 
    <MapContainer center={[43.2957547, -0.3685668 ]}  zoom={7}  whenReady={(instance) => {
      setTimeout(() => {
        visibleMarkers(instance.target,true)
        let allLayers = [];
        setMap(instance.target)
        instance.target.eachLayer((layer) => {
          if(typeof layer.getLatLng === 'function') {
           allLayers.push(layer)
         }
        })
        getAllLayers(allLayers);
      }, 0);
    }}
      scrollWheelZoom={true}  >
        <div className="activateZone">
        <Form>
          <Form.Check 
            checked= {isZoomActive}
            type="switch"
            id="custom-switch"
            label="Rechercher quand la carte se déplace"
            onClick={(e) => activateZoomToggle(e)}
          />
        </Form>
        </div>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
      {
      airbnbsMap.map((item,index) => (  
       <Marker position={[item.lat,item.long]} icon={ customIcon(item) }>
          <Popup>
            {item.title}
          </Popup>
       </Marker>
      ))
      }
      <ManageEvents updateVisibleItems={updateVisibleItems} />
    </MapContainer>
  }
  </>);
  
}

Map.propTypes = {};

Map.defaultProps = {};

export default Map;
