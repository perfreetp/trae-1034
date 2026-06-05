import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Phone,
  Plus,
  Search,
  User,
  MapPin,
  AlertTriangle,
  ChevronDown,
  X,
  Star,
  MessageSquare
} from 'lucide-react';

export default function Contacts() {
  const { elderly, addMessage } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElderlyId, setSelectedElderlyId] = useState<string>('e001');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    type: '',
    description: '',
    contactId: ''
  });

  const selectedElderly = elderly.find((e) => e.id === selectedElderlyId);
  const contacts = selectedElderly?.emergencyContacts || [];

  const filteredElderly = elderly.filter((e) =>
    e.name.includes(searchQuery)
  );

  const handleReport = () => {
    if (!reportForm.type || !reportForm.description) return;

    const message = {
      id: `msg${Date.now()}`,
      recipientId: reportForm.contactId || 'fm001',
      recipientType: 'family' as const,
      title: '紧急事件上报',
      content: `事件类型：${reportForm.type}\n详情：${reportForm.description}\n老人：${selectedElderly?.name}`,
      type: 'emergency' as const,
      isRead: false,
      createTime: new Date().toISOString()
    };

    addMessage(message);
    setShowReportModal(false);
    setReportForm({ type: '', description: '', contactId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">紧急联系人</h1>
          <p className="text-gray-500 mt-1">管理老人的紧急联系人和异常事件上报</p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
        >
          <AlertTriangle className="w-5 h-5" />
          异常上报
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">老人列表</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索老人姓名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredElderly.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedElderlyId(e.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  selectedElderlyId === e.id
                    ? 'bg-teal-50 border border-teal-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{e.name}</p>
                  <p className="text-xs text-gray-500">{e.age}岁 · {e.chronicDiseases.length}种慢病</p>
                </div>
                {e.riskTags.length > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          {selectedElderly ? (
            <>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <img src={selectedElderly.avatar} alt={selectedElderly.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedElderly.name}</h3>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {selectedElderly.address}
                  </p>
                  {selectedElderly.riskTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedElderly.riskTags.map((t) => (
                        <span key={t} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-teal-600" />
                紧急联系人
              </h4>

              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div
                    key={contact.id}
                    className={`p-4 rounded-xl border ${
                      contact.isPrimary
                        ? 'bg-gradient-to-r from-teal-50 to-white border-teal-200'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          contact.isPrimary ? 'bg-teal-100' : 'bg-gray-200'
                        }`}>
                          <User className={`w-6 h-6 ${contact.isPrimary ? 'text-teal-600' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-800">{contact.name}</p>
                            {contact.isPrimary && (
                              <span className="flex items-center gap-1 text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                                <Star className="w-3 h-3" />
                                主要联系人
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{contact.relationship}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${contact.phone}`}
                          className="p-2.5 bg-teal-100 text-teal-600 rounded-xl hover:bg-teal-200 transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                        </a>
                        <button className="p-2.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors">
                          <MessageSquare className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 pl-16">
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-400">联系电话：</span>
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                ))}

                {contacts.length === 0 && (
                  <div className="text-center py-12">
                    <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400">暂无紧急联系人</p>
                    <button className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium">
                      + 添加联系人
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">家属授权</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedElderly.familyMembers.map((f) => (
                    <div key={f.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{f.name}</p>
                          <p className="text-xs text-gray-500">{f.relationship}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        f.isAuthorized ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {f.isAuthorized ? '已授权' : '未授权'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400">请选择一位老人查看联系人</p>
            </div>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">异常事件上报</h2>
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择老人</label>
                <select
                  value={selectedElderlyId}
                  onChange={(e) => setSelectedElderlyId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {elderly.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">事件类型</label>
                <select
                  value={reportForm.type}
                  onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">请选择事件类型</option>
                  <option value="健康异常">健康异常</option>
                  <option value="跌倒摔伤">跌倒摔伤</option>
                  <option value="走失">走失</option>
                  <option value="情绪异常">情绪异常</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">事件描述</label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  placeholder="请详细描述事件情况..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">通知联系人</label>
                <select
                  value={reportForm.contactId}
                  onChange={(e) => setReportForm({ ...reportForm, contactId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">选择联系人</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} - {c.relationship}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleReport}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                确认上报
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
