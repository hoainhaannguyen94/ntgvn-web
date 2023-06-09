
import L from 'leaflet';

/**
 * @see https://leafletjs.com/examples/custom-icons/
 */
export const BaseMarkerIcon = L.Icon.extend({
    options: {
        iconSize: [32, 32],
        shadowSize: [0, 0],
        iconAnchor: [16, 32],
        shadowAnchor: [0, 0],
        popupAnchor: [0, -32]
    }
}) as any;

export const DEFAULT_MAKER_ICON = new BaseMarkerIcon({ iconUrl: 'assets/map/marker.png' });
export const SMARTPHONE_MAKER_ICON = new BaseMarkerIcon({ iconUrl: 'assets/map/smartphone.png' });
