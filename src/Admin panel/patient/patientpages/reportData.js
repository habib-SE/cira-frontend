// Sample data for all reports
const allReportsData = {
  1: {
    id: 1,
    date: 'Sept 30, 2025',
    time: '10:30 AM',
    duration: '15 minutes',
    type: 'Daily Checkup',
    status: 'Completed',
    aiScore: 95,
    symptoms: [
      'Mild headache for 2 days',
      'Occasional dizziness when standing',
      'Slight fatigue in the evening',
      'Dry mouth sensation',
      'Difficulty concentrating'
    ],
    vitals: {
      heartRate: { value: 78, unit: 'bpm', status: 'normal' },
      temperature: { value: 98.6, unit: '°F', status: 'normal' },
      bloodPressure: { value: '120/80', unit: 'mmHg', status: 'normal' },
      oxygenSaturation: { value: 98, unit: '%', status: 'normal' },
      respiratoryRate: { value: 16, unit: 'breaths/min', status: 'normal' },
      weight: { value: 165, unit: 'lbs', status: 'normal' }
    },
    conditions: [
      {
        rank: 1,
        name: 'Dehydration',
        confidence: 85,
        description: 'Mild dehydration based on symptoms and recent activity patterns',
        severity: 'low'
      },
      {
        rank: 2,
        name: 'Stress-related tension headache',
        confidence: 72,
        description: 'Tension headache likely caused by stress or poor sleep',
        severity: 'low'
      }
    ],
    recommendations: [
      'Increase daily water intake to 8-10 glasses',
      'Maintain regular sleep schedule (7-8 hours)',
      'Practice stress management techniques'
    ],
    nextSteps: [
      'Follow up in 3 days if symptoms persist',
      'Schedule appointment if new symptoms appear'
    ]
  },
  2: {
    id: 2,
    date: 'Sept 29, 2025',
    time: '2:15 PM',
    duration: '8 minutes',
    type: 'Medication Review',
    status: 'Completed',
    aiScore: 88,
    symptoms: [
      'Mild nausea after medication',
      'Improved sleep quality',
      'Reduced anxiety levels'
    ],
    vitals: {
      heartRate: { value: 72, unit: 'bpm', status: 'normal' },
      temperature: { value: 98.4, unit: '°F', status: 'normal' },
      bloodPressure: { value: '118/76', unit: 'mmHg', status: 'normal' },
      oxygenSaturation: { value: 99, unit: '%', status: 'normal' },
      respiratoryRate: { value: 14, unit: 'breaths/min', status: 'normal' },
      weight: { value: 164, unit: 'lbs', status: 'normal' }
    },
    conditions: [
      {
        rank: 1,
        name: 'Medication side effects',
        confidence: 78,
        description: 'Mild nausea as potential side effect of current medication',
        severity: 'low'
      }
    ],
    recommendations: [
      'Take medication with food',
      'Monitor side effects for next 3 days',
      'Stay hydrated throughout the day'
    ],
    nextSteps: [
      'Continue medication as prescribed',
      'Report any worsening symptoms immediately'
    ]
  },
  3: {
    id: 3,
    date: 'Sept 28, 2025',
    time: '9:45 AM',
    duration: '12 minutes',
    type: 'Symptom Analysis',
    status: 'In Progress',
    aiScore: 76,
    symptoms: [
      'Persistent headache',
      'Blurred vision occasionally',
      'Neck stiffness'
    ],
    vitals: {
      heartRate: { value: 82, unit: 'bpm', status: 'normal' },
      temperature: { value: 99.1, unit: '°F', status: 'warning' },
      bloodPressure: { value: '125/85', unit: 'mmHg', status: 'warning' },
      oxygenSaturation: { value: 97, unit: '%', status: 'normal' },
      respiratoryRate: { value: 18, unit: 'breaths/min', status: 'normal' },
      weight: { value: 166, unit: 'lbs', status: 'normal' }
    },
    conditions: [
      {
        rank: 1,
        name: 'Tension headache',
        confidence: 82,
        description: 'Muscle tension in neck and shoulders contributing to headache',
        severity: 'medium'
      },
      {
        rank: 2,
        name: 'Visual strain',
        confidence: 65,
        description: 'Possible eye strain from prolonged screen time',
        severity: 'low'
      }
    ],
    recommendations: [
      'Apply warm compress to neck',
      'Take regular breaks from screens',
      'Practice neck stretching exercises'
    ],
    nextSteps: [
      'Complete the symptom analysis',
      'Consult with healthcare provider if symptoms worsen'
    ]
  }
  // Add more reports for IDs 4, 5, 6...
};