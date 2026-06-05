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
  MessageSquare,
  Send,
  Check
} from 'lucide-react';
import type { EmergencyContact } from '@/types';

export default function Contacts() {
  const { elderly, addMessage, addEmergencyContact, currentRole } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElderlyId, setSelectedElderlyId] = useState<string>('e001');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [reportForm, setReportForm] = useState({
    type: '',
    description: '',
    contactId: ''
  });
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    isPrimary: false
  });

  const selectedElderly = elderly.find((e) => e.id === selectedElderlyId);
  const contacts = selectedElderly?.emergencyContacts || [];

  const filteredElderly = elderly.filter((e) =>
    e.name.includes(searchQuery)
  );

  const canManage = currentRole === 'admin';

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

  const openMessageModal = (contact: EmergencyContact) => {
    setSelectedContact(contact);
    setMessageContent('');
    setShowMessageModal(true);
  };

  const handleSendMessage = () => {
    if (!selectedContact || !messageContent.trim()) return;

    const message = {
      id: `msg${Date.now()}`,
      recipientId: selectedContact.id,
      recipientType: 'family' as const,
      title: '社区养老服务中心通知',
      content: messageContent,
      type: 'service' as const,
      isRead: false,
      createTime: new Date().toISOString(),
      hasReadReceipt: true
    };

    addMessage(message);
    setShowMessageModal(false);
    setSelectedContact(null);
    setMessageContent('');
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;

    const contact: EmergencyContact = {
      id: `ec${Date.now()}`,
      elderlyId: selectedElderlyId,
      name: newContact.name,
      relationship: newContact.relationship,
      phone: newContact.phone,
      priority: contacts.length + 1,
      isPrimary: newContact.isPrimary
    };

    addEmergencyContact(selectedElderlyId, contact);
    setShowAddContactModal(false);
    setNewContact({ name: '', relationship: '', phone: '', isPrimary: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">紧急联系人</h1>
          <p className="text-gray-500 mt-1">管理老人的紧急联系人和家属沟通</p>
        </div>
        <div className="flex gap-3">
          {canManage && (
            <button
              onClick={() => setShowAddContactModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              添加联系人
            </button>
          )}
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
          >
            <AlertTriangle className="w-5 h-5" />
            异常上报
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索老人..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto">
              {filteredElderly.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setSelectedElderlyId(e.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedElderlyId === e.id
                      ? 'bg-teal-50 border-2 border-teal-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{e.name}</p>
                      <p className="text-xs text-gray-500">{e.age}岁 · {contacts.length}位联系人</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {selectedElderly ? (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <img src={selectedElderly.avatar} alt={selectedElderly.name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedElderly.name}</h2>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedElderly.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedElderly.address}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 mb-4">紧急联系人 ({contacts.length})</h3>
                {contacts.length > 0 ? (
                  <div className="space-y-3">
                    {contacts.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            c.isPrimary ? 'bg-teal-100' : 'bg-gray-200'
                          }`}>
                            <User className={`w-6 h-6 ${c.isPrimary ? 'text-teal-600' : 'text-gray-500'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-800">{c.name}</p>
                              {c.isPrimary && (
                                <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded">主要联系人</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{c.relationship} · {c.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${c.phone}`}
                            className="p-2.5 bg-teal-100 text-teal-600 rounded-xl hover:bg-teal-200 transition-colors"
                            title="拨打电话"
                          >
                            <Phone className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() => openMessageModal(c)}
                            className="p-2.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                            title="发送消息"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">暂无紧急联系人</p>
                    {canManage && (
                      <button
                        onClick={() => setShowAddContactModal(true)}
                        className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        + 添加联系人
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">家属授权</h3>
                {selectedElderly.familyMembers.length > 0 ? (
                  <div className="space-y-3">
                    {selectedElderly.familyMembers.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{f.name}</p>
                            <p className="text-sm text-gray-500">{f.relationship} · {f.phone}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          f.isAuthorized ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {f.isAuthorized ? '已授权' : '未授权'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">暂无家属信息</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">请选择一位老人查看联系人信息</p>
            </div>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                异常事件上报
              </h2>
              <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">事件类型</label>
                <select
                  value={reportForm.type}
                  onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">事件详情</label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  placeholder="请详细描述事件情况..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">通知联系人</label>
                <select
                  value={reportForm.contactId}
                  onChange={(e) => setReportForm({ ...reportForm, contactId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">所有联系人</option>
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
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                提交上报
              </button>
            </div>
          </div>
        </div>
      )}

      {showMessageModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">发送消息</h2>
                <p className="text-sm text-gray-500 mt-1">发送给：{selectedContact.name}（{selectedContact.relationship}）</p>
              </div>
              <button onClick={() => { setShowMessageModal(false); setSelectedContact(null); }} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="请输入消息内容..."
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => { setShowMessageModal(false); setSelectedContact(null); }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageContent.trim()}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                发送消息
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">添加紧急联系人</h2>
              <button onClick={() => { setShowAddContactModal(false); setNewContact({ name: '', relationship: '', phone: '', isPrimary: false }); }} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="请输入联系人姓名"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">与老人关系</label>
                <input
                  type="text"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  placeholder="如：儿子、女儿、配偶"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">联系电话 *</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="请输入联系电话"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPrimaryContact"
                  checked={newContact.isPrimary}
                  onChange={(e) => setNewContact({ ...newContact, isPrimary: e.target.checked })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
                <label htmlFor="isPrimaryContact" className="text-sm text-gray-700">设为主要联系人</label>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => { setShowAddContactModal(false); setNewContact({ name: '', relationship: '', phone: '', isPrimary: false }); }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleAddContact}
                disabled={!newContact.name || !newContact.phone}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                保存联系人
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
