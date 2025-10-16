import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import GlobalStyles from './styles/GlobalStyles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import AppContainer from './utils/AppContainer'
import Spinner from './components/GDG-Spinner'
import CertificateDisplay from './pages/CertificateDisplay'
import CheckOut from './pages/CheckOut'
const HomePage =lazy(()=>import( './pages/HomePage'));
const Events =lazy(()=>import('./pages/Events'));
const Team =lazy(()=>import('./pages/Team'));
const AuthPage=lazy(()=>import('./pages/AuthPage'));

const AuthProvider =lazy(()=>import('./contexts/AuthContext'));
const AuthCallback =lazy(()=>import('./pages/AuthCallback'));
const About =lazy(()=>import('./pages/About'));

// Dashboard components
const DashboardLayout = lazy(() => import('./pages/Dashboard/DashboardLayout'));
const Overview = lazy(() => import('./pages/Dashboard/Overview'));
const MyEvents = lazy(() => import('./pages/Dashboard/MyEvents'));
const Certificates = lazy(() => import('./pages/Dashboard/Certificates'));
const Profile = lazy(() => import('./pages/Dashboard/Profile'));
const Teams = lazy(() => import('./pages/Dashboard/Teams'));
const StudyJams = lazy(() => import('./pages/Dashboard/StudyJams'));
const FollowCursor =lazy(()=>import('./components/FollowCursor'));

function App() {
  const { theme } = useTheme();

  
  useEffect(() => {
    document.title = "GDG MMMUT - Google Developer Group"
  }, []);

  return (
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
      {/* Using StyledThemeProvider to apply the theme */}
        <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      <FollowCursor />
      <Routes>
            <Route element={<AppContainer />} >
             <Route path='/' index element={<HomePage />} />
            <Route path='/events' element={<Events />} />
            <Route path='/about' element={<About />} />
            <Route path='/team' element={<Team />} />
            
             </Route>
             <Route path='/auth' element={<AuthPage />} />
             <Route path="/auth/callback" element={<AuthCallback/>} />
             <Route path="/verification/:serial" element={<CertificateDisplay />} />
             <Route path='/rsvp' element={<CheckOut />} />
             
             {/* Dashboard Routes */}
             <Route path="/dashboard" element={<DashboardLayout />}>
               <Route index element={<Overview />} />
               <Route path="events" element={<MyEvents />} />
               <Route path="study-jams" element={<StudyJams />} />
               <Route path="teams" element={<Teams />} />
               <Route path="certificates" element={<Certificates />} />
               <Route path="profile" element={<Profile />} />
             </Route>
          </Routes>
    </StyledThemeProvider>
      </Suspense>
    </AuthProvider>
  )
}

export default App