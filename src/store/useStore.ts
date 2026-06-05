import { create } from 'zustand';
import type {
  Elderly,
  ServicePackage,
  Appointment,
  CareWorker,
  Task,
  HealthRecord,
  Medication,
  Bill,
  Message,
  DashboardStats,
  EmergencyContact
} from '@/types';
import {
  mockElderly,
  mockServicePackages,
  mockAppointments,
  mockCareWorkers,
  mockTasks,
  mockHealthRecords,
  mockMedications,
  mockBills,
  mockMessages,
  mockDashboardStats
} from '@/data/mockData';

interface StoreState {
  elderly: Elderly[];
  servicePackages: ServicePackage[];
  appointments: Appointment[];
  careWorkers: CareWorker[];
  tasks: Task[];
  healthRecords: HealthRecord[];
  medications: Medication[];
  bills: Bill[];
  messages: Message[];
  dashboardStats: DashboardStats;
  currentRole: 'admin' | 'worker' | 'family';
  currentUserId: string;
  currentWorker: CareWorker | null;
  currentFamily: { id: string; name: string; phone: string; authorizedElderlyIds: string[] } | null;
  selectedElderly: Elderly | null;
  setCurrentRole: (role: 'admin' | 'worker' | 'family') => void;
  setCurrentUserId: (id: string) => void;
  setSelectedElderly: (elderly: Elderly | null) => void;
  addElderly: (elderly: Elderly) => void;
  updateElderly: (id: string, data: Partial<Elderly>) => void;
  deleteElderly: (id: string) => void;
  addEmergencyContact: (elderlyId: string, contact: EmergencyContact) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  confirmAppointment: (id: string, careWorkerId: string, careWorkerName: string) => void;
  createTaskFromAppointment: (appointmentId: string) => void;
  updateTaskStatus: (id: string, status: Task['status'], checkInTime?: string, checkOutTime?: string) => void;
  addHealthRecord: (record: HealthRecord) => void;
  markMessageRead: (id: string) => void;
  addMessage: (message: Message) => void;
  addBill: (bill: Bill) => void;
  updateBillStatus: (id: string, status: Bill['status']) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  elderly: mockElderly,
  servicePackages: mockServicePackages,
  appointments: mockAppointments,
  careWorkers: mockCareWorkers,
  tasks: mockTasks,
  healthRecords: mockHealthRecords,
  medications: mockMedications,
  bills: mockBills,
  messages: mockMessages,
  dashboardStats: mockDashboardStats,
  currentRole: 'admin',
  currentUserId: 'admin001',
  currentWorker: null,
  currentFamily: null,
  selectedElderly: null,
  
  setCurrentRole: (role) => {
    if (role === 'worker') {
      const worker = mockCareWorkers[0];
      set({ currentRole: role, currentWorker: worker, currentFamily: null, currentUserId: worker.id });
    } else if (role === 'family') {
      const family = {
        id: 'fm001',
        name: '李明',
        phone: '13987654321',
        authorizedElderlyIds: ['e001']
      };
      set({ currentRole: role, currentFamily: family, currentWorker: null, currentUserId: family.id });
    } else {
      set({ currentRole: role, currentWorker: null, currentFamily: null, currentUserId: 'admin001' });
    }
  },
  setCurrentUserId: (id) => set({ currentUserId: id }),
  setSelectedElderly: (elderly) => set({ selectedElderly: elderly }),
  
  addElderly: (elderly) =>
    set((state) => ({
      elderly: [...state.elderly, elderly]
    })),
  
  updateElderly: (id, data) =>
    set((state) => ({
      elderly: state.elderly.map((e) =>
        e.id === id ? { ...e, ...data } : e
      ),
      selectedElderly: state.selectedElderly?.id === id 
        ? { ...state.selectedElderly, ...data } 
        : state.selectedElderly
    })),
  
  deleteElderly: (id) =>
    set((state) => ({
      elderly: state.elderly.filter((e) => e.id !== id),
      selectedElderly: state.selectedElderly?.id === id ? null : state.selectedElderly
    })),
  
  addEmergencyContact: (elderlyId, contact) =>
    set((state) => ({
      elderly: state.elderly.map((e) =>
        e.id === elderlyId
          ? { ...e, emergencyContacts: [...e.emergencyContacts, contact] }
          : e
      ),
      selectedElderly: state.selectedElderly?.id === elderlyId
        ? {
            ...state.selectedElderly,
            emergencyContacts: [...state.selectedElderly.emergencyContacts, contact]
          }
        : state.selectedElderly
    })),
  
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment]
    })),
  
  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status } : a
      )
    })),
  
  confirmAppointment: (id, careWorkerId, careWorkerName) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'confirmed', careWorkerId, careWorkerName } : a
      )
    })),
  
  createTaskFromAppointment: (appointmentId) => {
    const state = get();
    const appointment = state.appointments.find((a) => a.id === appointmentId);
    if (!appointment) return;
    
    const elder = state.elderly.find((e) => e.id === appointment.elderlyId);
    const pkg = state.servicePackages.find((p) => p.id === appointment.servicePackageId);
    
    const newTask: Task = {
      id: `t${Date.now()}`,
      appointmentId: appointment.id,
      elderlyId: appointment.elderlyId,
      elderlyName: appointment.elderlyName,
      elderlyAddress: elder?.address || '',
      elderlyAvatar: elder?.avatar || '',
      careWorkerId: appointment.careWorkerId || '',
      careWorkerName: appointment.careWorkerName || '',
      serviceItems: pkg?.services || [],
      scheduledTime: appointment.scheduledTime,
      status: 'pending',
      photos: [],
      location: elder ? { lat: 31.2304, lng: 121.4737 } : undefined
    };
    
    set((state) => ({
      tasks: [...state.tasks, newTask],
      appointments: state.appointments.map((a) =>
        a.id === appointmentId ? { ...a, status: 'confirmed' } : a
      )
    }));
  },
  
  updateTaskStatus: (id, status, checkInTime, checkOutTime) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, status, ...(checkInTime && { checkInTime }), ...(checkOutTime && { checkOutTime }) }
          : t
      )
    })),
  
  addHealthRecord: (record) =>
    set((state) => ({
      healthRecords: [...state.healthRecords, record]
    })),
  
  markMessageRead: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, isRead: true } : m
      )
    })),
  
  addMessage: (message) =>
    set((state) => ({
      messages: [message, ...state.messages]
    })),
  
  addBill: (bill) =>
    set((state) => ({
      bills: [...state.bills, bill]
    })),
  
  updateBillStatus: (id, status) =>
    set((state) => ({
      bills: state.bills.map((b) =>
        b.id === id ? { ...b, status, paidTime: status === 'paid' ? new Date().toISOString() : undefined } : b
      )
    }))
}));
