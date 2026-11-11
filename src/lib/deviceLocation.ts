import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export interface DeviceCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface DeviceLocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
}

export async function watchDeviceLocation(
  onPosition: (coordinates: DeviceCoordinates) => void,
  onError: (message: string) => void,
  options: DeviceLocationOptions
): Promise<() => void> {
  if (Capacitor.isNativePlatform()) {
    let permission = await Geolocation.checkPermissions();

    if (permission.location !== 'granted' && permission.coarseLocation !== 'granted') {
      permission = await Geolocation.requestPermissions({ permissions: ['location'] });
    }

    if (permission.location !== 'granted' && permission.coarseLocation !== 'granted') {
      throw new Error('Location permission was denied. Allow location access in your device settings to continue.');
    }

    const watchId = await Geolocation.watchPosition(options, (position, error) => {
      if (error) {
        onError(error instanceof Error ? error.message : 'Unable to get your device location.');
        return;
      }

      if (position) onPosition(position.coords);
    });

    return () => {
      void Geolocation.clearWatch({ id: watchId }).catch((error: unknown) => {
        console.error('Unable to stop the device location watch.', error);
      });
    };
  }

  if (!navigator.geolocation) {
    throw new Error('Location services are not supported by this browser.');
  }

  const watchId = navigator.geolocation.watchPosition(
    ({ coords }) => onPosition(coords),
    (error) => {
      const message =
        error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. Allow access in your browser settings to use live location.'
          : error.code === error.POSITION_UNAVAILABLE
            ? 'Your location is unavailable right now.'
            : 'The location request timed out. Try again.';
      onError(message);
    },
    options
  );

  return () => navigator.geolocation.clearWatch(watchId);
}
