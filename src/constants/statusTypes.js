// Status Types and Labels for Cira Platform
// Centralized status definitions for consistent UI across all components

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed'
};

// Payout Status
export const PAYOUT_STATUS = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed'
};

// Report Status
export const REPORT_STATUS = {
  DRAFT: 'draft',
  FINALIZED: 'finalized',
  SHARED: 'shared'
};

// Referral Status
export const REFERRAL_STATUS = {
  TRACKED: 'tracked',
  CONVERTED: 'converted',
  COMMISSION_DUE: 'commission-due',
  SETTLED: 'settled'
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  USER: 'user',
  COMPANY: 'company'
};

// Consultation Types
export const CONSULTATION_TYPES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid'
};

// Payment Types
export const PAYMENT_TYPES = {
  APPOINTMENT: 'appointment',
  SUBSCRIPTION: 'subscription',
  REFERRAL: 'referral'
};

// Compliance Status
export const COMPLIANCE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  PASSED: 'passed',
  FAILED: 'failed',
  REQUIRES_ACTION: 'requires-action'
};

// Status Labels
export const STATUS_LABELS = {
  // Verification
  [VERIFICATION_STATUS.PENDING]: 'Pending',
  [VERIFICATION_STATUS.VERIFIED]: 'Verified',
  [VERIFICATION_STATUS.REJECTED]: 'Rejected',
  [VERIFICATION_STATUS.SUSPENDED]: 'Suspended',
  
  // Appointment
  [APPOINTMENT_STATUS.REQUESTED]: 'Requested',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmed',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelled',
  [APPOINTMENT_STATUS.NO_SHOW]: 'No Show',
  
  // Payment
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  
  // Payout
  [PAYOUT_STATUS.QUEUED]: 'Queued',
  [PAYOUT_STATUS.PROCESSING]: 'Processing',
  [PAYOUT_STATUS.PAID]: 'Paid',
  [PAYOUT_STATUS.FAILED]: 'Failed',
  
  // Report
  [REPORT_STATUS.DRAFT]: 'Draft',
  [REPORT_STATUS.FINALIZED]: 'Finalized',
  [REPORT_STATUS.SHARED]: 'Shared',
  
  // Referral
  [REFERRAL_STATUS.TRACKED]: 'Tracked',
  [REFERRAL_STATUS.CONVERTED]: 'Converted',
  [REFERRAL_STATUS.COMMISSION_DUE]: 'Commission Due',
  [REFERRAL_STATUS.SETTLED]: 'Settled',
  
  // User
  [USER_STATUS.ACTIVE]: 'Active',
  [USER_STATUS.INACTIVE]: 'Inactive',
  [USER_STATUS.SUSPENDED]: 'Suspended',
  [USER_STATUS.PENDING]: 'Pending',
  
  // Compliance
  [COMPLIANCE_STATUS.PENDING]: 'Pending',
  [COMPLIANCE_STATUS.IN_PROGRESS]: 'In Progress',
  [COMPLIANCE_STATUS.PASSED]: 'Passed',
  [COMPLIANCE_STATUS.FAILED]: 'Failed',
  [COMPLIANCE_STATUS.REQUIRES_ACTION]: 'Requires Action'
};

// Status Colors
export const STATUS_COLORS = {
  // Verification
  [VERIFICATION_STATUS.PENDING]: 'yellow',
  [VERIFICATION_STATUS.VERIFIED]: 'green',
  [VERIFICATION_STATUS.REJECTED]: 'red',
  [VERIFICATION_STATUS.SUSPENDED]: 'gray',
  
  // Appointment
  [APPOINTMENT_STATUS.REQUESTED]: 'blue',
  [APPOINTMENT_STATUS.CONFIRMED]: 'green',
  [APPOINTMENT_STATUS.COMPLETED]: 'green',
  [APPOINTMENT_STATUS.CANCELLED]: 'red',
  [APPOINTMENT_STATUS.NO_SHOW]: 'red',
  
  // Payment
  [PAYMENT_STATUS.PENDING]: 'yellow',
  [PAYMENT_STATUS.PAID]: 'green',
  [PAYMENT_STATUS.REFUNDED]: 'blue',
  [PAYMENT_STATUS.FAILED]: 'red',
  
  // Payout
  [PAYOUT_STATUS.QUEUED]: 'yellow',
  [PAYOUT_STATUS.PROCESSING]: 'blue',
  [PAYOUT_STATUS.PAID]: 'green',
  [PAYOUT_STATUS.FAILED]: 'red',
  
  // Report
  [REPORT_STATUS.DRAFT]: 'yellow',
  [REPORT_STATUS.FINALIZED]: 'green',
  [REPORT_STATUS.SHARED]: 'blue',
  
  // Referral
  [REFERRAL_STATUS.TRACKED]: 'blue',
  [REFERRAL_STATUS.CONVERTED]: 'green',
  [REFERRAL_STATUS.COMMISSION_DUE]: 'yellow',
  [REFERRAL_STATUS.SETTLED]: 'green',
  
  // User
  [USER_STATUS.ACTIVE]: 'green',
  [USER_STATUS.INACTIVE]: 'gray',
  [USER_STATUS.SUSPENDED]: 'red',
  [USER_STATUS.PENDING]: 'yellow',
  
  // Compliance
  [COMPLIANCE_STATUS.PENDING]: 'yellow',
  [COMPLIANCE_STATUS.IN_PROGRESS]: 'blue',
  [COMPLIANCE_STATUS.PASSED]: 'green',
  [COMPLIANCE_STATUS.FAILED]: 'red',
  [COMPLIANCE_STATUS.REQUIRES_ACTION]: 'orange'
};

// Helper function to get status label
export const getStatusLabel = (status, type = 'verification') => {
  return STATUS_LABELS[status] || status;
};

// Helper function to get status color
export const getStatusColor = (status, type = 'verification') => {
  return STATUS_COLORS[status] || 'gray';
};