import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2, X } from 'lucide-react';

// Fix for default marker icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Saudi cities with coordinates
const SAUDI_CITIES = [
    { id: 'riyadh', name: 'الرياض', lat: 24.7136, lng: 46.6753 },
    { id: 'jeddah', name: 'جدة', lat: 21.4858, lng: 39.1925 },
    { id: 'makkah', name: 'مكة المكرمة', lat: 21.4225, lng: 39.8262 },
    { id: 'madinah', name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692 },
    { id: 'dammam', name: 'الدمام', lat: 26.4207, lng: 50.0888 },
    { id: 'khobar', name: 'الخبر', lat: 26.2172, lng: 50.1971 },
    { id: 'dhahran', name: 'الظهران', lat: 26.2361, lng: 50.0393 },
    { id: 'taif', name: 'الطائف', lat: 21.2703, lng: 40.4158 },
    { id: 'tabuk', name: 'تبوك', lat: 28.3835, lng: 36.5662 },
    { id: 'buraidah', name: 'بريدة', lat: 26.3267, lng: 43.9750 },
    { id: 'khamis', name: 'خميس مشيط', lat: 18.3091, lng: 42.7314 },
    { id: 'abha', name: 'أبها', lat: 18.2164, lng: 42.5053 },
    { id: 'najran', name: 'نجران', lat: 17.4933, lng: 44.1277 },
    { id: 'jizan', name: 'جازان', lat: 16.8892, lng: 42.5611 },
    { id: 'hail', name: 'حائل', lat: 27.5114, lng: 41.7208 },
    { id: 'jubail', name: 'الجبيل', lat: 27.0046, lng: 49.6225 },
    { id: 'yanbu', name: 'ينبع', lat: 24.0895, lng: 38.0618 },
    { id: 'hofuf', name: 'الهفوف', lat: 25.3648, lng: 49.5870 },
];

export interface LocationData {
    lat: number;
    lng: number;
    displayName: string;
    city?: string;
    neighborhood?: string;
    street?: string;
    raw?: any;
}

interface LeafletMapProps {
    selectedCity: string;
    onSelectCity: (cityId: string, cityName: string, lat: number, lng: number) => void;
    onSelectLocation?: (location: LocationData) => void;
}

interface SearchResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    address?: {
        city?: string;
        town?: string;
        village?: string;
        suburb?: string;
        neighbourhood?: string;
        road?: string;
    };
}

const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
    useMapEvents({
        click: (e) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const FlyToLocation: React.FC<{ lat: number; lng: number; zoom?: number }> = ({ lat, lng, zoom = 12 }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }, [lat, lng, zoom, map]);
    return null;
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
    selectedCity,
    onSelectCity,
    onSelectLocation
}) => {
    const [customMarker, setCustomMarker] = useState<{ lat: number; lng: number } | null>(null);
    const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const selectedCityData = SAUDI_CITIES.find(c => c.id === selectedCity) || SAUDI_CITIES[0];

    const searchPlaces = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' السعودية')}&limit=8&addressdetails=1&accept-language=ar`
            );
            const data = await response.json();
            setSearchResults(data);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                searchPlaces(searchQuery);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, searchPlaces]);

    const handleSearchSelect = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        setCustomMarker({ lat, lng });
        setFlyTo({ lat, lng, zoom: 15 });
        setShowResults(false);
        setSearchQuery(result.display_name.split(',')[0]);

        const locationData: LocationData = {
            lat,
            lng,
            displayName: result.display_name,
            city: result.address?.city || result.address?.town || result.address?.village,
            neighborhood: result.address?.suburb || result.address?.neighbourhood,
            street: result.address?.road,
            raw: result
        };

        if (onSelectLocation) {
            onSelectLocation(locationData);
        }
    };

    const handleMapClick = async (lat: number, lng: number) => {
        setCustomMarker({ lat, lng });

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ar`
            );
            const data = await response.json();

            const locationData: LocationData = {
                lat,
                lng,
                displayName: data.display_name || 'موقع غير معروف',
                city: data.address?.city || data.address?.town || data.address?.village,
                neighborhood: data.address?.suburb || data.address?.neighbourhood,
                street: data.address?.road,
                raw: data
            };

            if (onSelectLocation) {
                onSelectLocation(locationData);
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            if (onSelectLocation) {
                onSelectLocation({
                    lat,
                    lng,
                    displayName: 'موقع محدد'
                });
            }
        }
    };

    return (
        <div className="relative w-full h-[450px] rounded-[2rem] overflow-hidden border-2 border-slate-200 shadow-xl">
            <MapContainer
                center={[selectedCityData.lat, selectedCityData.lng]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {flyTo ? (
                    <FlyToLocation lat={flyTo.lat} lng={flyTo.lng} zoom={flyTo.zoom} />
                ) : (
                    <FlyToLocation lat={selectedCityData.lat} lng={selectedCityData.lng} />
                )}
                <MapClickHandler onLocationSelect={handleMapClick} />

                {SAUDI_CITIES.map((city) => (
                    <Marker
                        key={city.id}
                        position={[city.lat, city.lng]}
                        eventHandlers={{
                            click: () => onSelectCity(city.id, city.name, city.lat, city.lng),
                        }}
                    >
                        <Popup>
                            <div className="text-center font-bold">{city.name}</div>
                        </Popup>
                    </Marker>
                ))}

                {customMarker && (
                    <Marker position={[customMarker.lat, customMarker.lng]}>
                        <Popup>
                            <div className="text-center">
                                <div className="font-bold text-indigo-600">📍 موقع مخصص</div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {customMarker.lat.toFixed(4)}, {customMarker.lng.toFixed(4)}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
                <div className="flex-1 relative">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchResults.length > 0 && setShowResults(true)}
                            placeholder="ابحث عن حي أو شارع أو معلم..."
                            className="w-full pl-10 pr-12 py-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            {isSearching ? (
                                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5 text-slate-400" />
                            )}
                        </div>
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults([]);
                                    setShowResults(false);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>

                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[300px] overflow-y-auto">
                            {searchResults.map((result, index) => (
                                <button
                                    key={result.place_id || index}
                                    onClick={() => handleSearchSelect(result)}
                                    className="w-full px-4 py-3 text-right hover:bg-indigo-50 transition-colors border-b border-slate-100 last:border-0"
                                >
                                    <div className="text-sm font-bold text-slate-800 truncate">
                                        {result.display_name.split(',')[0]}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate mt-0.5">
                                        {result.display_name.split(',').slice(1, 3).join(',')}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <select
                    value={selectedCity}
                    onChange={(e) => {
                        const city = SAUDI_CITIES.find(c => c.id === e.target.value);
                        if (city) {
                            onSelectCity(city.id, city.name, city.lat, city.lng);
                            setFlyTo({ lat: city.lat, lng: city.lng, zoom: 12 });
                        }
                    }}
                    className="px-4 py-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                    {SAUDI_CITIES.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">
                    💡 ابحث أو اضغط على الخريطة لتحديد موقع
                </p>
            </div>
        </div>
    );
};

export { SAUDI_CITIES };
