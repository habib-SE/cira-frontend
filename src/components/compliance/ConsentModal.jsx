import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Clock,
  X
} from 'lucide-react';
import Button from '../shared/Button';
import Card from '../../Admin panel/admin/admincomponents/Card';

const ConsentModal = ({
  isOpen,
  onAccept,
  onDecline,
  consentData = {},
  className = ''
}) => {
  const [acceptedSections, setAcceptedSections] = useState({});
  const [allAccepted, setAllAccepted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const consentSections = [
    {
      id: 'data_collection',
      title: 'Data Collection',
      description: 'We collect your health information, vital signs, and medical history to provide AI-powered health assessments.',
      required: true,
      details: [
        'Personal information (name, email, phone)',
        'Health data (symptoms, vitals, medical history)',
        'Usage data (app interactions, session logs)',
        'Device information (camera, microphone for vitals)'
      ]
    },
    {
      id: 'ai_processing',
      title: 'AI Processing',
      description: 'Your health data is processed by our AI system to generate health reports and recommendations.',
      required: true,
      details: [
        'AI analysis of symptoms and vitals',
        'Health risk assessment',
        'Treatment recommendations',
        'Report generation and storage'
      ]
    },
    {
      id: 'data_sharing',
      title: 'Data Sharing',
      description: 'Your data may be shared with healthcare providers and third-party services for treatment purposes.',
      required: true,
      details: [
        'Sharing with authorized healthcare providers',
        'Integration with medical records systems',
        'Third-party health service providers',
        'Anonymized data for research (with consent)'
      ]
    },
    {
      id: 'data_retention',
      title: 'Data Retention',
      description: 'Your health data will be retained for the duration specified in our privacy policy.',
      required: true,
      details: [
        'Health records: 7 years (as required by law)',
        'AI reports: 5 years',
        'Usage data: 2 years',
        'Right to request deletion at any time'
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      description: 'Receive updates about new features, health tips, and promotional offers.',
      required: false,
      details: [
        'Email newsletters',
        'Push notifications',
        'SMS updates',
        'In-app promotions'
      ]
    }
  ];

  useEffect(() => {
    // Check if all required sections are accepted
    const requiredSections = consentSections.filter(section => section.required);
    const allRequiredAccepted = requiredSections.every(section => 
      acceptedSections[section.id] === true
    );
    setAllAccepted(allRequiredAccepted);
  }, [acceptedSections]);

  const handleSectionToggle = (sectionId, accepted) => {
    setAcceptedSections(prev => ({
      ...prev,
      [sectionId]: accepted
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted = {};
    consentSections.forEach(section => {
      allAccepted[section.id] = true;
    });
    setAcceptedSections(allAccepted);
  };

  const handleAcceptRequired = () => {
    const requiredAccepted = {};
    consentSections.forEach(section => {
      if (section.required) {
        requiredAccepted[section.id] = true;
      }
    });
    setAcceptedSections(requiredAccepted);
  };

  const handleSubmit = () => {
    if (allAccepted) {
      onAccept(acceptedSections);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

        {/* Modal panel */}
        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-sm sm:max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden mx-2 sm:mx-4">
          {/* Header */}
          <div className="bg-pink-50 px-6 py-4 border-b border-pink-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Privacy & Consent</h3>
                  <p className="text-sm text-gray-600">Please review and accept our data processing terms</p>
                </div>
              </div>
              <button
                onClick={onDecline}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {consentSections.map((section) => (
                <Card key={section.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={acceptedSections[section.id] || false}
                        onChange={(e) => handleSectionToggle(section.id, e.target.checked)}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {section.title}
                          {section.required && <span className="text-red-500 ml-1">*</span>}
                        </h4>
                        {section.required && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                      
                      {showDetails && section.details && (
                        <div className="mt-3">
                          <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-sm text-pink-600 hover:text-pink-800"
                          >
                            {showDetails ? 'Hide details' : 'Show details'}
                          </button>
                          {showDetails && (
                            <ul className="mt-2 space-y-1">
                              {section.details.map((detail, index) => (
                                <li key={index} className="text-sm text-gray-500 flex items-start space-x-2">
                                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAcceptRequired}
              >
                Accept Required Only
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAcceptAll}
              >
                Accept All
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last updated: {consentData.lastUpdated || 'January 15, 2024'}</span>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onDecline}
              >
                Decline
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!allAccepted}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept & Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
