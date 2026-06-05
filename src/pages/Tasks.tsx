import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  ClipboardList,
  MapPin,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Camera,
  Navigation,
  ChevronDown,
  Search,
  Phone,
  Image
} from 'lucide-react';
import type { Task } from '@/types';

export default function Tasks() {
  const { tasks, careWorkers, currentRole, currentWorker, updateTaskStatus, elderly } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    let matchRole = true;
    if (currentRole === 'worker' && currentWorker) {
      matchRole = task.careWorkerId === currentWorker.id;
    }
    const matchSearch = task.elderlyName.includes(searchQuery) || task.serviceItems.some(s => s.includes(searchQuery));
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchRole && matchSearch && matchStatus;
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { text: '待执行', color: 'bg-orange-100 text-orange-700' };
      case 'in_progress': return { text: '进行中', color: 'bg-blue-100 text-blue-700' };
      case 'completed': return { text: '已完成', color: 'bg-green-100 text-green-700' };
      case 'cancelled': return { text: '已取消', color: 'bg-gray-100 text-gray-700' };
      default: return { text: '未知', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetail(true);
  };

  const handleCheckIn = (taskId: string) => {
    updateTaskStatus(taskId, 'in_progress', new Date().toISOString());
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, status: 'in_progress', checkInTime: new Date().toISOString() });
    }
  };

  const handleCheckOut = (taskId: string) => {
    updateTaskStatus(taskId, 'completed', undefined, new Date().toISOString());
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, status: 'completed', checkOutTime: new Date().toISOString() });
    }
  };

  const canCheckIn = (task: Task) => task.status === 'pending';
  const canCheckOut = (task: Task) => task.status === 'in_progress';

  const canManage = currentRole === 'admin';
  const canOperate = currentRole === 'admin' || currentRole === 'worker';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">上门任务</h1>
          <p className="text-gray-500 mt-1">查看和管理护理员上门服务任务</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索老人姓名、服务项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">全部状态</option>
                <option value="pending">待执行</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            return (
              <div
                key={task.id}
                className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer hover:border-teal-200"
                onClick={() => openDetail(task)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{task.elderlyName}</h3>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Navigation className="w-5 h-5 text-teal-600" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{task.elderlyAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{task.scheduledTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{task.careWorkerName}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {task.serviceItems.slice(0, 3).map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-lg">
                      {item}
                    </span>
                  ))}
                  {task.serviceItems.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      +{task.serviceItems.length - 3}
                    </span>
                  )}
                </div>

                {canOperate && (
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    {canCheckIn(task) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCheckIn(task.id); }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        签到
                      </button>
                    )}
                    {canCheckOut(task) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCheckOut(task.id); }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        完成
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); openDetail(task); }}
                      className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      详情
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无任务数据</p>
          </div>
        )}
      </div>

      {showDetail && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">任务详情</h2>
                  <p className="text-teal-100 mt-1">{selectedTask.elderlyName}</p>
                </div>
                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">护理员</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedTask.careWorkerName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">服务时间</p>
                  <p className="font-semibold text-gray-800 mt-1">{selectedTask.scheduledTime}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">服务地址</p>
                <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-4">
                  <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{selectedTask.elderlyAddress}</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">服务项目</p>
                <div className="space-y-2">
                  {selectedTask.serviceItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-teal-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">签到时间</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedTask.checkInTime ? new Date(selectedTask.checkInTime).toLocaleString('zh-CN') : '未签到'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">完成时间</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedTask.checkOutTime ? new Date(selectedTask.checkOutTime).toLocaleString('zh-CN') : '未完成'}
                  </p>
                </div>
              </div>

              {selectedTask.photos.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">服务照片</p>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedTask.photos.map((photo, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                        <Image className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {canOperate && (
                <div className="flex gap-3">
                  {canCheckIn(selectedTask) && (
                    <button
                      onClick={() => handleCheckIn(selectedTask.id)}
                      className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      签到开始
                    </button>
                  )}
                  {canCheckOut(selectedTask) && (
                    <button
                      onClick={() => handleCheckOut(selectedTask.id)}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      完成服务
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetail(false)}
                    className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    关闭
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
