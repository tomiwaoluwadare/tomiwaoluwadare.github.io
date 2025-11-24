import { useState, useEffect } from 'react';
import { 
  FaBolt, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaInfoCircle,
  FaArrowLeft,
  FaArrowRight,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCheck,
  FaTimes,
  FaTools,
  FaSolarPanel
} from 'react-icons/fa';
import Header from '../homepage/Header';
import Footer from '../homepage/Footer';

export default function AMWMandatoryForm() {

  // Initialize form data from localStorage
  const getInitialFormData = () => {
    if (typeof window === 'undefined') {
      return {
        companyName: '',
        intervention: '',
        officerName: '',
        postcode: '',
        contact: '',
        termsAccepted: false
      };
    }

    return {
      companyName: localStorage.getItem('beas_grants_companyName') || '',
      intervention: localStorage.getItem('beas_grants_intervention') || '',
      officerName: localStorage.getItem('beas_grants_officerName') || '',
      postcode: localStorage.getItem('beas_grants_postcode') || '',
      contact: localStorage.getItem('beas_grants_contact') || '',
      termsAccepted: JSON.parse(localStorage.getItem('beas_grants_termsAccepted') || 'false')
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [validationErrors, setValidationErrors] = useState({
    companyName: '',
    intervention: '',
    officerName: '',
    postcode: '',
    contact: ''
  });

  const [fieldValidity, setFieldValidity] = useState({
    companyName: true,
    intervention: true,
    officerName: true,
    postcode: true,
    contact: true
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Object.keys(formData).forEach(key => {
        if (key === 'termsAccepted') {
          localStorage.setItem(`beas_grants_${key}`, JSON.stringify(formData[key]));
        } else {
          localStorage.setItem(`beas_grants_${key}`, formData[key]);
        }
      });
    }
  }, [formData]);

  // Validation functions
  const validateCompanyName = (name) => {
    if (!name.trim()) {
      return 'Company name is required';
    }
    if (name.trim().length < 2) {
      return 'Company name must be at least 2 characters';
    }
    return '';
  };

  const validateIntervention = (intervention) => {
    if (!intervention) {
      return 'Intervention type is required';
    }
    const validInterventions = ['Solar', 'LED', 'EV chargers', 'CHP heating', 'Other'];
    if (!validInterventions.includes(intervention)) {
      return 'Please select a valid intervention type';
    }
    return '';
  };

  const validateOfficerName = (name) => {
    if (!name.trim()) {
      return 'Officer name is required';
    }
    if (name.trim().length < 2) {
      return 'Officer name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return 'Officer name can only contain letters and spaces';
    }
    return '';
  };

  const validateUKPostcode = (postcode) => {
    if (!postcode.trim()) {
      return 'Postcode is required';
    }
    
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    const formattedPostcode = postcode.toUpperCase().replace(/\s/g, '');
    
    if (!ukPostcodeRegex.test(formattedPostcode)) {
      return 'Please enter a valid UK postcode';
    }
    return '';
  };

  const validateContact = (contact) => {
    if (!contact.trim()) {
      return 'Contact information is required';
    }
    
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if it's a UK phone number
    const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    
    if (!emailRegex.test(contact) && !phoneRegex.test(contact.replace(/\s/g, ''))) {
      return 'Please enter a valid email or UK phone number';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate on keyup
    let error = '';
    let isValid = true;

    switch (name) {
      case 'companyName':
        error = validateCompanyName(newValue);
        isValid = !error;
        break;
      case 'intervention':
        error = validateIntervention(newValue);
        isValid = !error;
        break;
      case 'officerName':
        error = validateOfficerName(newValue);
        isValid = !error;
        break;
      case 'postcode':
        error = validateUKPostcode(newValue);
        isValid = !error;
        break;
      case 'contact':
        error = validateContact(newValue);
        isValid = !error;
        break;
      default:
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setFieldValidity(prev => ({
      ...prev,
      [name]: isValid
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final validation before submission
    const errors = {
      companyName: validateCompanyName(formData.companyName),
      intervention: validateIntervention(formData.intervention),
      officerName: validateOfficerName(formData.officerName),
      postcode: validateUKPostcode(formData.postcode),
      contact: validateContact(formData.contact)
    };

    setValidationErrors(errors);

    const isValid = Object.values(errors).every(error => error === '');
    
    if (isValid && formData.termsAccepted) {
      console.log('BEAS Grants Form Data:', formData);
      
      // Save final form data to localStorage
      Object.keys(formData).forEach(key => {
        if (key === 'termsAccepted') {
          localStorage.setItem(`beas_grants_${key}`, JSON.stringify(formData[key]));
        } else {
          localStorage.setItem(`beas_grants_${key}`, formData[key]);
        }
      });

      // Navigate to eligibility check page
      window.location.replace('#/eligibility_checks/amw-form');
      
    } else {
      console.log('Form has validation errors');
    }
  };

  const isFormValid = () => {
    return Object.values(fieldValidity).every(valid => valid) && formData.termsAccepted;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white py-8 mt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Main Form Section */}
            <div className="lg:col-span-4">
              {/* Grant Information Notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <FaInfoCircle className="w-6 h-6 text-green-600 mt-0.5 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-900 text-lg mb-2">Grant Application</h3>
                    <p className="text-green-700 mb-3">
                      Complete this form to apply for energy efficiency grants and business upgrade funding.
                      Your progress will be saved automatically.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Company Information Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaBuilding className="w-6 h-6 mr-3 text-green-600" />
                    Business Details
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Company Name */}
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-3">
                        Company Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          onKeyUp={(e) => handleChange(e)}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg ${
                            fieldValidity.companyName ? 'border-gray-300' : 'border-red-500'
                          }`}
                          required
                        />
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.companyName && formData.companyName ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.companyName ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaBuilding className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.companyName && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.companyName}
                        </p>
                      )}
                    </div>

                    {/* Intervention Type */}
                    <div>
                      <label htmlFor="intervention" className="block text-sm font-semibold text-gray-700 mb-3">
                        Desired Energy Intervention
                      </label>
                      <p className="text-gray-600 text-sm mb-4">
                        Select the type of energy efficiency upgrade you wish to apply for
                      </p>
                      <div className="relative">
                        <select
                          id="intervention"
                          name="intervention"
                          value={formData.intervention}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg appearance-none ${
                            fieldValidity.intervention ? 'border-gray-300' : 'border-red-500'
                          }`}
                          required
                        >
                          <option value="">Select intervention type</option>
                          <option value="Solar">Solar Panel Installation</option>
                          <option value="LED">LED Lighting Upgrade</option>
                          <option value="EV chargers">EV Charging Infrastructure</option>
                          <option value="CHP heating">CHP Heating Systems</option>
                          <option value="Other">Other Energy Efficiency Measures</option>
                        </select>
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.intervention && formData.intervention ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.intervention ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaSolarPanel className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.intervention && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.intervention}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaUser className="w-6 h-6 mr-3 text-green-600" />
                    Authorised Contact
                  </h2>

                  <div className="space-y-6">
                    {/* Officer Name */}
                    <div>
                      <label htmlFor="officerName" className="block text-sm font-semibold text-gray-700 mb-3">
                        Authorised Company Officer
                      </label>
                      <p className="text-gray-600 text-sm mb-4">
                        Full name of the designated officer authorised to manage grant applications
                      </p>
                      <div className="relative">
                        <input
                          type="text"
                          id="officerName"
                          name="officerName"
                          value={formData.officerName}
                          onChange={handleChange}
                          onKeyUp={(e) => handleChange(e)}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg ${
                            fieldValidity.officerName ? 'border-gray-300' : 'border-red-500'
                          }`}
                          required
                        />
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.officerName && formData.officerName ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.officerName ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaUser className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.officerName && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.officerName}
                        </p>
                      )}
                    </div>

                    {/* Postcode */}
                    <div>
                      <label htmlFor="postcode" className="block text-sm font-semibold text-gray-700 mb-3">
                        Business Premises Postcode
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="postcode"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          onKeyUp={(e) => handleChange(e)}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg ${
                            fieldValidity.postcode ? 'border-gray-300' : 'border-red-500'
                          }`}
                          required
                        />
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.postcode && formData.postcode ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.postcode ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.postcode && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.postcode}
                        </p>
                      )}
                    </div>

                    {/* Contact */}
                    <div>
                      <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-3">
                        Email or Phone Number
                      </label>
                      <p className="text-gray-600 text-sm mb-4">
                        We'll contact you at this address or number regarding your grant application
                      </p>
                      <div className="relative">
                        <input
                          type="text"
                          id="contact"
                          name="contact"
                          value={formData.contact}
                          onChange={handleChange}
                          onKeyUp={(e) => handleChange(e)}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg ${
                            fieldValidity.contact ? 'border-gray-300' : 'border-red-500'
                          }`}
                          required
                        />
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.contact && formData.contact ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.contact ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : formData.contact.includes('@') ? (
                            <FaEnvelope className="w-5 h-5 text-gray-400" />
                          ) : (
                            <FaPhone className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.contact && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.contact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start mb-4">
                    <FaShieldAlt className="w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-900">Grant Terms & Data Protection</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    We process your business information to assess grant eligibility and connect you with energy efficiency programs. 
                    Your application data is protected under government data protection regulations.
                  </p>
                  
                  <label className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I accept the <a href="#" className="text-green-600 hover:text-green-800 underline font-medium">grant terms and conditions</a> and have read the <a href="#" className="text-green-600 hover:text-green-800 underline font-medium">data protection policy</a>
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6">
                  <a
                    onClick={() => window.location.href = '/#products'}
                    className="px-8 py-4 border cursor-pointer border-gray-300 rounded-lg text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center"
                  >
                    <FaArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </a>
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg text-base font-semibold text-white hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Submit Application
                    <FaArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar - Benefits */}
            <div className="lg:col-span-2">
              <div className="sticky top-30">
                <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center">
                  <FaCheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  Grant Benefits
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaBolt className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">Funding Support</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Receive up to 50% funding for energy efficiency upgrades and installations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaTools className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">Reduced Bills</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Lower energy costs with modern, efficient systems and renewable technology
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaShieldAlt className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">Carbon Reduction</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Meet environmental targets and improve your business sustainability credentials
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Persistence Notice */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <FaInfoCircle className="w-4 h-4 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-900 text-sm">Auto-Save Enabled</h4>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Your progress is automatically saved. You can return anytime to complete your application.
                    </p>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center">
                      <FaShieldAlt className="w-5 h-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-900 text-sm">Government Approved</h4>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Official BEAS grant program with secure data handling and compliance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}