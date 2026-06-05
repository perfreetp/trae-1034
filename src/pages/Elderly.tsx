import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Users,
  Search,
  Plus,
  ChevronDown,
  Heart,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  X,
  Edit,
  Trash2,
  Check,
  Save
} from 'lucide-react';
import type { Elderly, EmergencyContact, FamilyMember } from '@/types';

const chronicDiseaseOptions = ['高血压', '糖尿病', '冠心病', '关节炎', '高血脂', '阿尔茨海默症', '前列腺增生'];
const riskTagOptions = ['独居', '跌倒风险', '失能', '需要24小时护理', '认知障碍', '走失风险'];

const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
};

const maskIdCard = (idCard: string): string => {
  if (!idCard || idCard.length < 8) return idCard;
  return idCard.slice(0, 6) + '********' + idCard.slice(-4);
};

const maskAddress = (address: string): string => {
  if (!address || address.length < 6) return address;
  return address.slice(0, 6) + '****';
};

export default function ElderlyPage() {
  const { elderly, setSelectedElderly, selectedElderly, addElderly, updateElderly, deleteElderly, currentRole, currentFamily } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    age: 65,
    birthDate: '1959-01-01',
    idCard: '',
    phone: '',
    address: '',
    abilityLevel: 'independent' as 'independent' | 'semi-dependent' | 'dependent',
    chronicDiseases: [] as string[],
    riskTags: [] as string[],
    emergencyContacts: [] as EmergencyContact[],
    familyMembers: [] as FamilyMember[]
  });

  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    isPrimary: false
  });

  const filteredElderly = elderly.filter((e) => {
    let matchRole = true;
    if (currentRole === 'family' && currentFamily) {
      matchRole = currentFamily.authorizedElderlyIds.includes(e.id);
    }
    const matchSearch = e.name.includes(searchQuery) || e.idCard.includes(searchQuery) || e.phone.includes(searchQuery);
    const matchLevel = filterLevel === 'all' || e.abilityLevel === filterLevel;
    return matchRole && matchSearch && matchLevel;
  });

  const getAbilityLevelText = (level: string) => {
    switch (level) {
      case 'independent': return { text: '自理', color: 'bg-green-100 text-green-700' };
      case 'semi-dependent': return { text: '半失能', color: 'bg-orange-100 text-orange-700' };
      case 'dependent': return { text: '失能', color: 'bg-red-100 text-red-700' };
      default: return { text: '未知', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const openDetail = (e: Elderly) => {
    setSelectedElderly(e);
    setShowDetail(true);
  };

  const openAddForm = () => {
    setFormMode('add');
    setEditingId(null);
    setFormData({
      name: '',
      gender: 'male',
      age: 65,
      birthDate: '1959-01-01',
      idCard: '',
      phone: '',
      address: '',
      abilityLevel: 'independent',
      chronicDiseases: [],
      riskTags: [],
      emergencyContacts: [],
      familyMembers: []
    });
    setShowForm(true);
  };

  const openEditForm = (e: Elderly, event: React.MouseEvent) => {
    event.stopPropagation();
    setFormMode('edit');
    setEditingId(e.id);
    setFormData({
      name: e.name,
      gender: e.gender,
      age: e.age,
      birthDate: e.birthDate,
      idCard: e.idCard,
      phone: e.phone,
      address: e.address,
      abilityLevel: e.abilityLevel,
      chronicDiseases: [...e.chronicDiseases],
      riskTags: [...e.riskTags],
      emergencyContacts: [...e.emergencyContacts],
      familyMembers: [...e.familyMembers]
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteElderly(deleteTargetId);
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    }
  };

  const toggleChronicDisease = (disease: string) => {
    setFormData(prev => ({
      ...prev,
      chronicDiseases: prev.chronicDiseases.includes(disease)
        ? prev.chronicDiseases.filter(d => d !== disease)
        : [...prev.chronicDiseases, disease]
    }));
  };

  const toggleRiskTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      riskTags: prev.riskTags.includes(tag)
        ? prev.riskTags.filter(t => t !== tag)
        : [...prev.riskTags, tag]
    }));
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    const contact: EmergencyContact = {
      id: `ec${Date.now()}`,
      elderlyId: editingId || '',
      name: newContact.name,
      relationship: newContact.relationship,
      phone: newContact.phone,
      priority: formData.emergencyContacts.length + 1,
      isPrimary: newContact.isPrimary
    };
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, contact]
    }));
    setNewContact({ name: '', relationship: '', phone: '', isPrimary: false });
  };

  const removeContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.idCard) return;

    if (formMode === 'add') {
      const newElderly: Elderly = {
        id: `e${Date.now()}`,
        ...formData,
        avatar: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(formData.gender === 'female' ? 'elderly woman portrait warm smile grandmother' : 'elderly man portrait kind grandfather glasses')}&image_size=square`,
        admissionDate: new Date().toISOString().split('T')[0]
      };
      addElderly(newElderly);
    } else if (formMode === 'edit' && editingId) {
      updateElderly(editingId, formData);
    }
    
    setShowForm(false);
    setFormMode('add');
    setEditingId(null);
  };

  const canManage = currentRole === 'admin';
  const isFamily = currentRole === 'family';

  const displayPhone = (phone: string) => isFamily ? maskPhone(phone) : phone;
  const displayIdCard = (idCard: string) => isFamily ? maskIdCard(idCard) : idCard;
  const displayAddress = (address: string) => isFamily ? maskAddress(address) : address;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">老人档案</h1>
          <p className="text-gray-500 mt-1">管理社区老人的基本信息、健康状况和服务记录</p>
        </div>
        {canManage && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            新增档案
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索姓名、身份证号、电话..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">全部等级</option>
                <option value="independent">自理</option>
                <option value="semi-dependent">半失能</option>
                <option value="dependent">失能</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredElderly.map((e) => {
          const levelInfo = getAbilityLevelText(e.abilityLevel);
          return (
            <div
              key={e.id}
              onClick={() => openDetail(e)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img src={e.avatar} alt={e.name} className="w-16 h-16 rounded-2xl object-cover" />
                  {e.riskTags.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 text-lg">{e.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelInfo.color}`}>
                      {levelInfo.text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{e.gender === 'female' ? '女' : '男'} · {e.age}岁</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <Phone className="w-3 h-3" />
                    <span>{displayPhone(e.phone)}</span>
                  </div>
                </div>
              </div>

              {e.chronicDiseases.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    慢病标签
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {e.chronicDiseases.map((d) => (
                      <span key={d} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {e.riskTags.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {e.riskTags.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-lg flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-teal-600 text-sm hover:text-teal-700 flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  查看详情
                </button>
                {canManage && (
                  <div className="flex gap-2">
                    <button
                      onClick={(event) => openEditForm(e, event)}
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(event) => handleDeleteClick(e.id, event)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredElderly.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {isFamily ? '暂无已授权的老人档案' : '暂无老人档案数据'}
          </p>
        </div>
      )}

      {showDetail && selectedElderly && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedElderly.avatar} alt={selectedElderly.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedElderly.name}</h2>
                    <p className="text-teal-100 mt-1">
                      {selectedElderly.gender === 'female' ? '女' : '男'} · {selectedElderly.age}岁 · {selectedElderly.birthDate}
                    </p>
                    <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${
                      selectedElderly.abilityLevel === 'independent' ? 'bg-green-500/20 text-green-100' :
                      selectedElderly.abilityLevel === 'semi-dependent' ? 'bg-orange-500/20 text-orange-100' :
                      'bg-red-500/20 text-red-100'
                    }`}>
                      {getAbilityLevelText(selectedElderly.abilityLevel).text}
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600" />
                    基本信息
                  </h3>
                  <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{displayPhone(selectedElderly.phone)}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">{displayAddress(selectedElderly.address)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">入档日期：{selectedElderly.admissionDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">身份证：{displayIdCard(selectedElderly.idCard)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    健康信息
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-2">慢病标签</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedElderly.chronicDiseases.length > 0 ? (
                        selectedElderly.chronicDiseases.map((d) => (
                          <span key={d} className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-lg">
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">无</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-4 mb-2">风险标签</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedElderly.riskTags.length > 0 ? (
                        selectedElderly.riskTags.map((t) => (
                          <span key={t} className="text-sm px-3 py-1 bg-orange-100 text-orange-600 rounded-lg">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">无</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">紧急联系人</h3>
                <div className="space-y-3">
                  {selectedElderly.emergencyContacts.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          c.isPrimary ? 'bg-teal-100' : 'bg-gray-200'
                        }`}>
                          <User className={`w-5 h-5 ${c.isPrimary ? 'text-teal-600' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {c.name}
                            {c.isPrimary && <span className="ml-2 text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded">主要联系人</span>}
                          </p>
                          <p className="text-sm text-gray-500">{c.relationship} · {displayPhone(c.phone)}</p>
                        </div>
                      </div>
                      {!isFamily && (
                        <a href={`tel:${c.phone}`} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg">
                          <Phone className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">家属授权</h3>
                <div className="space-y-3">
                  {selectedElderly.familyMembers.map((f) => (
                    <div key={f.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{f.name}</p>
                          <p className="text-sm text-gray-500">{f.relationship} · {displayPhone(f.phone)}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        f.isAuthorized ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {f.isAuthorized ? '已授权' : '未授权'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{formMode === 'add' ? '新增老人档案' : '编辑老人档案'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入姓名"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">年龄</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">出生日期</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">身份证号 *</label>
                  <input
                    type="text"
                    value={formData.idCard}
                    onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                    placeholder="请输入身份证号"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">联系电话 *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入联系电话"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">家庭住址</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="请输入详细地址"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">能力等级</label>
                <select
                  value={formData.abilityLevel}
                  onChange={(e) => setFormData({ ...formData, abilityLevel: e.target.value as 'independent' | 'semi-dependent' | 'dependent' })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="independent">自理</option>
                  <option value="semi-dependent">半失能</option>
                  <option value="dependent">失能</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">慢病标签</label>
                <div className="flex flex-wrap gap-2">
                  {chronicDiseaseOptions.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleChronicDisease(d)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.chronicDiseases.includes(d)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">风险标签</label>
                <div className="flex flex-wrap gap-2">
                  {riskTagOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleRiskTag(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.riskTags.includes(t)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">紧急联系人</label>
                <div className="space-y-3 mb-3">
                  {formData.emergencyContacts.map((c, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {c.name}
                          {c.isPrimary && <span className="ml-2 text-xs text-teal-600">主要</span>}
                        </p>
                        <p className="text-xs text-gray-500">{c.relationship} · {c.phone}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="姓名"
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    placeholder="关系"
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="电话"
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={addContact}
                    className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors"
                  >
                    添加
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={newContact.isPrimary}
                    onChange={(e) => setNewContact({ ...newContact, isPrimary: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="isPrimary" className="text-sm text-gray-600">设为主要联系人</label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {formMode === 'add' ? '保存档案' : '更新档案'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-500 mb-6">确定要删除这位老人的档案吗？此操作不可撤销。</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteTargetId(null); }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
