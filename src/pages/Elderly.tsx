import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Users,
  Search,
  Plus,
  Filter,
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
  Trash2
} from 'lucide-react';

export default function Elderly() {
  const { elderly, setSelectedElderly, selectedElderly } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showDetail, setShowDetail] = useState(false);

  const filteredElderly = elderly.filter((e) => {
    const matchSearch = e.name.includes(searchQuery) || e.idCard.includes(searchQuery) || e.phone.includes(searchQuery);
    const matchLevel = filterLevel === 'all' || e.abilityLevel === filterLevel;
    return matchSearch && matchLevel;
  });

  const getAbilityLevelText = (level: string) => {
    switch (level) {
      case 'independent': return { text: '自理', color: 'bg-green-100 text-green-700' };
      case 'semi-dependent': return { text: '半失能', color: 'bg-orange-100 text-orange-700' };
      case 'dependent': return { text: '失能', color: 'bg-red-100 text-red-700' };
      default: return { text: '未知', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const openDetail = (e: typeof elderly[0]) => {
    setSelectedElderly(e);
    setShowDetail(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">老人档案</h1>
          <p className="text-gray-500 mt-1">管理社区老人的基本信息、健康状况和服务记录</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          新增档案
        </button>
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
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">筛选</span>
            </button>
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
                    <span>{e.phone}</span>
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
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
                      <span className="text-sm text-gray-600">{selectedElderly.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">{selectedElderly.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">入档日期：{selectedElderly.admissionDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">身份证：{selectedElderly.idCard}</span>
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
                          <p className="text-sm text-gray-500">{c.relationship} · {c.phone}</p>
                        </div>
                      </div>
                      <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg">
                        <Phone className="w-5 h-5" />
                      </button>
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
                          <p className="text-sm text-gray-500">{f.relationship} · {f.phone}</p>
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
    </div>
  );
}
