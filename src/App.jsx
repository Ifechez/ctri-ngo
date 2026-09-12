import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'

import PublicLayout from './components/public/PublicLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import DashboardLayout from './components/admin/DashboardLayout'

import Home from './pages/public/Home'
import About from './pages/public/About'
import Blog from './pages/public/Blog'
import BlogPostPage from './pages/public/BlogPostPage'
import Projects from './pages/public/Projects'
import ProjectDetail from './pages/public/ProjectDetail'
import Contact from './pages/public/Contact'
import NotFound from './pages/public/NotFound'

import Login from './pages/admin/Login'
import DashboardHome from './pages/admin/DashboardHome'
import TeamList from './pages/admin/TeamList'
import BlogList from './pages/admin/BlogList'
import ProjectsList from './pages/admin/ProjectsList'
import AdminSettings from './pages/admin/AdminSettings'
import Messages from './pages/admin/Messages'

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Work Sans, sans-serif', fontSize: '14px' } }} />
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="team" element={<TeamList />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </SettingsProvider>
    </AuthProvider>
  )
}
