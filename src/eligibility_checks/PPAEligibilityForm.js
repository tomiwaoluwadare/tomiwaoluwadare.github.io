// "use client";
import { useState, useEffect } from 'react';
import { 
  FaHome, 
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
  FaClock, 
  FaRulerCombined
} from 'react-icons/fa';

import Header from '../homepage/Header';
import Footer from '../homepage/Footer';

export default function PPAEligibilityForm() {

  // Initialize with localStorage data directly to avoid flash of empty state
  const getInitialFormData = () => {
    if (typeof window === 'undefined') {
      return {
        nameOnBill: '',
        floorArea: '',
        pensionCredit: '',
        propertyAge: '',
        propertyType: '',
        benefits: [],
        epcRating: '',
        termsAccepted: false
      };
    }

    return {
      nameOnBill: localStorage.getItem('whd_nameOnBill') || '',
      floorArea: localStorage.getItem('whd_floorArea') || '',
      pensionCredit: localStorage.getItem('whd_pensionCredit') || '',
      propertyAge: localStorage.getItem('whd_propertyAge') || '',
      propertyType: localStorage.getItem('whd_propertyType') || '',
      benefits: JSON.parse(localStorage.getItem('whd_benefits') || '[]'),
      epcRating: localStorage.getItem('whd_epcRating') || '',
      termsAccepted: JSON.parse(localStorage.getItem('whd_termsAccepted') || 'false')
    };
  };

  const getInitialFieldValidity = (formData) => {
    return {
      nameOnBill: formData.nameOnBill === 'Yes',
      floorArea: Number(formData.floorArea) > 0,
      propertyAge: !!formData.propertyAge,
      propertyType: !!formData.propertyType,
      pensionCredit: formData.pensionCredit === 'Yes',
      benefits: formData.benefits.length > 0,
      epcRating: !!formData.epcRating
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [fieldValidity, setFieldValidity] = useState(() => getInitialFieldValidity(getInitialFormData()));

  const [validationErrors, setValidationErrors] = useState({
    nameOnBill: '',
    floorArea: '',
    propertyAge: '',
    propertyType: '',
    pensionCredit: '',
    benefits: '',
    epcRating: ''
  });

  const validateField = (name, value) => {
    let error = '';
    let isValid = true;

    switch (name) {
      case 'pensionCredit':
        if (!value) error = 'Please select an option for Pension Credit';
        isValid = !error;
        break;
      case 'benefits':
        if (value.length === 0) error = 'Please select at least one benefit if applicable';
        isValid = !error;
        break;
      case 'epcRating':
        if (!value) error = 'Please select your EPC rating';
        isValid = !error;
        break;
      case 'nameOnBill':
        if (!value) error = 'Please select an option';
        isValid = !error;
        break;
      case 'propertyType':
        if (!value) error = 'Please select property type';
        isValid = !error;
        break;
      case 'propertyAge':
        if (!value) error = 'Please select property age';
        isValid = !error;
        break;
      case 'floorArea':
        if (!value) {
          error = 'Please enter floor area';
          isValid = false;
        } else if (isNaN(value) || Number(value) <= 0) {
          error = 'Please enter a valid floor area';
          isValid = false;
        } else {
          isValid = true;
        }
        break;
      default:
        break;
    }

    return { error, isValid };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let newValue;
    if (type === 'checkbox') {
      if (name === 'benefits') {
        const currentBenefits = [...formData.benefits];
        if (checked) {
          newValue = [...currentBenefits, value];
        } else {
          newValue = currentBenefits.filter(benefit => benefit !== value);
        }
      } else {
        newValue = checked;
      }
    } else {
      newValue = value;
    }

    setFormData(prev => {
      const updatedData = { ...prev, [name]: newValue };
      
      // Save to localStorage with proper prefix
      if (name === 'benefits' || name === 'termsAccepted') {
        localStorage.setItem(`whd_${name}`, JSON.stringify(newValue));
      } else {
        localStorage.setItem(`whd_${name}`, newValue);
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
      nameOnBill: validateField('nameOnBill', formData.nameOnBill).error,
      floorArea: validateField('floorArea', formData.floorArea).error,
      propertyAge: validateField('propertyAge', formData.propertyAge).error,
      propertyType: validateField('propertyType', formData.propertyType).error,
      pensionCredit: validateField('pensionCredit', formData.pensionCredit).error,
      benefits: validateField('benefits', formData.benefits).error,
      epcRating: validateField('epcRating', formData.epcRating).error
    };

    setValidationErrors(errors);

    const isValid = Object.values(errors).every(error => error === '');
    
    if (isValid && formData.termsAccepted) {
      console.log('Warm Home Discount Form Data:', formData);
      
      // Save all form data to local storage with proper prefix
      localStorage.setItem('whd_pensionCredit', formData.pensionCredit);
      localStorage.setItem('whd_nameOnBill', formData.nameOnBill);
      localStorage.setItem('whd_floorArea', formData.floorArea);
      localStorage.setItem('whd_propertyType', formData.propertyType);
      localStorage.setItem('whd_propertyAge', formData.propertyAge);
      localStorage.setItem('whd_benefits', JSON.stringify(formData.benefits));
      localStorage.setItem('whd_epcRating', formData.epcRating);
      localStorage.setItem('whd_termsAccepted', JSON.stringify(formData.termsAccepted));
      
      window.location.replace('#/eligibility_results/ppa-result');

    } else {
      console.log('Form has validation errors');
    }
  };

  const isFormValid = () => {
    return Object.values(fieldValidity).every(Boolean) && formData.termsAccepted;
  };

  const epcRatings = [
    { value: 'A', label: 'A (Most Efficient)', color: 'text-green-600' },
    { value: 'B', label: 'B', color: 'text-lime-600' },
    { value: 'C', label: 'C', color: 'text-yellow-600' },
    { value: 'D', label: 'D', color: 'text-amber-600' },
    { value: 'E', label: 'E', color: 'text-orange-600' },
    { value: 'F', label: 'F', color: 'text-red-500' },
    { value: 'G', label: 'G (Least Efficient)', color: 'text-red-700' },
    { value: 'unknown', label: "I don't know", color: 'text-gray-500' }
  ];

  const propertyTypes = [
    { value: 'detached', label: 'Detached House' },
    { value: 'semi-detached', label: 'Semi-Detached House' },
    { value: 'terraced', label: 'Terraced House' },
    { value: 'flat', label: 'Flat/Apartment' },
    { value: 'bungalow', label: 'Bungalow' },
    { value: 'other', label: 'Other' }
  ];

  const propertyAges = [
    { label: "Pre-1900", value: "pre-1900" },
    { label: "1900-1929", value: "1900-1929" },
    { label: "1930-1949", value: "1930-1949" },
    { label: "1950-1966", value: "1950-1966" },
    { label: "1967-1975", value: "1967-1975" },
    { label: "1976-1982", value: "1976-1982" },
    { label: "1983-1990", value: "1983-1990" },
    { label: "1991-1995", value: "1991-1995" },
    { label: "1996-2002", value: "1996-2002" },
    { label: "2003-2006", value: "2003-2006" },
    { label: "2007-2011", value: "2007-2011" },
    { label: "2012-Present", value: "2012-present" },
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
                    <h3 className="font-bold text-green-900 text-lg mb-2">Warm Home Discount Scheme</h3>
                    <p className="text-green-700 mb-3">
                      Apply for the £150 discount on your electricity bill for winter 2024-2025. 
                      This scheme helps low-income households with their energy costs.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Eligibility Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaCertificate className="w-6 h-6 mr-3 text-green-600" />
                    Eligibility Criteria
                  </h2>

                  <div className="space-y-6">
                    {/* Pension Credit Guarantee */}
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Are you in receipt of Pension Credit Guarantee?
                      </h3>
                      <div className="flex space-x-6">
                        {['Yes', 'No'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="pensionCredit"
                              value={option}
                              checked={formData.pensionCredit === option}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
                              required
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.pensionCredit && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.pensionCredit}
                        </p>
                      )}
                    </div>

                    {/* Means-tested Benefits */}
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Are you in receipt of any of the following means-tested benefits?
                      </h3>
                      <div className="space-y-3">
                        {[
                          'Universal Credit',
                          'Housing Benefit',
                          'Income-based Jobseeker\'s Allowance',
                          'Employment & Support Allowance',
                          'None of the above'
                        ].map((benefit) => (
                          <label key={benefit} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="benefits"
                              value={benefit}
                              checked={formData.benefits.includes(benefit)}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-700">{benefit}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.benefits && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.benefits}
                        </p>
                      )}
                    </div>

                    {/* Property Type */}
                    <div>
                      <label
                        htmlFor="propertyType"
                        className="block text-lg font-semibold text-gray-700 mb-3"
                      >
                        What is your property type?
                      </label>

                      <div className="relative">
                        <select
                          id="propertyType"
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg appearance-none ${
                            fieldValidity.propertyType ? "border-gray-300" : "border-red-500"
                          }`}
                          required
                        >
                          <option value="">Select property type</option>
                          {propertyTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.propertyType && formData.propertyType ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.propertyType && formData.propertyType ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaHome className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {validationErrors.propertyType && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.propertyType}
                        </p>
                      )}
                    </div>

                    {/* Property Age */}
                    <div>
                      <label
                        htmlFor="propertyAge"
                        className="block text-lg font-semibold text-gray-700 mb-3"
                      >
                        Property Age
                      </label>

                      <div className="relative">
                        <select
                          id="propertyAge"
                          name="propertyAge"
                          value={formData.propertyAge}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg appearance-none ${
                            fieldValidity.propertyAge ? "border-gray-300" : "border-red-500"
                          }`}
                          required
                        >
                          <option value="">Select property age</option>
                          {propertyAges.map((age) => (
                            <option key={age.value} value={age.value}>
                              {age.label}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.propertyAge && formData.propertyAge ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.propertyAge && formData.propertyAge ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaClock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {validationErrors.propertyAge && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.propertyAge}
                        </p>
                      )}
                    </div>

                    {/* Floor Area */}
                    <div>
                      <label
                        htmlFor="floorArea"
                        className="block text-lg font-semibold text-gray-700 mb-3"
                      >
                        Approximate Floor Area (m²)
                      </label>

                      <div className="relative">
                        <input
                          type="number"
                          id="floorArea"
                          name="floorArea"
                          value={formData.floorArea}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-lg ${
                            fieldValidity.floorArea ? "border-gray-300" : "border-red-500"
                          }`}
                          required
                          min="1"
                        />

                        <div className="absolute right-4 top-4 flex items-center">
                          {fieldValidity.floorArea && formData.floorArea ? (
                            <FaCheck className="w-5 h-5 text-green-500" />
                          ) : !fieldValidity.floorArea && formData.floorArea ? (
                            <FaTimes className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaRulerCombined className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm mt-2">
                        This helps calculate your property's energy cost score
                      </p>

                      {validationErrors.floorArea && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.floorArea}
                        </p>
                      )}
                    </div>

                    {/* Name on Bill */}
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Is your name (or your partner's) on the electricity bill?
                      </h3>
                      <div className="flex space-x-6">
                        {['Yes', 'No'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="nameOnBill"
                              value={option}
                              checked={formData.nameOnBill === option}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
                              required
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.nameOnBill && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.nameOnBill}
                        </p>
                      )}
                    </div>

                    {/* EPC Rating */}
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        What is your property's current EPC rating?
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {epcRatings.map((rating) => (
                          <label key={rating.value} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="epcRating"
                              value={rating.value}
                              checked={formData.epcRating === rating.value}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
                              required
                            />
                            <span className={`font-medium ${rating.color}`}>{rating.label}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.epcRating && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <FaTimes className="w-3 h-3 mr-1" />
                          {validationErrors.epcRating}
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
                    We process your information to assess your eligibility for the Warm Home Discount Scheme. 
                    Your data is protected under GDPR and will only be used for this application.
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
                    onClick={() => window.location.href = '#/mandatory_form/ppa-form'}
                    className="px-8 py-4 border border-gray-300 rounded-lg text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center"
                  >
                    <FaArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-indigo-700 rounded-lg text-base font-semibold text-white hover:from-green-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Check Eligibility
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
                  Scheme Benefits
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaPiggyBank className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">£150 Discount</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Receive a one-off £150 discount on your electricity bill for winter 2024-2025
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaHome className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">Warmer Home</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Help with energy costs to keep your home warm during colder months
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaThermometerHalf className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">Energy Support</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Additional support for vulnerable households and those on low income
                      </p>
                    </div>
                  </div>
                </div>

                {/* Eligibility Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-green-50 to-indigo-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center">
                      <FaInfoCircle className="w-5 h-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-900 text-sm">Eligibility Criteria</h4>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      You may qualify if you receive Pension Credit or certain means-tested benefits and have a low EPC rating
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