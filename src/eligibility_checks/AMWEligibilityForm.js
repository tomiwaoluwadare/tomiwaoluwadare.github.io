// "use client";
import { useState, useEffect } from 'react';
import { 
  FaSolarPanel, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaInfoCircle,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaPiggyBank,
  FaThermometerHalf,
  FaCertificate,
  FaHome,
  FaIndustry,
  FaLightbulb,
  FaCar,
  FaTree,
  FaRulerCombined,
  FaBuilding,
  FaMapMarkerAlt,
  FaExclamationTriangle
} from 'react-icons/fa';

import Header from '../homepage/Header';
import Footer from '../homepage/Footer';

export default function AMWEligibilityForm() {

  // Initialize with localStorage data directly to avoid flash of empty state
  const getInitialFormData = () => {
    if (typeof window === 'undefined') {
      return {
        energyUsage: '',
        siteLocations: '',
        roofSize: '',
        roofCondition: '',
        asbestosPresent: '',
        ledLighting: '',
        heatingSystem: '',
        businessGrounds: '',
        carportsRequired: '',
        solarSuitability: '',
        termsAccepted: false
      };
    }

    return {
      energyUsage: localStorage.getItem('amw_energyUsage') || '',
      siteLocations: localStorage.getItem('amw_siteLocations') || '',
      roofSize: localStorage.getItem('amw_roofSize') || '',
      roofCondition: localStorage.getItem('amw_roofCondition') || '',
      asbestosPresent: localStorage.getItem('amw_asbestosPresent') || '',
      ledLighting: localStorage.getItem('amw_ledLighting') || '',
      heatingSystem: localStorage.getItem('amw_heatingSystem') || '',
      businessGrounds: localStorage.getItem('amw_businessGrounds') || '',
      carportsRequired: localStorage.getItem('amw_carportsRequired') || '',
      solarSuitability: localStorage.getItem('amw_solarSuitability') || '',
      termsAccepted: JSON.parse(localStorage.getItem('amw_termsAccepted') || 'false')
    };
  };

  const getInitialFieldValidity = (formData) => {
    return {
      energyUsage: Number(formData.energyUsage) >= 150,
      siteLocations: Number(formData.siteLocations) > 0,
      roofSize: Number(formData.roofSize) > 0,
      roofCondition: !!formData.roofCondition,
      asbestosPresent: !!formData.asbestosPresent,
      ledLighting: !!formData.ledLighting,
      heatingSystem: !!formData.heatingSystem,
      businessGrounds: !!formData.businessGrounds,
      carportsRequired: !!formData.carportsRequired,
      solarSuitability: !!formData.solarSuitability
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [fieldValidity, setFieldValidity] = useState(() => getInitialFieldValidity(getInitialFormData()));

  const [validationErrors, setValidationErrors] = useState({
    energyUsage: '',
    siteLocations: '',
    roofSize: '',
    roofCondition: '',
    asbestosPresent: '',
    ledLighting: '',
    heatingSystem: '',
    businessGrounds: '',
    carportsRequired: '',
    solarSuitability: ''
  });

  const validateField = (name, value) => {
    let error = '';
    let isValid = true;

    switch (name) {
      case 'energyUsage':
        if (!value) {
          error = 'Please enter your annual energy usage';
          isValid = false;
        } else if (isNaN(value) || Number(value) <= 0) {
          error = 'Please enter a valid energy usage amount';
          isValid = false;
        } /* else if (Number(value) < 150) {
          error = 'Minimum energy usage requirement is 150 kWh per year';
          isValid = false;
        } */ else {
          isValid = true;
        }
        break;
      case 'siteLocations':
        if (!value) {
          error = 'Please enter number of site locations';
          isValid = false;
        } else if (isNaN(value) || Number(value) <= 0) {
          error = 'Please enter a valid number of sites';
          isValid = false;
        } else {
          isValid = true;
        }
        break;
      case 'roofSize':
        if (!value) {
          error = 'Please enter roof size';
          isValid = false;
        } else if (isNaN(value) || Number(value) <= 0) {
          error = 'Please enter a valid roof size';
          isValid = false;
        } else {
          isValid = true;
        }
        break;
      case 'roofCondition':
        if (!value) error = 'Please select roof condition';
        isValid = !error;
        break;
      case 'asbestosPresent':
        if (!value) error = 'Please specify asbestos status';
        isValid = !error;
        break;
      case 'ledLighting':
        if (!value) error = 'Please specify LED lighting status';
        isValid = !error;
        break;
      case 'heatingSystem':
        if (!value) error = 'Please select heating system type';
        isValid = !error;
        break;
      case 'businessGrounds':
        if (!value) error = 'Please specify if you have business grounds';
        isValid = !error;
        break;
      case 'carportsRequired':
        if (!value) error = 'Please specify carport requirements';
        isValid = !error;
        break;
      case 'solarSuitability':
        if (!value) error = 'Please select solar suitability';
        isValid = !error;
        break;
      default:
        break;
    }

    return { error, isValid };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const updatedData = { ...prev, [name]: newValue };
      
      // Save to localStorage
      if (name === 'termsAccepted') {
        localStorage.setItem(`amw_${name}`, JSON.stringify(newValue));
      } else {
        localStorage.setItem(`amw_${name}`, newValue);
      }

      return updatedData;
    });

    const { error, isValid } = validateField(name, newValue);

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
      energyUsage: validateField('energyUsage', formData.energyUsage).error,
      siteLocations: validateField('siteLocations', formData.siteLocations).error,
      roofSize: validateField('roofSize', formData.roofSize).error,
      roofCondition: validateField('roofCondition', formData.roofCondition).error,
      asbestosPresent: validateField('asbestosPresent', formData.asbestosPresent).error,
      ledLighting: validateField('ledLighting', formData.ledLighting).error,
      heatingSystem: validateField('heatingSystem', formData.heatingSystem).error,
      businessGrounds: validateField('businessGrounds', formData.businessGrounds).error,
      carportsRequired: validateField('carportsRequired', formData.carportsRequired).error,
      solarSuitability: validateField('solarSuitability', formData.solarSuitability).error
    };

    setValidationErrors(errors);

    window.location.replace('#/eligibility_results/amw-result');
  };

  const isFormValid = () => {
    return Object.values(fieldValidity).every(Boolean) && formData.termsAccepted;
  };

  const roofConditions = [
    { value: 'excellent', label: 'Excellent - Less than 5 years old' },
    { value: 'good', label: 'Good - 5-10 years old' },
    { value: 'fair', label: 'Fair - 10-15 years old' },
    { value: 'poor', label: 'Poor - Over 15 years old or needs repair' }
  ];

  const heatingSystems = [
    { value: 'gas', label: 'Gas Boiler' },
    { value: 'electric', label: 'Electric Heating' },
    { value: 'oil', label: 'Oil Heating' },
    { value: 'heat_pump', label: 'Heat Pump' },
    { value: 'district', label: 'District Heating' },
    { value: 'other', label: 'Other' }
  ];

  const solarOptions = [
    { value: 'roof_only', label: 'Roof-mounted only' },
    { value: 'ground_only', label: 'Ground-mounted only' },
    { value: 'both', label: 'Both roof and ground options suitable' },
    { value: 'unsure', label: 'Not sure - need assessment' }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white py-8 mt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Main Form Section */}
            <div className="lg:col-span-4">
              {/* Scheme Information */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <FaInfoCircle className="w-6 h-6 text-green-600 mt-0.5 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-900 text-lg mb-2">AMW Renewable Energy PPA Program</h3>
                    <p className="text-green-700 mb-3">
                      Zero upfront cost Power Purchase Agreement with up to 50% energy savings, 
                      25 years fixed billing, and a clear pathway to net zero for your business.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Site Assessment Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaBuilding className="w-6 h-6 mr-3 text-green-600" />
                    Site Assessment
                  </h2>

                  <div className="space-y-6">
                    {/* Energy Usage */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Annual Electricity Usage (kWh)
                      </h3>
                      {/* <p className="text-gray-600 mb-4">
                        Minimum requirement: 150,000 kWh per year for PPA eligibility
                      </p> */}
                      <div className="relative">
                        <input
                          type="number"
                          name="energyUsage"
                          value={formData.energyUsage}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg ${
                            fieldValidity.energyUsage ? "border-gray-300" : "border-red-500"
                          }`}
                          required
                          /* min="150"
                          step="1000" */
                        />
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.energyUsage && formData.energyUsage ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.energyUsage && formData.energyUsage ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaIndustry className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.energyUsage && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.energyUsage}
                        </p>
                      )}
                      {/* {formData.energyUsage && Number(formData.energyUsage) >= 150 && (
                        <p className="text-green-600 text-sm mt-2 flex items-center">
                          <FaCheck className="w-3 h-3 mr-1" />
                          Meets minimum energy usage requirement
                        </p>
                      )} */}
                    </div>

                    {/* Site Locations */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Number of Site Locations
                      </h3>
                      <div className="relative">
                        <input
                          type="number"
                          name="siteLocations"
                          value={formData.siteLocations}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg ${
                            fieldValidity.siteLocations ? "border-gray-300" : "border-red-500"
                          }`}
                          required
                          min="1"
                        />
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.siteLocations && formData.siteLocations ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.siteLocations && formData.siteLocations ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.siteLocations && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.siteLocations}
                        </p>
                      )}
                    </div>

                    {/* Roof Size */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Available Roof Space (m²)
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Approximate area available for solar panel installation
                      </p>
                      <div className="relative">
                        <input
                          type="number"
                          name="roofSize"
                          value={formData.roofSize}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg ${
                            fieldValidity.roofSize ? "border-gray-300" : "border-red-500"
                          }`}
                          required
                          /* min="1"
                          step="10" */
                        />
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.roofSize && formData.roofSize ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.roofSize && formData.roofSize ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaRulerCombined className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.roofSize && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.roofSize}
                        </p>
                      )}
                    </div>

                    {/* Roof Condition */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Current Roof Condition
                      </h3>
                      <div className="space-y-3">
                        {roofConditions.map((condition) => (
                          <label key={condition.value} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="roofCondition"
                              value={condition.value}
                              checked={formData.roofCondition === condition.value}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
                              required
                            />
                            <span className="font-medium text-gray-700">{condition.label}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.roofCondition && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.roofCondition}
                        </p>
                      )}
                    </div>

                    {/* Asbestos */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Is there asbestos present on the roof or in the building?
                      </h3>
                      <div className="flex space-x-6">
                        {['Yes', 'No', 'Unknown'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="asbestosPresent"
                              value={option}
                              checked={formData.asbestosPresent === option}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
                              required
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.asbestosPresent && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.asbestosPresent}
                        </p>
                      )}
                      {formData.asbestosPresent === 'Yes' && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-700 text-sm flex items-center">
                            <FaExclamationTriangle className="w-4 h-4 mr-2" />
                            Asbestos may require additional assessment and remediation costs
                          </p>
                        </div>
                      )}
                    </div>

                    {/* LED Lighting */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Does your business already have LED lighting installed?
                      </h3>
                      <div className="flex space-x-6">
                        {['Yes', 'No', 'Partial'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="ledLighting"
                              value={option}
                              checked={formData.ledLighting === option}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
                              required
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.ledLighting && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.ledLighting}
                        </p>
                      )}
                    </div>

                    {/* Heating System */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        What type of heating system does your business use?
                      </h3>
                      <div className="relative">
                        <select
                          name="heatingSystem"
                          value={formData.heatingSystem}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg appearance-none ${
                            fieldValidity.heatingSystem ? "border-gray-300" : "border-red-500"
                          }`}
                          required
                        >
                          <option value="">Select heating system</option>
                          {heatingSystems.map((system) => (
                            <option key={system.value} value={system.value}>
                              {system.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.heatingSystem && formData.heatingSystem ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.heatingSystem && formData.heatingSystem ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaThermometerHalf className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.heatingSystem && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.heatingSystem}
                        </p>
                      )}
                    </div>

                    {/* Business Grounds */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Does your business have available grounds around the property?
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Suitable for ground-mounted solar panels or other renewable installations
                      </p>
                      <div className="flex space-x-6">
                        {['Yes', 'No'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="businessGrounds"
                              value={option}
                              checked={formData.businessGrounds === option}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
                              required
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.businessGrounds && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.businessGrounds}
                        </p>
                      )}
                    </div>

                    {/* Carports */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Are carports with solar panels required on site?
                      </h3>
                      <div className="flex space-x-6">
                        {['Yes', 'No', 'Possible Future'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="carportsRequired"
                              value={option}
                              checked={formData.carportsRequired === option}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
                              required
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.carportsRequired && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.carportsRequired}
                        </p>
                      )}
                    </div>

                    {/* Solar Suitability */}
                    <div className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Is your site suitable for solar panel installation?
                      </h3>
                      <div className="relative">
                        <select
                          name="solarSuitability"
                          value={formData.solarSuitability}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg appearance-none ${
                            fieldValidity.solarSuitability ? "border-gray-300" : "border-red-500"
                          }`}
                          required
                        >
                          <option value="">Select solar suitability</option>
                          {solarOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.solarSuitability && formData.solarSuitability ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.solarSuitability && formData.solarSuitability ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaSolarPanel className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {validationErrors.solarSuitability && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.solarSuitability}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start mb-4">
                    <FaShieldAlt className="w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-900">Terms & Data Protection</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    We process your business information to assess eligibility for our Power Purchase Agreement program. 
                    Your data is protected under GDPR and will only be used for renewable energy assessment purposes.
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
                      I confirm the information provided is accurate and I accept the {' '}
                      <a href="#" className="text-green-600 hover:text-green-800 underline font-medium">terms and conditions</a> 
                      {' '}and have read the {' '}
                      <a href="#" className="text-green-600 hover:text-green-800 underline font-medium">privacy policy</a>
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6">
                  <button
                    type="button"
                    onClick={() => window.location.href = '#/mandatory_form/amw-form'}
                    className="px-8 py-4 border border-gray-300 rounded-lg text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center"
                  >
                    <FaArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg text-base font-semibold text-white hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Check PPA Eligibility
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
                  PPA Benefits
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaPiggyBank className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">Zero Upfront Cost</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        No capital investment required - we fund and maintain all equipment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaSolarPanel className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">50% Energy Savings</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Significant reduction in energy costs with renewable power
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaCertificate className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">25 Years Fixed Billing</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Predictable energy costs with long-term price stability
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaTree className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">Carbon Credits</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Earn carbon credits and achieve net zero targets
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaHome className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">New Roofing Options</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Roof replacement and maintenance included in PPA
                      </p>
                    </div>
                  </div>
                </div>

                {/* Funding Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center">
                      <FaInfoCircle className="w-5 h-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-900 text-sm">£30M Funding Available</h4>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Comprehensive renewable energy solutions including Solar PV, LED lighting, EV chargers, and heating systems
                    </p>
                  </div>
                </div>

                {/* Eligibility Tips */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaLightbulb className="w-4 h-4 text-blue-600 mr-2" />
                    <h5 className="font-semibold text-blue-900 text-sm">Eligibility Tips</h5>
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Minimum 150,000 kWh annual electricity usage</li>
                    <li>• Good roof condition preferred</li>
                    <li>• No asbestos issues ideal</li>
                    <li>• Available ground space beneficial</li>
                  </ul>
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