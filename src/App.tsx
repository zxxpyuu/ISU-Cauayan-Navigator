
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Login } from './components/Login';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { Dashboard } from './pages/Dashboard';
import { Search } from './pages/Search';
import { MapView } from './pages/MapView';
import { About } from './pages/About';
import { StudentManual } from './pages/StudentManual';
import { Credit } from './pages/Credit';
import { EmergencyHotlines } from './pages/EmergencyHotlines';
import { CAMPUS_BOUNDARY } from './data/campusGeoJSON';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

function AppShell({ onSignOut }: { onSignOut?: () => void }) {
  const location = useLocation();
  // Float toggle slightly higher when on the map so it doesn't overlap the detail panel handle
  const isMap = location.pathname === '/map';
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-isu-charcoal">
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/about" element={<About />} />
          <Route path="/credit" element={<Credit />} />
          <Route path="/student-manual" element={<StudentManual />} />
          <Route path="/emergency-hotlines" element={<EmergencyHotlines />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>

        {/* Persistent floating dark mode toggle */}
        <div
          className={`absolute right-4 z-[1100] transition-all duration-300 ${isMap ? 'bottom-[42%]' : 'bottom-4'}`}>
          
          <ThemeToggle />
        </div>
      </div>
      <BottomNav onSignOut={onSignOut} />
    </div>);

}

function isInsideCampus(latitude: number, longitude: number) {
  let inside = false;

  for (let index = 0, previous = CAMPUS_BOUNDARY.length - 1; index < CAMPUS_BOUNDARY.length; previous = index++) {
    const [currentLongitude, currentLatitude] = CAMPUS_BOUNDARY[index];
    const [previousLongitude, previousLatitude] = CAMPUS_BOUNDARY[previous];
    const crossProduct =
      (longitude - currentLongitude) * (previousLatitude - currentLatitude) -
      (latitude - currentLatitude) * (previousLongitude - currentLongitude);
    const isOnBoundary =
      Math.abs(crossProduct) < 1e-8 &&
      longitude >= Math.min(currentLongitude, previousLongitude) &&
      longitude <= Math.max(currentLongitude, previousLongitude) &&
      latitude >= Math.min(currentLatitude, previousLatitude) &&
      latitude <= Math.max(currentLatitude, previousLatitude);

    if (isOnBoundary) return true;

    const crossesRay =
      currentLatitude > latitude !== previousLatitude > latitude &&
      longitude <
        ((previousLongitude - currentLongitude) * (latitude - currentLatitude)) /
          (previousLatitude - currentLatitude) +
          currentLongitude;

    if (crossesRay) inside = !inside;
  }

  return inside;
}

function CampusAccessGate({
  children,
  fallback
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const [status, setStatus] = useState<'checking' | 'inside' | 'outside' | 'unavailable'>(
    'checking'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setStatus('checking');
    setErrorMessage('');

    if (!navigator.geolocation) {
      setStatus('unavailable');
      setErrorMessage('Location services are not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setStatus(isInsideCampus(coords.latitude, coords.longitude) ? 'inside' : 'outside');
      },
      (error) => {
        setStatus('unavailable');
        setErrorMessage(
          error.code === error.PERMISSION_DENIED
            ? 'Allow location access in your browser to use the campus navigator.'
            : error.code === error.POSITION_UNAVAILABLE
              ? 'Your location is unavailable. Check that location services are enabled.'
              : 'Location check timed out. Try again.'
        );
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [attempt]);

  if (status === 'inside') return children;
  if (status !== 'checking') {
    return (
      <>
        <div className="fixed inset-x-4 top-4 z-[1200] mx-auto max-w-xl rounded-xl bg-white/95 p-3 text-center text-sm text-gray-700 shadow-lg dark:bg-isu-charcoal-light dark:text-gray-200">
          <p>
            {status === 'outside'
              ? 'You are outside campus. Sign in below with a confirmed ISU account to access the app, or enter campus for guest access.'
              : errorMessage}
          </p>
          <button
            type="button"
            onClick={() => setAttempt((current) => current + 1)}
            className="mt-2 font-semibold text-isu-green underline dark:text-isu-mint"
          >
            Check location again
          </button>
        </div>
        {fallback}
      </>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 dark:bg-isu-charcoal">
      <section
        className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl dark:bg-isu-charcoal-light"
        aria-live="polite"
      >
        <img
          src="/isu_new_seal_512x512.png"
          alt="ISU seal"
          className="mx-auto mb-5 h-16 w-16 rounded-full bg-white p-1"
        />
        <h1 className="text-xl font-semibold text-isu-green dark:text-isu-mint">
          Checking campus access
        </h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Checking whether you are on the ISU Cauayan campus...
        </p>
        <p className="mt-5 text-xs text-gray-500 dark:text-gray-400">
          If you are off campus, sign in with a confirmed ISU account to continue.
        </p>
      </section>
    </main>
  );
}

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!supabase) return;

    let isMounted = true;
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          setAuthError(error.message);
        } else {
          setSession(data.session);
        }
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setAuthError(error instanceof Error ? error.message : 'Unable to load your account.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setAuthError(error.message);
      else setAuthError('');
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign out.');
    }
  };

  if (supabase && isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600 dark:bg-isu-charcoal dark:text-gray-200">
        Loading your account...
      </main>
    );
  }

  const isVerifiedIsuAccount =
    Boolean(session?.user.email_confirmed_at) &&
    /^[a-z0-9]+\.[a-z0-9]+_cyn@isu\.edu\.ph$/i.test(session?.user.email ?? '');

  const app = (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell onSignOut={isVerifiedIsuAccount ? signOut : undefined} />
        {authError && (
          <p
            className="fixed bottom-20 left-4 right-4 z-[1200] mx-auto max-w-md rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 shadow-lg"
            role="alert"
          >
            {authError}
          </p>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );

  if (isVerifiedIsuAccount) return app;

  return (
    <CampusAccessGate fallback={<Login />}>
      {app}
    </CampusAccessGate>
  );

}