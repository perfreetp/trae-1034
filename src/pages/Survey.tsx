import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Star,
  MessageSquare,
  Calendar,
  User,
  CheckCircle,
  X,
  Send,
  ClipboardList
} from 'lucide-react';
import type { Survey as SurveyType } from '@/types';

export default function Survey() {
  const { messages, elderly, currentRole, currentFamily, addSurvey, tasks } = useStore();
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const authorizedElderlyIds = currentFamily?.authorizedElderlyIds || [];

  const surveyMessages = messages.filter((m) => {
    if (m.type !== 'survey') return false;
    if (currentRole === 'family' && currentFamily) {
      return m.recipientId === currentFamily.id;
    }
    return true;
  });

  const submittedSurveys: SurveyType[] = [];

  const getElderlyName = (elderlyId: string) => {
    return elderly.find((e) => e.id === elderlyId)?.name || '未知';
  };

  const handleSubmit = () => {
    if (!selectedSurveyId) return;
    const msg = surveyMessages.find((m) => m.id === selectedSurveyId);
    if (!msg) return;

    const survey: SurveyType = {
      id: `s${Date.now()}`,
      messageId: msg.id,
      taskId: msg.relatedId || '',
      elderlyId: msg.relatedId || '',
      rating,
      comment,
      createTime: new Date().toISOString()
    };

    addSurvey(survey);
    setShowSubmitModal(false);
    setRating(5);
    setComment('');
    setSelectedSurveyId(null);
  };

  const canSubmit = currentRole === 'admin' || currentRole === 'family';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">满意度回访</h1>
        <p className="text-gray-500 mt-1">查看和提交服务满意度评价</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-teal-100 text-sm">待回访</span>
            <ClipboardList className="w-6 h-6 text-teal-200" />
          </div>
          <p className="text-2xl font-bold">{surveyMessages.length}</p>
          <p className="text-teal-200 text-sm mt-1">条服务待评价</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-orange-100 text-sm">已完成</span>
            <CheckCircle className="w-6 h-6 text-orange-200" />
          </div>
          <p className="text-2xl font-bold">{submittedSurveys.length}</p>
          <p className="text-orange-200 text-sm mt-1">条已提交评价</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-100 text-sm">平均评分</span>
            <Star className="w-6 h-6 text-blue-200 fill-blue-200" />
          </div>
          <p className="text-2xl font-bold">4.8</p>
          <p className="text-blue-200 text-sm mt-1">综合满意度</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">待回访服务</h2>
        <div className="space-y-4">
          {surveyMessages.length > 0 ? surveyMessages.map((msg) => {
            const isSubmitted = submittedSurveys.some((s) => s.messageId === msg.id);
            return (
              <div
                key={msg.id}
                className={`p-5 rounded-xl border transition-all ${
                  isSubmitted
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-gray-100 hover:border-teal-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{msg.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{msg.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(msg.createTime).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {getElderlyName(msg.relatedId || '')}
                      </span>
                    </div>
                  </div>
                  {canSubmit && !isSubmitted && (
                    <button
                      onClick={() => {
                        setSelectedSurveyId(msg.id);
                        setShowSubmitModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium"
                    >
                      <Star className="w-4 h-4" />
                      评价
                    </button>
                  )}
                  {isSubmitted && (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      已评价
                    </span>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无待回访的服务</p>
              {currentRole === 'family' && (
                <p className="text-sm text-gray-400 mt-1">完成服务后会自动生成回访邀请</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">提交满意度评价</h2>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedSurveyId(null);
                  setRating(5);
                  setComment('');
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">服务评分</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
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
                  <span className="ml-3 text-lg font-semibold text-gray-700">
                    {rating} 分
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">评价内容</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="请输入您的评价和建议..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedSurveyId(null);
                  setRating(5);
                  setComment('');
                }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                提交评价
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
