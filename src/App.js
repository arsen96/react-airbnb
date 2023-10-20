import { useState } from "react";
import "./App.css";

import records from "./assets/records.json";
import Map from "./components/Map/Map";
import Offers from "./components/Offers/Offers";
import "bootstrap/dist/css/bootstrap.min.css";
import L from "leaflet";
import Fuse from "fuse.js";

function App() {
  let [isZoomActive, setIsZoomActive] = useState(true);
  let [airbnbs, setAirbnbs] = useState(records);
  let [allLayers, setLayers] = useState([]);
  let [map, setMap] = useState();
  const [airbnbsMap, setAirbnbsMap] = useState(
    JSON.parse(JSON.stringify(records))
  );

  const updateVisibleItems = (visibleLayers) => {
    const currentItem = [...airbnbs];
    currentItem.forEach((item, index) => {
      const visibleItem = visibleLayers.some((currLayer) => {
        return currLayer.options.icon.options.id === item.id;
      });
      currentItem[index].distance = "";
      currentItem[index].hide = isZoomActive ? !visibleItem : false
    });
    setAirbnbs(currentItem);
  };

  const zoomToZone = (itemsTargetted) => {
    let searchedItems = [];
    if (!Array.isArray(itemsTargetted)) {
      searchedItems = [itemsTargetted];
    } else {
      searchedItems = itemsTargetted;
    }
    const findedItems = allLayers.filter((layer) => {
      return searchedItems.some((currItem) => {
        return currItem.id === layer.options.icon.options.id;
      });
    });
    var group = new L.featureGroup(findedItems);
    map.flyToBounds(group.getBounds(), { duration: 1.3 });
  };

  const search = ({ min, max, city }) => {
    let minPrice = min;
    let maxPrice = max;

    let result;
    if (city?.length > 0) {
      const fuse = new Fuse(airbnbsMap, {
        keys: ["city"],
        includeScore: true,
      });
      result = fuse.search(city).map((result) => result.item);
    } else {
      result = [...airbnbsMap];
    }
    if (isNaN(min)) {
      minPrice = 0;
    }
    if (isNaN(max) || max === 0) {
      const allPrices = result.map((item) => {
        return item.price;
      });
      const highesPrice = Math.max(...allPrices);
      maxPrice = highesPrice;
    }
    const itemsByPrice = result.filter((eachItem) => {
      return eachItem.price >= minPrice && eachItem.price <= maxPrice;
    });
    const item = allLayers.filter((layer) => {
      return itemsByPrice.some((res) => {
        return layer.options.icon.options.id === res.id;
      });
    });


    if(itemsByPrice?.length > 0){
      zoomToZone(itemsByPrice);
    }
    updateVisibleItems(item);
  };

  const getUserLocation = (coords) => {
    const userLocation = L.latLng([coords.lat,coords.long]);
    const allDistances = allLayers.map((marker) => {
        const distance = userLocation.distanceTo(L.latLng(marker.getLatLng()));
        return {id:marker.options.icon.options.id,distance}
    })

    const closestDistances = allDistances.sort((a,b) => {
        return a.distance - b.distance
    })

    const sortedAirBnbs = closestDistances.map((coord) => {
      const closerAirBnb = airbnbs.find((map) => coord.id === map.id);
      return {...closerAirBnb,distance:`${(coord.distance / 1000).toFixed(1)} km`}
    })

    setAirbnbs(sortedAirBnbs)
  }

  const getAllLayers = (allLayers) => {
    setLayers([...allLayers]);
  };
  return (
    <div className="mainContainer">
      <div className="mapContainer">
        <Map
          airbnbsMap={airbnbsMap}
          setIsZoomActive={setIsZoomActive}
          isZoomActive={isZoomActive}
          updateVisibleItems={updateVisibleItems}
          getAllLayers={getAllLayers}
          setMap={setMap}
        ></Map>
      </div>
      <div className="offersContainer">
        <Offers
          airbnbs={airbnbs}
          setAirbnbs={setAirbnbs}
          search={search}
          getUserLocation={getUserLocation}
          zoomToZone={zoomToZone}
        ></Offers>
      </div>
    </div>
  );
}

export default App;
