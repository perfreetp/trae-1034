import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  CalendarClock,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Clock,
  User,
  Package,
  CheckCircle,
  XCircle,
  Hourglass,
  X,
  Calendar,
  Phone,
  MapPin
} from 'lucide-react';

export default function Appointments() {
  const { appointments, servicePackages, elderly, careWorkers, addAppointment } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    elderlyId: '',
    servicePackageId: '',
    scheduledTime: '',
    notes: ''
  });

  const filteredAppointments = appointments.filter((a) => {
    const matchSearch = a.elderlyName.includes(searchQuery) || a.servicePackageName.includes(searchQuery);
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { text: '待确认', icon: Hourglass, color: 'bg-orange-100 text-orange-700', iconColor: 'text-orange-500' };
      case 'confirmed': return { text: '已确认', icon: CheckCircle, color: 'bg-blue-100 text-blue-700', iconColor: 'text-blue-500' };
      case 'completed': return { text: '已完成', icon: CheckCircle, color: 'bg-green-100 text-green-700', iconColor: 'text-green-500' };
      case 'cancelled': return { text: '已取消', icon: XCircle, color: 'bg-gray-100 text-gray-700', iconColor: 'text-gray-500' };
      default: return { text: '未知', icon: Hourglass, color: 'bg-gray-100 text-gray-700', iconColor: 'text-gray-500' };
    }
  };

  const handleSubmit = () => {
    if (!newAppointment.elderlyId || !newAppointment.servicePackageId || !newAppointment.scheduledTime) return;
    
    const selectedElderly = elderly.find((e) => e.id === newAppointment.elderlyId);
    const selectedPackage = servicePackages.find((p) => p.id === newAppointment.servicePackageId);
    
    if (!selectedElderly || !selectedPackage) return;

    const appointment = {
      id: `a${Date.now()}`,
      elderlyId: newAppointment.elderlyId,
      elderlyName: selectedElderly.name,
      servicePackageId: newAppointment.servicePackageId,
      servicePackageName: selectedPackage.name,
      scheduledTime: newAppointment.scheduledTime,
      status: 'pending' as const,
      createTime: new Date().toISOString(),
      notes: newAppointment.notes
    };
    
    addAppointment(appointment);
    setShowNewModal(false);
    setNewAppointment({ elderlyId: '', servicePackageId: '', scheduledTime: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">服务预约</h1>
          <p className="text-gray-500 mt-1">管理老人的服务预约和套餐选择</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          新建预约
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {servicePackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-500">{pkg.duration}</span>
            </div>
            <h3 className="font-semibold text-gray-800">{pkg.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pkg.description}</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-teal-600">¥{pkg.subsidyPrice}</span>
              <span className="text-sm text-gray-400 line-through">¥{pkg.price}</span>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">补贴</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {pkg.services.slice(0, 2).map((s) => (
                <span key={s} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{s}</span>
              ))}
              {pkg.services.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">+{pkg.services.length - 2}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索老人姓名、服务套餐..."
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
                <option value="pending">待确认</option>
                <option value="confirmed">已确认</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">筛选</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">老人信息</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">服务套餐</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">预约时间</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">护理员</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((a) => {
                const statusInfo = getStatusInfo(a.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-teal-600" />
                        </div>
                        <span className="font-medium text-gray-800">{a.elderlyName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700">{a.servicePackageName}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarClock className="w-4 h-4" />
                        <span className="text-sm">{new Date(a.scheduledTime).toLocaleString('zh-CN')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {a.careWorkerName ? (
                        <span className="text-gray-700">{a.careWorkerName}</span>
                      ) : (
                        <span className="text-gray-400 text-sm">待分配</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor}`} />
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {a.status === 'pending' && (
                          <>
                            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">确认</button>
                            <button className="text-red-500 hover:text-red-600 text-sm">取消</button>
                          </>
                        )}
                        {a.status === 'confirmed' && (
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">查看详情</button>
                        )}
                        {a.status === 'completed' && (
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium">服务记录</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">新建预约</h2>
              <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择老人</label>
                <select
                  value={newAppointment.elderlyId}
                  onChange={(e) => setNewAppointment({ ...newAppointment, elderlyId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">请选择老人</option>
                  {elderly.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} - {e.age}岁</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">服务套餐</label>
                <select
                  value={newAppointment.servicePackageId}
                  onChange={(e) => setNewAppointment({ ...newAppointment, servicePackageId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">请选择服务套餐</option>
                  {servicePackages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - ¥{p.subsidyPrice}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">预约时间</label>
                <input
                  type="datetime-local"
                  value={newAppointment.scheduledTime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, scheduledTime: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  placeholder="填写特殊需求或注意事项..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium"
              >
                确认预约
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
