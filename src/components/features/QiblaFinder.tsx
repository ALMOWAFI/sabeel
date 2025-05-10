import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { 
  Compass,
  Map,
  Navigation,
  LocateFixed,
  AlertCircle,
  RefreshCw,
  Share2,
  MapPin,
  Info
} from "lucide-react";

const KAABA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206
};

const QiblaFinder: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [compassAvailable, setCompassAvailable] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [currentBearing, setCurrentBearing] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [manualLatitude, setManualLatitude] = useState<string>("");
  const [manualLongitude, setManualLongitude] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const compassRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  
  // Major Islamic cities with their coordinates
  const majorCities = [
    { name: "مكة المكرمة", country: "السعودية", lat: 21.422487, lng: 39.826206 },
    { name: "المدينة المنورة", country: "السعودية", lat: 24.5247, lng: 39.5692 },
    { name: "القاهرة", country: "مصر", lat: 30.0444, lng: 31.2357 },
    { name: "إسطنبول", country: "تركيا", lat: 41.0082, lng: 28.9784 },
    { name: "دبي", country: "الإمارات", lat: 25.2048, lng: 55.2708 },
    { name: "الرياض", country: "السعودية", lat: 24.7136, lng: 46.6753 },
    { name: "عمان", country: "الأردن", lat: 31.9454, lng: 35.9284 },
    { name: "الرباط", country: "المغرب", lat: 34.0209, lng: -6.8416 },
    { name: "جاكرتا", country: "إندونيسيا", lat: -6.2088, lng: 106.8456 },
    { name: "كوالالمبور", country: "ماليزيا", lat: 3.1390, lng: 101.6869 }
  ];
  
  useEffect(() => {
    // Check if the device has compass capability
    if (window.DeviceOrientationEvent) {
      setCompassAvailable(true);
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    // Request geolocation automatically
    getLocation();
    
    // Add device orientation listener for compass
    window.addEventListener('deviceorientation', handleOrientation);
    
    // Cleanup
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);
  
  // Update the compass and arrow display when bearing changes
  useEffect(() => {
    if (compassRef.current && qiblaDirection !== null) {
      compassRef.current.style.transform = `rotate(${-currentBearing}deg)`;
    }
    
    if (arrowRef.current && qiblaDirection !== null) {
      arrowRef.current.style.transform = `rotate(${qiblaDirection - currentBearing}deg)`;
    }
  }, [currentBearing, qiblaDirection]);
  
  // Handle device orientation changes (compass)
  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setCurrentBearing(event.alpha);
    }
  };
  
  // Get user's current location
  const getLocation = () => {
    setLocationLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          calculateQiblaDirection(latitude, longitude);
          setLocationLoading(false);
        },
        error => {
          setError("تعذر الوصول إلى الموقع الجغرافي. يرجى التأكد من تفعيل خدمة الموقع والسماح للتطبيق باستخدامها.");
          setLocationLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("متصفحك لا يدعم تحديد الموقع الجغرافي.");
      setLocationLoading(false);
    }
  };
  
  // Calculate Qibla direction using the Haversine formula
  const calculateQiblaDirection = (latitude: number, longitude: number) => {
    // Convert degrees to radians
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const toDegrees = (radians: number) => radians * (180 / Math.PI);
    
    // Convert coordinates to radians
    const lat1 = toRadians(latitude);
    const lon1 = toRadians(longitude);
    const lat2 = toRadians(KAABA_COORDS.latitude);
    const lon2 = toRadians(KAABA_COORDS.longitude);
    
    // Calculate the direction
    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let qibla = toDegrees(Math.atan2(y, x));
    
    // Normalize to 0-360
    qibla = (qibla + 360) % 360;
    
    setQiblaDirection(qibla);
  };
  
  // Set location manually
  const setManualLocation = () => {
    const lat = parseFloat(manualLatitude);
    const lng = parseFloat(manualLongitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError("يرجى إدخال إحداثيات صحيحة.");
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("الإحداثيات خارج النطاق المسموح به.");
      return;
    }
    
    setUserLocation({ latitude: lat, longitude: lng });
    calculateQiblaDirection(lat, lng);
    setError(null);
  };
  
  // Set location by selecting a city
  const selectCity = (city: typeof majorCities[0]) => {
    setSelectedCity(city.name);
    setUserLocation({ latitude: city.lat, longitude: city.lng });
    calculateQiblaDirection(city.lat, city.lng);
    setError(null);
    
    // Update manual input fields
    setManualLatitude(city.lat.toString());
    setManualLongitude(city.lng.toString());
  };
  
  // Calculate distance to Kaaba in kilometers
  const calculateDistance = () => {
    if (!userLocation) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(KAABA_COORDS.latitude - userLocation.latitude);
    const dLon = toRadians(KAABA_COORDS.longitude - userLocation.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRadians(userLocation.latitude)) * Math.cos(toRadians(KAABA_COORDS.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance);
  };
  
  // Helper function to convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-right">تحديد اتجاه القبلة</h2>
            <p className="text-gray-500 dark:text-gray-400 text-right">
              استخدم البوصلة لتحديد اتجاه القبلة من موقعك الحالي
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={getLocation} 
              disabled={locationLoading}
              className="bg-sabeel-primary hover:bg-sabeel-primary/90"
            >
              {locationLoading ? <Spinner size="sm" className="mr-2" /> : <LocateFixed className="h-4 w-4 ml-2" />}
              تحديد موقعي
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Compass Card */}
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-right">البوصلة</CardTitle>
              <CardDescription className="text-right">
                {compassAvailable 
                  ? "وجه جهازك نحو القبلة باتباع السهم الأحمر" 
                  : "جهازك لا يدعم البوصلة، يمكنك استخدام الخريطة بدلاً من ذلك"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex items-center justify-center p-4">
              {loading ? (
                <div className="text-center">
                  <Spinner size="lg" className="mx-auto mb-4" />
                  <p className="text-gray-500">جاري تحميل البوصلة...</p>
                </div>
              ) : !userLocation ? (
                <div className="text-center max-w-md mx-auto">
                  <Map className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">لم يتم تحديد الموقع</h3>
                  <p className="text-gray-500 mb-4">
                    يرجى السماح للتطبيق بالوصول إلى موقعك الجغرافي أو إدخال الموقع يدوياً لتحديد اتجاه القبلة.
                  </p>
                  <Button onClick={getLocation} className="bg-sabeel-primary hover:bg-sabeel-primary/90">
                    <LocateFixed className="h-4 w-4 ml-2" />
                    تحديد موقعي
                  </Button>
                </div>
              ) : (
                <div className="relative w-64 h-64 mx-auto">
                  {/* Compass */}
                  <div 
                    ref={compassRef} 
                    className="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 transition-transform"
                    style={{ transition: "transform 0.5s ease-out" }}
                  >
                    {/* Cardinal Directions */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold">N</div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold">S</div>
                    <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs font-bold">E</div>
                    <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-xs font-bold">W</div>
                    
                    {/* Degree Markers */}
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-0.5 h-3 bg-gray-400 dark:bg-gray-600"
                        style={{
                          left: '50%',
                          top: '0',
                          transformOrigin: 'bottom center',
                          transform: `translateX(-50%) rotate(${i * 30}deg) translateY(1px)`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Qibla Arrow */}
                  <div
                    ref={arrowRef}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform"
                    style={{ transition: "transform 0.5s ease-out" }}
                  >
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 0V64M32 0L24 12H40L32 0Z" fill="#ef4444" />
                      <path d="M32 0V64M32 0L24 12H40L32 0Z" stroke="#ef4444" strokeWidth="3" />
                    </svg>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-200" />
                </div>
              )}
            </CardContent>
            
            {userLocation && qiblaDirection !== null && (
              <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4">
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      <Compass className="h-3 w-3 ml-1" />
                      {qiblaDirection.toFixed(1)}°
                    </Badge>
                    <p className="text-sm font-medium">اتجاه القبلة:</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      <Map className="h-3 w-3 ml-1" />
                      {calculateDistance()} كم
                    </Badge>
                    <p className="text-sm font-medium">المسافة إلى مكة:</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      <MapPin className="h-3 w-3 ml-1" />
                      {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                    </Badge>
                    <p className="text-sm font-medium">موقعك الحالي:</p>
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <Share2 className="h-4 w-4" />
                      مشاركة
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
        
        {/* Controls Card */}
        <div className="md:col-span-1">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-right">تحديد الموقع يدوياً</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1 text-right">خط العرض</label>
                  <Input
                    type="text"
                    placeholder="مثال: 24.7136"
                    value={manualLatitude}
                    onChange={(e) => setManualLatitude(e.target.value)}
                    className="text-right"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1 text-right">خط الطول</label>
                  <Input
                    type="text"
                    placeholder="مثال: 46.6753"
                    value={manualLongitude}
                    onChange={(e) => setManualLongitude(e.target.value)}
                    className="text-right"
                  />
                </div>
                
                <Button onClick={setManualLocation} className="w-full">
                  تحديد القبلة
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-right">اختر مدينة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {majorCities.map(city => (
                    <Button
                      key={city.name}
                      variant={selectedCity === city.name ? "default" : "outline"}
                      className="text-xs h-auto py-2"
                      onClick={() => selectCity(city)}
                    >
                      {city.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-right text-sm">معلومات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  تعتمد دقة اتجاه القبلة على دقة البوصلة في جهازك. لأفضل النتائج، ضع جهازك بعيداً عن المعادن والأجهزة الإلكترونية الأخرى التي قد تؤثر على المجال المغناطيسي.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-2">
                  قم بمعايرة البوصلة بتحريك جهازك على شكل رقم 8 في الهواء.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QiblaFinder;
