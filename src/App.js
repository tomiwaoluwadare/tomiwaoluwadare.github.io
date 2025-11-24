import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import PPAMandatoryForm from './mandatory_form/PPAMandatoryForm';
import BEAMandatoryForm from './mandatory_form/BEAMandatoryForm';
import AMWMandatoryForm from './mandatory_form/AMWMandatoryForm';

import PPAEligibilityForm from './eligibility_checks/PPAEligibilityForm';
import BEASEligibilityForm from './eligibility_checks/BEASEligibilityForm';
import AMWEligibilityForm from './eligibility_checks/AMWEligibilityForm';

import PPAResultPage from './eligibility_results/PPAResultPage';
import BEASResultPage from './eligibility_results/BEASResultPage';
import AMWResultPage from './eligibility_results/AMWResultPage';

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/why-us" element={<Home />} />
          <Route path="/products" element={<Home />} />
          <Route path="/how-it-works" element={<Home />} />
          <Route path="/mandatory_form/ppa-form" element={<PPAMandatoryForm />} />
          <Route path="/mandatory_form/beas-form" element={<BEAMandatoryForm />} />
          <Route path="/mandatory_form/amw-form" element={<AMWMandatoryForm />} />

          <Route path="/eligibility_checks/ppa-check" element={<PPAEligibilityForm />} />
          <Route path="/eligibility_checks/beas-check" element={<BEASEligibilityForm />} />
          <Route path="/eligibility_checks/amw-check" element={<AMWEligibilityForm />} />

          <Route path="/eligibility_results/ppa-result" element={<PPAResultPage />} />
          <Route path="/eligibility_results/beas-result" element={<BEASResultPage />} />
          <Route path="/eligibility_results/amw-result" element={<AMWResultPage />} />
        </Routes>
    </Router>
  );
}
