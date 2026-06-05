import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  MessageSquare,
  Search,
  Filter,
  ChevronDown,
  Bell,
  AlertTriangle,
  Heart,
  ClipboardList,
  X,
  Check,
  Star,
  Send,
  Clock,
  CheckCircle,
  Mail
} from 'lucide-react';
import type { Message } from '@/types';

export default function Messages() {
  const { messages, markMessageRead, addMessage, currentRole } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const filteredMessages = messages.filter((m) => {
    const matchSearch = m.title.includes(searchQuery) || m.content.includes(searchQuery);
    const matchType = filterType === 'all' || m.type === filterType;
    const matchRead = filterRead === 'all' || (filterRead === 'unread' ? !m.isRead : m.isRead);
    return matchSearch && matchType && matchRead;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const emergencyCount = messages.filter((m) => m.type === 'emergency' && !m.isRead).length;

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'system': return { text: '系统通知', color: 'bg-blue-100 text-blue-700', icon: Bell };
      case 'service': return { text: '服务通知', color: 'bg-teal-100 text-teal-700', icon: Heart };
      case 'emergency': return { text: '紧急提醒', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
      case 'survey': return { text: '满意度调查', color: 'bg-orange-100 text-orange-700', icon: ClipboardList };
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

  const handleSubmitSurvey = () => {
    if (selectedMessage) {
      const replyMessage: Message = {
        id: `msg${Date.now()}`,
        recipientId: 'admin',
        recipientType: 'admin',
        title: '满意度调查回执',
        content: `满意度评分：${rating}星${comment ? `，评价：${comment}` : ''}`,
        type: 'system',
        isRead: false,
        createTime: new Date().toISOString(),
        relatedId: selectedMessage.id,
        hasReadReceipt: true
      };
      addMessage(replyMessage);
      setShowSurvey(false);
      setShowDetail(false);
      setRating(5);
      setComment('');
    }
  };

  const handleMarkAllRead = () => {
    messages.forEach((m) => {
      if (!m.isRead) {
        markMessageRead(m.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">家属消息</h1>
          <p className="text-gray-500 mt-1">查看服务通知、健康提醒和满意度调查</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            全部已读
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg">
            <Send className="w-5 h-5" />
            发送消息
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-teal-100 text-sm">全部消息</span>
            <Mail className="w-6 h-6 text-teal-200" />
          </div>
          <p className="text-2xl font-bold">{messages.length}</p>
          <p className="text-teal-200 text-sm mt-1">条消息</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-orange-100 text-sm">未读消息</span>
            <Bell className="w-6 h-6 text-orange-200" />
          </div>
          <p className="text-2xl font-bold">{unreadCount}</p>
          <p className="text-orange-200 text-sm mt-1">条待查看</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-red-100 text-sm">紧急提醒</span>
            <AlertTriangle className="w-6 h-6 text-red-200" />
          </div>
          <p className="text-2xl font-bold">{emergencyCount}</p>
          <p className="text-red-200 text-sm mt-1">条待处理</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-100 text-sm">服务通知</span>
            <Heart className="w-6 h-6 text-blue-200" />
          </div>
          <p className="text-2xl font-bold">{messages.filter((m) => m.type === 'service').length}</p>
          <p className="text-blue-200 text-sm mt-1">条服务动态</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索消息标题或内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">全部类型</option>
                <option value="system">系统通知</option>
                <option value="service">服务通知</option>
                <option value="emergency">紧急提醒</option>
                <option value="survey">满意度调查</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">全部状态</option>
                <option value="unread">未读</option>
                <option value="read">已读</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">筛选</span>
            </button>
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
                className={`p-5 rounded-xl cursor-pointer transition-all border-2 hover:shadow-md ${
                  message.isRead
                    ? 'bg-gray-50 border-transparent hover:border-teal-200'
                    : 'bg-white border-teal-100 shadow-sm hover:border-teal-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${typeInfo.color}`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-semibold ${message.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                          {message.title}
                        </h3>
                        {!message.isRead && (
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${typeInfo.color}`}>
                          {typeInfo.text}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(message.createTime).toLocaleString('zh-CN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <p className={`mt-2 text-sm line-clamp-2 ${message.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                      {message.content}
                    </p>
                    {message.type === 'survey' && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">点击填写满意度评价</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredMessages.length === 0 && (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无消息</p>
            </div>
          )}
        </div>
      </div>

      {showDetail && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedMessage.title}</h2>
                  <p className="text-teal-100 mt-1">
                    {new Date(selectedMessage.createTime).toLocaleString('zh-CN')}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getTypeInfo(selectedMessage.type).color}`}>
                  {(() => {
                    const Icon = getTypeInfo(selectedMessage.type).icon;
                    return <Icon className="w-4 h-4" />;
                  })()}
                  {getTypeInfo(selectedMessage.type).text}
                </span>
                {selectedMessage.isRead && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    <Check className="w-4 h-4" />
                    已读
                  </span>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
              </div>

              {selectedMessage.type === 'survey' && !showSurvey && (
                <div className="bg-orange-50 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-800">满意度调查</p>
                        <p className="text-sm text-orange-600">您的评价对我们很重要</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSurvey(true)}
                      className="px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                    >
                      去评价
                    </button>
                  </div>
                </div>
              )}

              {showSurvey && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">满意度评价</h3>
                  <div className="mb-5">
                    <p className="text-sm text-gray-600 mb-3">服务评分</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <p className="text-sm text-gray-600 mb-3">评价内容（选填）</p>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="请分享您的使用体验和建议..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSurvey(false)}
                      className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSubmitSurvey}
                      className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      提交评价
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  关闭
                </button>
                {selectedMessage.hasReadReceipt && (
                  <button className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    发送回执
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
