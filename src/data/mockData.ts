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
  EmergencyContact,
  AbilityAssessment,
  DashboardStats
} from '@/types';

export const mockElderly: Elderly[] = [
  {
    id: 'e001',
    name: '张桂芳',
    gender: 'female',
    age: 78,
    birthDate: '1946-03-15',
    idCard: '310101194603151234',
    phone: '13812345678',
    address: '上海市静安区南京西路1234弄56号701室',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20woman%20portrait%20warm%20smile%20grandmother&image_size=square',
    abilityLevel: 'semi-dependent',
    chronicDiseases: ['高血压', '糖尿病'],
    riskTags: ['独居', '跌倒风险'],
    admissionDate: '2023-06-15',
    emergencyContacts: [
      { id: 'ec001', elderlyId: 'e001', name: '李明', relationship: '儿子', phone: '13987654321', priority: 1, isPrimary: true },
      { id: 'ec002', elderlyId: 'e001', name: '李华', relationship: '女儿', phone: '13678901234', priority: 2, isPrimary: false }
    ],
    familyMembers: [
      { id: 'fm001', name: '李明', relationship: '儿子', phone: '13987654321', isAuthorized: true }
    ]
  },
  {
    id: 'e002',
    name: '王建国',
    gender: 'male',
    age: 82,
    birthDate: '1942-08-20',
    idCard: '310101194208205678',
    phone: '13923456789',
    address: '上海市静安区延安中路987弄32号201室',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20man%20portrait%20kind%20grandfather%20glasses&image_size=square',
    abilityLevel: 'dependent',
    chronicDiseases: ['高血压', '冠心病', '关节炎'],
    riskTags: ['失能', '需要24小时护理'],
    admissionDate: '2023-01-10',
    emergencyContacts: [
      { id: 'ec003', elderlyId: 'e002', name: '王芳', relationship: '女儿', phone: '13876543210', priority: 1, isPrimary: true }
    ],
    familyMembers: [
      { id: 'fm002', name: '王芳', relationship: '女儿', phone: '13876543210', isAuthorized: true },
      { id: 'fm003', name: '王伟', relationship: '儿子', phone: '13567890123', isAuthorized: false }
    ]
  },
  {
    id: 'e003',
    name: '陈秀英',
    gender: 'female',
    age: 72,
    birthDate: '1952-11-05',
    idCard: '310101195211059012',
    phone: '13634567890',
    address: '上海市静安区常德路567弄12号302室',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20elderly%20woman%20portrait%20asian&image_size=square',
    abilityLevel: 'independent',
    chronicDiseases: ['高血脂'],
    riskTags: [],
    admissionDate: '2023-09-01',
    emergencyContacts: [
      { id: 'ec004', elderlyId: 'e003', name: '陈强', relationship: '儿子', phone: '13765432109', priority: 1, isPrimary: true }
    ],
    familyMembers: [
      { id: 'fm004', name: '陈强', relationship: '儿子', phone: '13765432109', isAuthorized: true }
    ]
  },
  {
    id: 'e004',
    name: '刘德明',
    gender: 'male',
    age: 75,
    birthDate: '1949-05-12',
    idCard: '310101194905123456',
    phone: '13545678901',
    address: '上海市静安区华山路234弄8号501室',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20man%20portrait%20smiling%20asian%20senior&image_size=square',
    abilityLevel: 'semi-dependent',
    chronicDiseases: ['糖尿病', '前列腺增生'],
    riskTags: ['独居'],
    admissionDate: '2023-04-20',
    emergencyContacts: [
      { id: 'ec005', elderlyId: 'e004', name: '刘芳', relationship: '女儿', phone: '13654321098', priority: 1, isPrimary: true }
    ],
    familyMembers: [
      { id: 'fm005', name: '刘芳', relationship: '女儿', phone: '13654321098', isAuthorized: true }
    ]
  },
  {
    id: 'e005',
    name: '周美华',
    gender: 'female',
    age: 80,
    birthDate: '1944-09-28',
    idCard: '310101194409287890',
    phone: '13456789012',
    address: '上海市静安区愚园路678弄45号102室',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20woman%20portrait%20gentle%20smile%20asian&image_size=square',
    abilityLevel: 'dependent',
    chronicDiseases: ['阿尔茨海默症', '高血压', '糖尿病'],
    riskTags: ['认知障碍', '走失风险'],
    admissionDate: '2022-11-15',
    emergencyContacts: [
      { id: 'ec006', elderlyId: 'e005', name: '周明', relationship: '儿子', phone: '13345678901', priority: 1, isPrimary: true }
    ],
    familyMembers: [
      { id: 'fm006', name: '周明', relationship: '儿子', phone: '13345678901', isAuthorized: true }
    ]
  },
  {
    id: 'e006',
    name: '吴玉兰',
    gender: 'female',
    age: 68,
    birthDate: '1956-02-14',
    idCard: '310101195602142345',
    phone: '13367890123',
    address: '上海市静安区北京西路123号803室',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=senior%20woman%20portrait%20elegant%20asian&image_size=square',
    abilityLevel: 'independent',
    chronicDiseases: [],
    riskTags: [],
    admissionDate: '2024-01-10',
    emergencyContacts: [
      { id: 'ec007', elderlyId: 'e006', name: '吴亮', relationship: '儿子', phone: '13234567890', priority: 1, isPrimary: true }
    ],
    familyMembers: [
      { id: 'fm007', name: '吴亮', relationship: '儿子', phone: '13234567890', isAuthorized: true }
    ]
  }
];

export const mockServicePackages: ServicePackage[] = [
  {
    id: 'sp001',
    name: '基础护理套餐',
    description: '包含日常清洁、协助进餐、基本健康监测',
    price: 1200,
    subsidyPrice: 800,
    services: ['个人卫生清洁', '协助进餐', '血压测量', '房间整理'],
    duration: '2小时/次',
    icon: 'Heart'
  },
  {
    id: 'sp002',
    name: '康复护理套餐',
    description: '专业康复训练、理疗按摩、功能恢复',
    price: 2000,
    subsidyPrice: 1400,
    services: ['康复训练指导', '理疗按摩', '关节活动', '步态训练'],
    duration: '1.5小时/次',
    icon: 'Activity'
  },
  {
    id: 'sp003',
    name: '医疗陪护套餐',
    description: '陪诊就医、取药送药、健康管理',
    price: 1800,
    subsidyPrice: 1200,
    services: ['陪诊就医', '取药送药', '用药提醒', '复诊预约'],
    duration: '按需服务',
    icon: 'Stethoscope'
  },
  {
    id: 'sp004',
    name: '全护套餐',
    description: '24小时全方位生活照料和医疗护理',
    price: 4500,
    subsidyPrice: 3200,
    services: ['全天生活照料', '专业医疗护理', '康复训练', '心理疏导'],
    duration: '24小时',
    icon: 'Shield'
  },
  {
    id: 'sp005',
    name: '日间照料',
    description: '白天托管服务，含午餐和活动',
    price: 1500,
    subsidyPrice: 1000,
    services: ['日间照料', '营养午餐', '文娱活动', '健康监测'],
    duration: '8:00-18:00',
    icon: 'Sun'
  },
  {
    id: 'sp006',
    name: '临终关怀',
    description: '专业舒缓护理，减轻痛苦，提高生活质量',
    price: 3500,
    subsidyPrice: 2800,
    services: ['疼痛管理', '舒适护理', '心理支持', '家属辅导'],
    duration: '按需服务',
    icon: 'HandHeart'
  }
];

export const mockCareWorkers: CareWorker[] = [
  {
    id: 'cw001',
    name: '张红',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20caregiver%20nurse%20uniform%20smile&image_size=square',
    phone: '13811112222',
    gender: 'female',
    age: 38,
    skills: ['基础护理', '康复训练', '老年痴呆护理'],
    rating: 4.9,
    completedTasks: 356,
    status: 'on-duty'
  },
  {
    id: 'cw002',
    name: '李娟',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20female%20caregiver%20asian%20middle%20age&image_size=square',
    phone: '13833334444',
    gender: 'female',
    age: 42,
    skills: ['医疗陪护', '用药管理', '急救处理'],
    rating: 4.8,
    completedTasks: 289,
    status: 'busy'
  },
  {
    id: 'cw003',
    name: '王芳',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20female%20nurse%20professional%20kind&image_size=square',
    phone: '13855556666',
    gender: 'female',
    age: 29,
    skills: ['康复理疗', '按摩推拿', '心理疏导'],
    rating: 4.7,
    completedTasks: 178,
    status: 'on-duty'
  },
  {
    id: 'cw004',
    name: '刘强',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=male%20caregiver%20professional%20strong%20asian&image_size=square',
    phone: '13877778888',
    gender: 'male',
    age: 35,
    skills: ['全护护理', '转移协助', '康复训练'],
    rating: 4.8,
    completedTasks: 245,
    status: 'off-duty'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a001',
    elderlyId: 'e001',
    elderlyName: '张桂芳',
    servicePackageId: 'sp001',
    servicePackageName: '基础护理套餐',
    scheduledTime: '2024-06-10 09:00:00',
    status: 'confirmed',
    careWorkerId: 'cw001',
    careWorkerName: '张红',
    createTime: '2024-06-08 14:30:00',
    notes: '老人血压较高，需要密切监测'
  },
  {
    id: 'a002',
    elderlyId: 'e002',
    elderlyName: '王建国',
    servicePackageId: 'sp004',
    servicePackageName: '全护套餐',
    scheduledTime: '2024-06-10 10:30:00',
    status: 'pending',
    createTime: '2024-06-09 09:15:00'
  },
  {
    id: 'a003',
    elderlyId: 'e003',
    elderlyName: '陈秀英',
    servicePackageId: 'sp002',
    servicePackageName: '康复护理套餐',
    scheduledTime: '2024-06-10 14:00:00',
    status: 'confirmed',
    careWorkerId: 'cw003',
    careWorkerName: '王芳',
    createTime: '2024-06-07 16:45:00'
  },
  {
    id: 'a004',
    elderlyId: 'e004',
    elderlyName: '刘德明',
    servicePackageId: 'sp003',
    servicePackageName: '医疗陪护套餐',
    scheduledTime: '2024-06-11 08:30:00',
    status: 'pending',
    createTime: '2024-06-09 11:20:00',
    notes: '需要陪同去医院复查'
  },
  {
    id: 'a005',
    elderlyId: 'e005',
    elderlyName: '周美华',
    servicePackageId: 'sp004',
    servicePackageName: '全护套餐',
    scheduledTime: '2024-06-09 15:00:00',
    status: 'completed',
    careWorkerId: 'cw002',
    careWorkerName: '李娟',
    createTime: '2024-06-05 10:00:00'
  }
];

export const mockTasks: Task[] = [
  {
    id: 't001',
    appointmentId: 'a001',
    elderlyId: 'e001',
    elderlyName: '张桂芳',
    elderlyAddress: '上海市静安区南京西路1234弄56号701室',
    elderlyAvatar: mockElderly[0].avatar,
    careWorkerId: 'cw001',
    careWorkerName: '张红',
    serviceItems: ['个人卫生清洁', '协助进餐', '血压测量', '房间整理'],
    scheduledTime: '2024-06-10 09:00:00',
    status: 'pending',
    photos: [],
    location: { lat: 31.2304, lng: 121.4737 }
  },
  {
    id: 't002',
    appointmentId: 'a003',
    elderlyId: 'e003',
    elderlyName: '陈秀英',
    elderlyAddress: '上海市静安区常德路567弄12号302室',
    elderlyAvatar: mockElderly[2].avatar,
    careWorkerId: 'cw003',
    careWorkerName: '王芳',
    serviceItems: ['康复训练指导', '理疗按摩', '关节活动'],
    scheduledTime: '2024-06-10 14:00:00',
    status: 'pending',
    photos: [],
    location: { lat: 31.2350, lng: 121.4500 }
  },
  {
    id: 't003',
    appointmentId: 'a005',
    elderlyId: 'e005',
    elderlyName: '周美华',
    elderlyAddress: '上海市静安区愚园路678弄45号102室',
    elderlyAvatar: mockElderly[4].avatar,
    careWorkerId: 'cw002',
    careWorkerName: '李娟',
    serviceItems: ['全天生活照料', '专业医疗护理', '康复训练'],
    scheduledTime: '2024-06-09 15:00:00',
    checkInTime: '2024-06-09 14:55:00',
    checkOutTime: '2024-06-09 17:30:00',
    status: 'completed',
    photos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=caregiver%20helping%20elderly%20woman%20warm%20scene&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20care%20service%20professional&image_size=square'
    ],
    location: { lat: 31.2280, lng: 121.4450 }
  }
];

export const mockHealthRecords: HealthRecord[] = [
  { id: 'h001', elderlyId: 'e001', recordTime: '2024-06-09 09:30:00', bloodPressureSystolic: 145, bloodPressureDiastolic: 92, bloodSugar: 7.8, heartRate: 78, temperature: 36.5, recordedBy: '张红', isAbnormal: true, notes: '血压偏高，建议调整用药' },
  { id: 'h002', elderlyId: 'e001', recordTime: '2024-06-08 09:15:00', bloodPressureSystolic: 138, bloodPressureDiastolic: 88, bloodSugar: 7.2, heartRate: 75, temperature: 36.6, recordedBy: '张红', isAbnormal: false },
  { id: 'h003', elderlyId: 'e001', recordTime: '2024-06-07 09:20:00', bloodPressureSystolic: 140, bloodPressureDiastolic: 90, bloodSugar: 7.5, heartRate: 76, temperature: 36.4, recordedBy: '张红', isAbnormal: false },
  { id: 'h004', elderlyId: 'e001', recordTime: '2024-06-06 09:10:00', bloodPressureSystolic: 135, bloodPressureDiastolic: 85, bloodSugar: 6.9, heartRate: 74, temperature: 36.5, recordedBy: '张红', isAbnormal: false },
  { id: 'h005', elderlyId: 'e001', recordTime: '2024-06-05 09:25:00', bloodPressureSystolic: 142, bloodPressureDiastolic: 91, bloodSugar: 8.1, heartRate: 80, temperature: 36.6, recordedBy: '张红', isAbnormal: true },
  { id: 'h006', elderlyId: 'e001', recordTime: '2024-06-04 09:05:00', bloodPressureSystolic: 136, bloodPressureDiastolic: 86, bloodSugar: 7.0, heartRate: 73, temperature: 36.4, recordedBy: '张红', isAbnormal: false },
  { id: 'h007', elderlyId: 'e001', recordTime: '2024-06-03 09:30:00', bloodPressureSystolic: 139, bloodPressureDiastolic: 89, bloodSugar: 7.3, heartRate: 77, temperature: 36.5, recordedBy: '张红', isAbnormal: false },
  { id: 'h008', elderlyId: 'e002', recordTime: '2024-06-09 10:00:00', bloodPressureSystolic: 155, bloodPressureDiastolic: 98, heartRate: 82, temperature: 36.7, recordedBy: '李娟', isAbnormal: true, notes: '血压较高，已通知家属' }
];

export const mockMedications: Medication[] = [
  { id: 'm001', elderlyId: 'e001', name: '硝苯地平缓释片', dosage: '10mg', frequency: '每日2次', times: ['08:00', '20:00'], startDate: '2024-01-15', isActive: true },
  { id: 'm002', elderlyId: 'e001', name: '二甲双胍', dosage: '500mg', frequency: '每日3次', times: ['08:00', '12:00', '18:00'], startDate: '2024-02-20', isActive: true },
  { id: 'm003', elderlyId: 'e002', name: '阿司匹林肠溶片', dosage: '100mg', frequency: '每日1次', times: ['08:00'], startDate: '2023-11-10', isActive: true },
  { id: 'm004', elderlyId: 'e002', name: '阿托伐他汀钙片', dosage: '20mg', frequency: '每日1次', times: ['20:00'], startDate: '2023-12-01', isActive: true }
];

export const mockBills: Bill[] = [
  {
    id: 'b001',
    elderlyId: 'e001',
    elderlyName: '张桂芳',
    month: '2024-05',
    totalAmount: 3600,
    subsidyAmount: 2400,
    actualAmount: 1200,
    status: 'paid',
    createTime: '2024-05-31 10:00:00',
    paidTime: '2024-06-02 15:30:00',
    items: [
      { id: 'bi001', name: '基础护理套餐 x 3次', quantity: 3, unitPrice: 1200, amount: 3600, subsidyAmount: 2400 }
    ]
  },
  {
    id: 'b002',
    elderlyId: 'e002',
    elderlyName: '王建国',
    month: '2024-05',
    totalAmount: 13500,
    subsidyAmount: 9600,
    actualAmount: 3900,
    status: 'paid',
    createTime: '2024-05-31 10:05:00',
    paidTime: '2024-06-01 09:20:00',
    items: [
      { id: 'bi002', name: '全护套餐 x 30天', quantity: 30, unitPrice: 450, amount: 13500, subsidyAmount: 9600 }
    ]
  },
  {
    id: 'b003',
    elderlyId: 'e003',
    elderlyName: '陈秀英',
    month: '2024-05',
    totalAmount: 2000,
    subsidyAmount: 1400,
    actualAmount: 600,
    status: 'unpaid',
    createTime: '2024-05-31 10:10:00',
    items: [
      { id: 'bi003', name: '康复护理套餐 x 1次', quantity: 1, unitPrice: 2000, amount: 2000, subsidyAmount: 1400 }
    ]
  },
  {
    id: 'b004',
    elderlyId: 'e004',
    elderlyName: '刘德明',
    month: '2024-05',
    totalAmount: 1800,
    subsidyAmount: 1200,
    actualAmount: 600,
    status: 'subsidized',
    createTime: '2024-05-31 10:15:00',
    items: [
      { id: 'bi004', name: '医疗陪护套餐 x 1次', quantity: 1, unitPrice: 1800, amount: 1800, subsidyAmount: 1200 }
    ]
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg001',
    recipientId: 'fm001',
    recipientType: 'family',
    title: '服务完成通知',
    content: '张桂芳老人今日的基础护理服务已完成，服务人员：张红，服务时长：2小时。',
    type: 'service',
    isRead: false,
    createTime: '2024-06-09 17:30:00',
    relatedId: 't003',
    hasReadReceipt: false
  },
  {
    id: 'msg002',
    recipientId: 'fm001',
    recipientType: 'family',
    title: '健康异常提醒',
    content: '张桂芳老人今日血压测量值为 145/92 mmHg，略高于正常范围，建议密切关注。',
    type: 'emergency',
    isRead: false,
    createTime: '2024-06-09 09:35:00',
    relatedId: 'h001'
  },
  {
    id: 'msg003',
    recipientId: 'fm001',
    recipientType: 'family',
    title: '满意度调查',
    content: '请对昨日的服务进行评价，您的反馈对我们很重要！',
    type: 'survey',
    isRead: true,
    createTime: '2024-06-08 18:00:00',
    relatedId: 't003'
  },
  {
    id: 'msg004',
    recipientId: 'fm002',
    recipientType: 'family',
    title: '预约确认',
    content: '您预约的全护套餐已确认，护理员李娟将于明日10:30上门服务。',
    type: 'service',
    isRead: true,
    createTime: '2024-06-09 16:00:00',
    relatedId: 'a002'
  },
  {
    id: 'msg005',
    recipientId: 'cw001',
    recipientType: 'worker',
    title: '新任务分配',
    content: '您有新的上门任务：张桂芳 - 基础护理，时间：6月10日 09:00',
    type: 'system',
    isRead: false,
    createTime: '2024-06-09 14:30:00',
    relatedId: 't001'
  },
  {
    id: 'msg006',
    recipientId: 'fm001',
    recipientType: 'family',
    title: '生日关怀',
    content: '张桂芳老人即将迎来78岁生日，街道养老服务中心祝您生日快乐，身体健康！',
    type: 'system',
    isRead: true,
    createTime: '2024-03-10 09:00:00'
  }
];

export const mockAssessments: AbilityAssessment[] = [
  {
    id: 'as001',
    elderlyId: 'e001',
    assessDate: '2024-03-15',
    assessor: '王医生',
    eating: 2,
    bathing: 3,
    dressing: 2,
    toileting: 2,
    mobility: 3,
    communication: 1,
    totalScore: 13,
    level: 'semi-dependent',
    notes: '老人日常生活部分需要协助，行走不便'
  },
  {
    id: 'as002',
    elderlyId: 'e002',
    assessDate: '2024-01-10',
    assessor: '李医生',
    eating: 4,
    bathing: 4,
    dressing: 4,
    toileting: 4,
    mobility: 4,
    communication: 3,
    totalScore: 23,
    level: 'dependent',
    notes: '老人完全丧失自理能力，需要24小时护理'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalElderly: 156,
  activeCareWorkers: 12,
  todayTasks: 28,
  completedTasks: 15,
  pendingAppointments: 8,
  highRiskElderly: 23,
  monthlyRevenue: 128500,
  satisfactionRate: 96.5
};

export const monthlyServiceData = [
  { month: '1月', 服务人次: 320, 新增老人: 12 },
  { month: '2月', 服务人次: 290, 新增老人: 8 },
  { month: '3月', 服务人次: 350, 新增老人: 15 },
  { month: '4月', 服务人次: 380, 新增老人: 10 },
  { month: '5月', 服务人次: 420, 新增老人: 18 },
  { month: '6月', 服务人次: 450, 新增老人: 14 }
];

export const serviceTypeData = [
  { name: '基础护理', value: 35 },
  { name: '康复护理', value: 25 },
  { name: '医疗陪护', value: 20 },
  { name: '全护服务', value: 15 },
  { name: '其他', value: 5 }
];
