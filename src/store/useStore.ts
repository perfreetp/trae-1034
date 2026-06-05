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
  DashboardStats
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
  selectedElderly: Elderly | null;
  setCurrentRole: (role: 'admin' | 'worker' | 'family') => void;
  setSelectedElderly: (elderly: Elderly | null) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateTaskStatus: (id: string, status: Task['status'], checkInTime?: string, checkOutTime?: string) => void;
  addHealthRecord: (record: HealthRecord) => void;
  markMessageRead: (id: string) => void;
  addMessage: (message: Message) => void;
  updateBillStatus: (id: string, status: Bill['status']) => void;
}

export const useStore = create<StoreState>((set) => ({
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
  selectedElderly: null,
  
  setCurrentRole: (role) => set({ currentRole: role }),
  setSelectedElderly: (elderly) => set({ selectedElderly: elderly }),
  
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
  
  updateBillStatus: (id, status) =>
    set((state) => ({
      bills: state.bills.map((b) =>
        b.id === id ? { ...b, status, paidTime: status === 'paid' ? new Date().toISOString() : undefined } : b
      )
    }))
}));
