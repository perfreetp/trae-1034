import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  ClipboardList,
  MapPin,
  Clock,
  User,
  CheckCircle,
  PlayCircle,
  Camera,
  Navigation,
  Filter,
  ChevronDown,
  X,
  Image,
  Check
} from 'lucide-react';

export default function Tasks() {
  const { tasks, updateTaskStatus } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    return filterStatus === 'all' || t.status === filterStatus;
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { text: '待开始', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };
      case 'in_progress': return { text: '进行中', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' };
      case 'completed': return { text: '已完成', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
      default: return { text: '未知', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };
    }
  };

  const handleCheckIn = (taskId: string) => {
    const now = new Date().toISOString();
    updateTaskStatus(taskId, 'in_progress', now);
    setShowCheckIn(false);
  };

  const handleCheckOut = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const now = new Date().toISOString();
      updateTaskStatus(taskId, 'completed', task.checkInTime, now);
    }
    setShowDetail(false);
  };

  const openDetail = (task: typeof tasks[0]) => {
    setSelectedTask(task);
    setShowDetail(true);
  };

  const pendingTasks = filteredTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">上门任务</h1>
          <p className="text-gray-500 mt-1">管理护理员的上门服务任务和签到</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">全部状态</option>
              <option value="pending">待开始</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">待开始</h3>
            <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
              {pendingTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task) => {
              const statusInfo = getStatusInfo(task.status);
              return (
                <div
                  key={task.id}
                  onClick={() => openDetail(task)}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors border-l-4 border-gray-400"
                >
                  <div className="flex items-start gap-3">
                    <img src={task.elderlyAvatar} alt={task.elderlyName} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{task.elderlyName}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.scheduledTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {task.elderlyAddress.slice(0, 15)}...
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">进行中</h3>
            <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600">
              {inProgressTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.map((task) => {
              return (
                <div
                  key={task.id}
                  onClick={() => openDetail(task)}
                  className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 cursor-pointer transition-colors border-l-4 border-orange-500"
                >
                  <div className="flex items-start gap-3">
                    <img src={task.elderlyAvatar} alt={task.elderlyName} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{task.elderlyName}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        签到时间: {task.checkInTime && new Date(task.checkInTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        护理员: {task.careWorkerName}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">已完成</h3>
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {completedTasks.map((task) => {
              return (
                <div
                  key={task.id}
                  onClick={() => openDetail(task)}
                  className="p-4 bg-green-50 rounded-xl hover:bg-green-100 cursor-pointer transition-colors border-l-4 border-green-500"
                >
                  <div className="flex items-start gap-3">
                    <img src={task.elderlyAvatar} alt={task.elderlyName} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{task.elderlyName}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        完成时间: {task.checkOutTime && new Date(task.checkOutTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        服务照片: {task.photos.length}张
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">任务列表</h3>
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            return (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${statusInfo.dot}`} />
                <img src={task.elderlyAvatar} alt={task.elderlyName} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800">{task.elderlyName}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {task.elderlyAddress}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.serviceItems.slice(0, 3).map((item) => (
                      <span key={item} className="text-xs px-2 py-1 bg-white rounded-lg text-gray-600 border border-gray-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(task.scheduledTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-gray-500">护理员: {task.careWorkerName}</p>
                </div>
                <div className="flex gap-2">
                  {task.status === 'pending' && (
                    <>
                      <button
                        onClick={() => { setSelectedTask(task); setShowCheckIn(true); }}
                        className="flex items-center gap-1 px-4 py-2 bg-teal-600 text-white text-sm rounded-xl hover:bg-teal-700 transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                        签到
                      </button>
                      <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors">
                        <MapPin className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {task.status === 'in_progress' && (
                    <button
                      onClick={() => handleCheckOut(task.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      完成服务
                    </button>
                  )}
                  {task.status === 'completed' && (
                    <button
                      onClick={() => openDetail(task)}
                      className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      查看
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCheckIn && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">到场签到</h2>
              <button onClick={() => setShowCheckIn(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{selectedTask.elderlyName}</h3>
                <p className="text-gray-500 mt-1">{selectedTask.elderlyAddress}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">GPS定位</p>
                    <p className="font-medium text-gray-800">已定位到服务地点</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">当前时间</p>
                    <p className="font-medium text-gray-800">{new Date().toLocaleString('zh-CN')}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckIn(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={() => handleCheckIn(selectedTask.id)}
                  className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium"
                >
                  确认签到
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetail && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedTask.elderlyAvatar} alt={selectedTask.elderlyName} className="w-16 h-16 rounded-2xl object-cover border-4 border-white/30" />
                  <div>
                    <h2 className="text-xl font-bold">{selectedTask.elderlyName}</h2>
                    <p className="text-teal-100 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedTask.elderlyAddress}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">护理员</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedTask.careWorkerName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">预约时间</p>
                  <p className="font-medium text-gray-800 mt-1">
                    {new Date(selectedTask.scheduledTime).toLocaleString('zh-CN')}
                  </p>
                </div>
                {selectedTask.checkInTime && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">签到时间</p>
                    <p className="font-medium text-green-700 mt-1">
                      {new Date(selectedTask.checkInTime).toLocaleString('zh-CN')}
                    </p>
                  </div>
                )}
                {selectedTask.checkOutTime && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">签退时间</p>
                    <p className="font-medium text-blue-700 mt-1">
                      {new Date(selectedTask.checkOutTime).toLocaleString('zh-CN')}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">服务项目</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.serviceItems.map((item) => (
                    <span key={item} className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-sm font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {selectedTask.photos.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-teal-600" />
                    服务照片
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedTask.photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`服务照片${index + 1}`} className="w-full aspect-square object-cover rounded-xl" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
