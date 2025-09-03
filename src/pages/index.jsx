import Layout from './Layout.jsx';

import Home from './Home';

import JobDetail from './JobDetail';

import Profile from './Profile';

import TalentDashboard from './TalentDashboard';

import EmployerDashboard from './EmployerDashboard';

import PostJob from './PostJob';

import ManageJob from './ManageJob';

import Pricing from './Pricing';

import About from './About';

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AuthPage from './AuthPage.jsx';

const PAGES = {
  Home: Home,

  JobDetail: JobDetail,

  Profile: Profile,

  TalentDashboard: TalentDashboard,

  EmployerDashboard: EmployerDashboard,

  PostJob: PostJob,

  ManageJob: ManageJob,

  Pricing: Pricing,

  About: About,
};

function _getCurrentPage(url) {
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split('/').pop();
  if (urlLastPart.includes('?')) {
    urlLastPart = urlLastPart.split('?')[0];
  }

  const pageName = Object.keys(PAGES).find(
    page => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        <Route path="/Auth" element={<AuthPage />} />

        <Route path="*" element={<div>404</div>} />

        <Route path="/" element={<Home />} />

        <Route path="/Home" element={<Home />} />

        <Route path="/JobDetail" element={<JobDetail />} />

        <Route path="/Profile" element={<Profile />} />

        <Route path="/TalentDashboard" element={<TalentDashboard />} />

        <Route path="/EmployerDashboard" element={<EmployerDashboard />} />

        <Route path="/PostJob" element={<PostJob />} />
        <Route path="/PostJob/:id" element={<PostJob />} />

        <Route path="/ManageJob/:id" element={<ManageJob />} />
        <Route path="/Pricing" element={<Pricing />} />

        <Route path="/About" element={<About />} />
      </Routes>
    </Layout>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
