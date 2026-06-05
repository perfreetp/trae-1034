export interface Elderly {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  birthDate: string;
  idCard: string;
  phone: string;
  address: string;
  avatar: string;
  abilityLevel: 'independent' | 'semi-dependent' | 'dependent';
  chronicDiseases: string[];
  emergencyContacts: EmergencyContact[];
  familyMembers: FamilyMember[];
  riskTags: string[];
  admissionDate: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isAuthorized: boolean;
}

export interface EmergencyContact {
  id: string;
  elderlyId: string;
  name: string;
  relationship: string;
  phone: string;
  priority: number;
  isPrimary: boolean;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  subsidyPrice: number;
  services: string[];
  duration: string;
  icon: string;
}

export interface Appointment {
  id: string;
  elderlyId: string;
  elderlyName: string;
  servicePackageId: string;
  servicePackageName: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  careWorkerId?: string;
  careWorkerName?: string;
  createTime: string;
  notes?: string;
}

export interface CareWorker {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  gender: 'male' | 'female';
  age: number;
  skills: string[];
  rating: number;
  completedTasks: number;
  status: 'on-duty' | 'off-duty' | 'busy';
}

export interface Task {
  id: string;
  appointmentId: string;
  elderlyId: string;
  elderlyName: string;
  elderlyAddress: string;
  elderlyAvatar: string;
  careWorkerId: string;
  careWorkerName: string;
  serviceItems: string[];
  scheduledTime: string;
  checkInTime?: string;
  checkOutTime?: string;
  photos: string[];
  status: 'pending' | 'in_progress' | 'completed';
  location?: { lat: number; lng: number };
}

export interface HealthRecord {
  id: string;
  elderlyId: string;
  recordTime: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugar?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  notes?: string;
  recordedBy: string;
  isAbnormal: boolean;
}

export interface Medication {
  id: string;
  elderlyId: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  subsidyAmount: number;
}

export interface Bill {
  id: string;
  elderlyId: string;
  elderlyName: string;
  month: string;
  totalAmount: number;
  subsidyAmount: number;
  actualAmount: number;
  status: 'unpaid' | 'paid' | 'subsidized';
  items: BillItem[];
  createTime: string;
  paidTime?: string;
}

export interface Message {
  id: string;
  recipientId: string;
  recipientType: 'family' | 'worker' | 'admin';
  title: string;
  content: string;
  type: 'system' | 'service' | 'emergency' | 'survey';
  isRead: boolean;
  createTime: string;
  relatedId?: string;
  hasReadReceipt?: boolean;
}

export interface Survey {
  id: string;
  messageId: string;
  taskId: string;
  elderlyId: string;
  rating: number;
  comment?: string;
  createTime: string;
}

export interface AbilityAssessment {
  id: string;
  elderlyId: string;
  assessDate: string;
  assessor: string;
  eating: number;
  bathing: number;
  dressing: number;
  toileting: number;
  mobility: number;
  communication: number;
  totalScore: number;
  level: 'independent' | 'semi-dependent' | 'dependent';
  notes?: string;
}

export interface DashboardStats {
  totalElderly: number;
  activeCareWorkers: number;
  todayTasks: number;
  completedTasks: number;
  pendingAppointments: number;
  highRiskElderly: number;
  monthlyRevenue: number;
  satisfactionRate: number;
}
