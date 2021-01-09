import { useEffect, useState } from "react";
export interface Position {
  latitude?: number;
  longitude?: number;
}
export const usePosition = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<PositionError | null>(null);
  const [active, setActive] = useState(true);

  const onChange = ({ coords }: { coords: Position }) => {
    setPosition(
      coords.latitude != null && coords.longitude != null
        ? {
            latitude: coords.latitude,
            longitude: coords.longitude
          }
        : null
    );
    if (!active) {
      setActive(true);
    }
    if (error) {
      setError(null);
    }
  };
  const onError: PositionErrorCallback = error => {
    setError(error);
    setActive(false);
  };
  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { position, error, active };
};
