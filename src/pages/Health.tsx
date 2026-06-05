import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Heart,
  Search,
  ChevronDown,
  Plus,
  X,
  AlertTriangle,
  TrendingUp,
  Activity,
  Thermometer,
  Droplets,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { HealthRecord } from '@/types';

export default function Health() {
  const { healthRecords, elderly, currentRole, currentFamily, currentWorker, tasks, addHealthRecord } = useStore();
  const [selectedElderlyId, setSelectedElderlyId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    bloodSugar: 5.6,
    heartRate: 72,
    temperature: 36.5,
    notes: ''
  });

  const filteredElderly = elderly.filter(e => {
    let matchRole = true;
    if (currentRole === 'family' && currentFamily) {
      matchRole = currentFamily.authorizedElderlyIds.includes(e.id);
    } else if (currentRole === 'worker' && currentWorker) {
      const myTaskElderIds = [...new Set(tasks.filter(t => t.careWorkerId === currentWorker.id).map(t => t.elderlyId))];
      matchRole = myTaskElderIds.includes(e.id);
    }
    const matchSearch = e.name.includes(searchQuery);
    return matchRole && matchSearch;
  });

  const selectedElderly = elderly.find(e => e.id === selectedElderlyId) || filteredElderly[0];

  const filteredRecords = healthRecords.filter(r =>
    selectedElderly ? r.elderlyId === selectedElderly.id : false
  ).sort((a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime());

  const chartData = filteredRecords.slice(0, 7).reverse().map(r => ({
    date: new Date(r.recordTime).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    收缩压: r.bloodPressureSystolic,
    舒张压: r.bloodPressureDiastolic,
    血糖: r.bloodSugar
  }));

  const latestRecord = filteredRecords[0];

  const canAddRecord = currentRole === 'admin' || currentRole === 'worker';

  const handleAddRecord = () => {
    if (!selectedElderly) return;

    const isAbnormal =
      newRecord.bloodPressureSystolic > 140 ||
      newRecord.bloodPressureDiastolic > 90 ||
      newRecord.bloodSugar > 7.8 ||
      newRecord.heartRate > 100 ||
      newRecord.temperature > 37.3;

    const record: HealthRecord = {
      id: `h${Date.now()}`,
      elderlyId: selectedElderly.id,
      recordTime: new Date().toISOString(),
      bloodPressureSystolic: newRecord.bloodPressureSystolic,
      bloodPressureDiastolic: newRecord.bloodPressureDiastolic,
      bloodSugar: newRecord.bloodSugar,
      heartRate: newRecord.heartRate,
      temperature: newRecord.temperature,
      recordedBy: currentRole === 'admin' ? '管理员' : '护理员',
      isAbnormal,
      notes: newRecord.notes
    };

    addHealthRecord(record);
    setShowAddModal(false);
    setNewRecord({
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      bloodSugar: 5.6,
      heartRate: 72,
      temperature: 36.5,
      notes: ''
    });
  };

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) return { text: '偏高', color: 'text-red-600 bg-red-50' };
    if (systolic >= 120 || diastolic >= 80) return { text: '正常高值', color: 'text-orange-600 bg-orange-50' };
    return { text: '正常', color: 'text-green-600 bg-green-50' };
  };

  const getBloodSugarStatus = (sugar: number) => {
    if (sugar >= 7.8) return { text: '偏高', color: 'text-red-600 bg-red-50' };
    if (sugar >= 6.1) return { text: '正常高值', color: 'text-orange-600 bg-orange-50' };
    return { text: '正常', color: 'text-green-600 bg-green-50' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">健康记录</h1>
          <p className="text-gray-500 mt-1">查看和管理老人健康数据</p>
        </div>
        {canAddRecord && selectedElderly && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            录入健康数据
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="w-64 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-fit">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索老人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="space-y-2">
            {filteredElderly.map((e) => (
              <div
                key={e.id}
                onClick={() => setSelectedElderlyId(e.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  (selectedElderly?.id || filteredElderly[0]?.id) === e.id
                    ? 'bg-teal-50 border border-teal-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium text-sm">
                  {e.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{e.name}</p>
                  <p className="text-xs text-gray-500">{e.age}岁</p>
                </div>
                {e.riskTags.length > 0 && (
                  <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {selectedElderly ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <Activity className="w-5 h-5 text-teal-600" />
                    {latestRecord && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBloodPressureStatus(latestRecord.bloodPressureSystolic, latestRecord.bloodPressureDiastolic).color}`}>
                        {getBloodPressureStatus(latestRecord.bloodPressureSystolic, latestRecord.bloodPressureDiastolic).text}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {latestRecord ? `${latestRecord.bloodPressureSystolic}/${latestRecord.bloodPressureDiastolic}` : '--/--'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">血压 (mmHg)</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    {latestRecord && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBloodSugarStatus(latestRecord.bloodSugar).color}`}>
                        {getBloodSugarStatus(latestRecord.bloodSugar).text}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {latestRecord ? latestRecord.bloodSugar : '--'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">血糖 (mmol/L)</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {latestRecord ? latestRecord.heartRate : '--'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">心率 (次/分)</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {latestRecord ? latestRecord.temperature : '--'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">体温 (°C)</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800">健康趋势</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    近7天
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="收缩压" stroke="#2DD4BF" strokeWidth={2} dot={{ fill: '#2DD4BF' }} />
                      <Line type="monotone" dataKey="舒张压" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA' }} />
                      <Line type="monotone" dataKey="血糖" stroke="#FB923C" strokeWidth={2} dot={{ fill: '#FB923C' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">历史记录</h3>
                <div className="space-y-3">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className={`p-4 rounded-xl border ${
                        record.isAbnormal ? 'border-red-200 bg-red-50/50' : 'border-gray-100 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {new Date(record.recordTime).toLocaleString('zh-CN')}
                          </span>
                          <span className="text-sm text-gray-400">|</span>
                          <span className="text-sm text-gray-500">录入人: {record.recordedBy}</span>
                        </div>
                        {record.isAbnormal && (
                          <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            异常
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">血压</p>
                          <p className="font-medium text-gray-800">
                            {record.bloodPressureSystolic}/{record.bloodPressureDiastolic} mmHg
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">血糖</p>
                          <p className="font-medium text-gray-800">{record.bloodSugar} mmol/L</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">心率</p>
                          <p className="font-medium text-gray-800">{record.heartRate} 次/分</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">体温</p>
                          <p className="font-medium text-gray-800">{record.temperature} °C</p>
                        </div>
                      </div>
                      {record.notes && (
                        <p className="mt-2 text-sm text-gray-600 bg-white rounded-lg p-2">
                          备注: {record.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">请选择一位老人查看健康记录</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">录入健康数据</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-teal-100 mt-1">为 {selectedElderly?.name} 录入</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">收缩压 (mmHg)</label>
                  <input
                    type="number"
                    value={newRecord.bloodPressureSystolic}
                    onChange={(e) => setNewRecord({ ...newRecord, bloodPressureSystolic: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">舒张压 (mmHg)</label>
                  <input
                    type="number"
                    value={newRecord.bloodPressureDiastolic}
                    onChange={(e) => setNewRecord({ ...newRecord, bloodPressureDiastolic: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">血糖 (mmol/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.bloodSugar}
                    onChange={(e) => setNewRecord({ ...newRecord, bloodSugar: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">心率 (次/分)</label>
                  <input
                    type="number"
                    value={newRecord.heartRate}
                    onChange={(e) => setNewRecord({ ...newRecord, heartRate: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">体温 (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.temperature}
                    onChange={(e) => setNewRecord({ ...newRecord, temperature: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  placeholder="输入备注信息..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleAddRecord}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium"
              >
                保存记录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
