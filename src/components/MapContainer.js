import * as React from 'react'
import { Map, Source, Layer } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
  },
}

const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
}

const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'earthquakes',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
}

function MapContainer({locations}) {
  console.log(locations);

  const formatData=(data)=>{
    if(data && data.length>0){
      return data.map(item=>{

            return {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [item.lng,item.lat],
                },
              }
            })
    }else{
      return [];
    }
   
  }

  const MAPBOX_TOKEN =
    'pk.eyJ1IjoiaGFtemFhbWlyNzQ5IiwiYSI6ImNqdDE0ODY4eDExdGo0OXBoMHl4YjZrNG0ifQ.3hAWqNtZfhod-bXzrqIg7Q'
  const mapData = {
    type: 'FeatureCollection',
    features: formatData(locations),
  }

  return (
    <div style={{ width: '100%' }}>
      <Map
        initialViewState={{
          latitude: 33.738045,
          longitude: 73.084488,
          zoom: 4,
        }}
        style={{ width: '100%', height: 600 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Source
          id="earthquakes"
          type="geojson"
          data={mapData}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </Map>
    </div>
  )
}

export default MapContainer
