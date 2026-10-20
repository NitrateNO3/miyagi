import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { StoreProvider } from './store/Store'
import { AudioProvider } from './store/Audio'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import SmoothScroll, { scrollTop } from './components/SmoothScroll'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import Corporate from './pages/Corporate'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Journal from './pages/Journal'
import Post from './pages/Post'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()
  return (
    <StoreProvider>
      <AudioProvider>
        <SmoothScroll />
        <Preloader />
        <Cursor />
        <Nav />
        <AnimatePresence mode="wait" onExitComplete={scrollTop}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProgramDetail />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:id" element={<Post />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </AudioProvider>
    </StoreProvider>
  )
}
