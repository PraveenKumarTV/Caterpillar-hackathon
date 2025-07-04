import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../contexts/TTSContext';

const MapNavigator = ({ show, onHide, destination, jobTitle }) => {
  const { t } = useTranslation();
  const { speak } = useTTS();
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [instructions, setInstructions] = useState('🔄 Waiting for GPS...');
  const [error, setError] = useState(null);
  const routingControlRef = useRef(null);
  const markerRef = useRef(null);
  const arrowMarkerRef = useRef(null);

  useEffect(() => {
    if (show && mapRef.current && !mapInstance) {
      // Load Leaflet dynamically
      loadLeafletAndInitialize();
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, [show]);

  const loadLeafletAndInitialize = async () => {
    try {
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        const routingCSS = document.createElement('link');
        routingCSS.rel = 'stylesheet';
        routingCSS.href = 'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css';
        document.head.appendChild(routingCSS);
      }

      // Load Leaflet JS
      if (!window.L) {
        await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
      }

      // Load Routing Machine
      if (!window.L.Routing) {
        await loadScript('https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.min.js');
      }

      initializeMap();
    } catch (err) {
      setError('Failed to load map libraries');
      speak('Map loading failed');
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const initializeMap = () => {
    if (!window.L || !mapRef.current) return;

    const map = window.L.map(mapRef.current).setView([destination.lat, destination.lng], 18);

    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 22,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add destination marker
    const destMarker = window.L.marker([destination.lat, destination.lng], {
      icon: window.L.divIcon({
        className: 'custom-destination',
        html: '🚧',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    }).addTo(map).bindPopup(`Destination: ${jobTitle}`);

    setMapInstance(map);
    startGPSTracking(map);
  };

  const startGPSTracking = (map) => {
    if (!navigator.geolocation) {
      setError('GPS not supported');
      speak('GPS not available');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentPos = window.L.latLng(position.coords.latitude, position.coords.longitude);
        
        // Update or create current position marker
        if (!markerRef.current) {
          markerRef.current = window.L.circleMarker(currentPos, {
            radius: 8,
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.9
          }).addTo(map);
        } else {
          markerRef.current.setLatLng(currentPos);
        }

        // Center map on current position
        map.setView(currentPos);

        // Initialize or update routing
        if (!routingControlRef.current) {
          routingControlRef.current = window.L.Routing.control({
            waypoints: [currentPos, window.L.latLng(destination.lat, destination.lng)],
            createMarker: () => null,
            show: false,
            addWaypoints: false,
            routeWhileDragging: false
          }).addTo(map);

          routingControlRef.current.on('routesfound', function (e) {
            const route = e.routes[0];
            setInstructions('📍 Navigation Started');
            speak('Navigation route calculated');
          });
        } else {
          // Update waypoints
          routingControlRef.current.setWaypoints([
            currentPos,
            window.L.latLng(destination.lat, destination.lng)
          ]);
        }

        // Calculate distance and direction
        const destLatLng = window.L.latLng(destination.lat, destination.lng);
        const distance = currentPos.distanceTo(destLatLng);
        
        if (distance < 10) {
          setInstructions('🎯 You have arrived at your destination!');
          speak('Destination reached');
        } else {
          const direction = getDirectionAngle(currentPos, destLatLng);
          setInstructions(`➡️ ${Math.round(distance)}m to destination`);
          drawArrow(map, currentPos, destLatLng, direction);
        }
      },
      (err) => {
        setError(`GPS error: ${err.message}`);
        setInstructions('⚠️ GPS error');
        speak('GPS error occurred');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );

    // Store watch ID for cleanup
    mapRef.current.watchId = watchId;
  };

  const drawArrow = (map, from, to, angle) => {
    if (arrowMarkerRef.current) {
      map.removeLayer(arrowMarkerRef.current);
    }

    const arrowIcon = window.L.divIcon({
      html: '<div style="transform: rotate(' + angle + 'deg); font-size: 20px;">➤</div>',
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    arrowMarkerRef.current = window.L.marker(from, { icon: arrowIcon }).addTo(map);
  };

  const getDirectionAngle = (from, to) => {
    const dy = to.lat - from.lat;
    const dx = to.lng - from.lng;
    const theta = Math.atan2(dy, dx);
    return (theta * 180 / Math.PI) + 90; // Adjust for arrow orientation
  };

  const handleClose = () => {
    // Cleanup GPS tracking
    if (mapRef.current && mapRef.current.watchId) {
      navigator.geolocation.clearWatch(mapRef.current.watchId);
    }
    
    // Cleanup map
    if (mapInstance) {
      mapInstance.remove();
      setMapInstance(null);
    }
    
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-map me-2"></i>
          Navigation to {jobTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 position-relative">
        {error && (
          <Alert variant="danger" className="position-absolute top-0 start-0 m-3" style={{ zIndex: 1000 }}>
            {error}
          </Alert>
        )}
        
        <div 
          className="position-absolute top-0 start-0 m-3 bg-white bg-opacity-75 p-3 rounded"
          style={{ zIndex: 999, fontSize: '1.1em' }}
        >
          {instructions}
        </div>

        <div 
          ref={mapRef} 
          style={{ height: '80vh', width: '100%' }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="bi bi-x-circle me-2"></i>
          Close Navigation
        </Button>
        <Button 
          variant="primary" 
          onClick={() => speak(instructions)}
        >
          <i className="bi bi-volume-up me-2"></i>
          Read Instructions
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapNavigator;