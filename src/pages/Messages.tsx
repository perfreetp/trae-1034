import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  MessageSquare,
  Search,
  ChevronDown,
  Bell,
  AlertTriangle,
  CheckCircle,
  X,
  Check,
  Clock,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import type { Message } from '@/types';

export default function Messages() {
  const { messages, currentRole, currentFamily, currentWorker, markMessageRead, addMessage, elderly, tasks, appointments, healthRecords } = useStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const getElderlyIdFromRelatedId = (relatedId?: string): string | null => {
    if (!relatedId) return null;
    if (relatedId.startsWith('t')) {
      const task = tasks.find(t => t.id === relatedId);
      return task?.elderlyId || null;
    }
    if (relatedId.startsWith('a')) {
      const appt = appointments.find(a => a.id === relatedId);
      return appt?.elderlyId || null;
    }
    if (relatedId.startsWith('h')) {
      const record = healthRecords.find(r => r.id === relatedId);
      return record?.elderlyId || null;
    }
    return null;
  };

  const filteredMessages = messages.filter((msg) => {
    let matchRole = true;
    let matchType = true;
    let matchElderly = true;

    if (currentRole === 'family' && currentFamily) {
      matchRole = msg.recipientId === currentFamily.id;
      matchType = ['service', 'emergency', 'survey'].includes(msg.type);
      const elderlyId = getElderlyIdFromRelatedId(msg.relatedId);
      if (elderlyId) {
        matchElderly = currentFamily.authorizedElderlyIds.includes(elderlyId);
      }
    } else if (currentRole === 'worker' && currentWorker) {
      matchRole = msg.recipientId === currentWorker.id;
      matchType = filterType === 'all' || msg.type === filterType;
    } else {
      matchType = filterType === 'all' || msg.type === filterType;
    }

    const matchSearch = msg.title.includes(searchQuery) || msg.content.includes(searchQuery);
    return matchRole && matchType && matchElderly && matchSearch;
  }).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

  const unreadCount = filteredMessages.filter((m) => !m.isRead).length;

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'service': return { text: '服务通知', color: 'bg-teal-100 text-teal-700', icon: CheckCircle };
      case 'emergency': return { text: '紧急提醒', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
      case 'system': return { text: '系统消息', color: 'bg-blue-100 text-blue-700', icon: Bell };
      case 'survey': return { text: '满意度调查', color: 'bg-purple-100 text-purple-700', icon: Star };
      default: return { text: '其他', color: 'bg-gray-100 text-gray-700', icon: MessageSquare };
    }
  };

  const openDetail = (message: Message) => {
    setSelectedMessage(message);
    setShowDetail(true);
    if (!message.isRead) {
      markMessageRead(message.id);
    }
  };

  const handleReply = () => {
    if (!replyContent.trim()) return;
    const replyMsg: Message = {
      id: `msg${Date.now()}`,
      recipientId: 'admin001',
      recipientType: 'admin',
      title: '家属回复',
      content: replyContent,
      type: 'system',
      isRead: false,
      createTime: new Date().toISOString(),
      hasReadReceipt: true
    };
    addMessage(replyMsg);
    setShowReplyModal(false);
    setReplyContent('');
  };

  const canReply = currentRole === 'family' || currentRole === 'worker';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">家属消息</h1>
          <p className="text-gray-500 mt-1">查看和管理所有消息通知</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            <Bell className="w-4 h-4" />
            {unreadCount} 条未读
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索消息标题、内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">全部类型</option>
              <option value="service">服务通知</option>
              <option value="emergency">紧急提醒</option>
              <option value="system">系统消息</option>
              <option value="survey">满意度调查</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredMessages.map((message) => {
            const typeInfo = getTypeInfo(message.type);
            const TypeIcon = typeInfo.icon;
            return (
              <div
                key={message.id}
                onClick={() => openDetail(message)}
                className={`p-5 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  !message.isRead
                    ? 'border-teal-200 bg-teal-50/30 hover:bg-teal-50'
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${typeInfo.color.replace('text-', 'bg-').replace('700', '100')}`}>
                    <TypeIcon className={`w-6 h-6 ${typeInfo.color.split(' ')[1]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-semibold truncate ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.title}
                        </h3>
                        {!message.isRead ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-medium flex-shrink-0">
                            <EyeOff className="w-3 h-3" />
                            未读
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium flex-shrink-0">
                            <Eye className="w-3 h-3" />
                            已读
                          </span>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${typeInfo.color}`}>
                        {typeInfo.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{message.content}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(message.createTime).toLocaleString('zh-CN')}
                      </span>
                      {message.hasReadReceipt && message.isRead && (
                        <span className="flex items-center gap-1 text-teal-600">
                          <Check className="w-3 h-3" />
                          已读回执
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无消息</p>
          </div>
        )}
      </div>

      {showDetail && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedMessage.title}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-teal-100">
                      {new Date(selectedMessage.createTime).toLocaleString('zh-CN')}
                    </p>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      <Check className="w-3 h-3" />
                      已读
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${getTypeInfo(selectedMessage.type).color}`}>
                {(() => {
                  const Icon = getTypeInfo(selectedMessage.type).icon;
                  return <Icon className="w-4 h-4" />;
                })()}
                {getTypeInfo(selectedMessage.type).text}
              </div>
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
              {selectedMessage.hasReadReceipt && (
                <div className="flex items-center gap-2 text-sm text-teal-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>消息已送达，对方已读</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowDetail(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                关闭
              </button>
              {canReply && (
                <button
                  onClick={() => { setShowDetail(false); setShowReplyModal(true); }}
                  className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  回复
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showReplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">回复消息</h2>
                <button onClick={() => { setShowReplyModal(false); setReplyContent(''); }} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="请输入您的回复内容..."
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => { setShowReplyModal(false); setReplyContent(''); }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleReply}
                disabled={!replyContent.trim()}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                发送回复
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
