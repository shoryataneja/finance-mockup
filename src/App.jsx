import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import EnquiriesPage from './pages/Enquiries';
import EnquiryDetail from './pages/EnquiryDetail';
import BanksPage from './pages/Banks';
import ScoreBandsPage from './pages/ScoreBands';
import UsersPage from './pages/Users';
import ProfilePage from './pages/Profile';
import TeamPage from './pages/Team';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/home"          element={<HomePage />} />
          <Route path="/enquiries"     element={<EnquiriesPage />} />
          <Route path="/enquiries/:id" element={<EnquiryDetail />} />
          <Route path="/banks"         element={<BanksPage />} />
          <Route path="/score-bands"   element={<ScoreBandsPage />} />
          <Route path="/users"         element={<UsersPage />} />
          <Route path="/team"          element={<TeamPage />} />
          <Route path="/profile"       element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
