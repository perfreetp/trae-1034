import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Heart,
  Activity,
  Plus,
  Search,
  AlertTriangle,
  Pill,
  Clock,
  X,
  ChevronDown,
  TrendingUp,
  Droplets,
  Thermometer
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Health() {
  const { healthRecords, medications, elderly, addHealthRecord } = useStore();
  const [selectedElderlyId, setSelectedElderlyId] = useState<string>('e001');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    bloodSugar: '',
    heartRate: '',
    temperature: '',
    notes: ''
  });

  const selectedElderly = elderly.find((e) => e.id === selectedElderlyId);
  const elderlyRecords = healthRecords.filter((r) => r.elderlyId === selectedElderlyId);
  const elderlyMedications = medications.filter((m) => m.elderlyId === selectedElderlyId);

  const chartData = elderlyRecords.slice(-7).map((r) => ({
    date: new Date(r.recordTime).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    收缩压: r.bloodPressureSystolic,
    舒张压: r.bloodPressureDiastolic,
    血糖: r.bloodSugar,
    心率: r.heartRate
  }));

  const latestRecord = elderlyRecords[0];
  const abnormalCount = elderlyRecords.filter((r) => r.isAbnormal).length;

  const handleAddRecord = () => {
    const systolic = parseInt(newRecord.bloodPressureSystolic);
    const diastolic = parseInt(newRecord.bloodPressureDiastolic);
    const sugar = parseFloat(newRecord.bloodSugar);
    const isAbnormal = systolic > 140 || diastolic > 90 || sugar > 7.8;

    const record = {
      id: `h${Date.now()}`,
      elderlyId: selectedElderlyId,
      recordTime: new Date().toISOString(),
      bloodPressureSystolic: systolic || undefined,
      bloodPressureDiastolic: diastolic || undefined,
      bloodSugar: sugar || undefined,
      heartRate: parseInt(newRecord.heartRate) || undefined,
      temperature: parseFloat(newRecord.temperature) || undefined,
      notes: newRecord.notes,
      recordedBy: '系统管理员',
      isAbnormal
    };

    addHealthRecord(record);
    setShowAddModal(false);
    setNewRecord({
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      bloodSugar: '',
      heartRate: '',
      temperature: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">健康记录</h1>
          <p className="text-gray-500 mt-1">查看和管理老人的健康数据和用药情况</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          录入数据
        </button>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedElderlyId}
                onChange={(e) => setSelectedElderlyId(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
              >
                {elderly.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {selectedElderly && (
              <div className="flex items-center gap-3">
                <img src={selectedElderly.avatar} alt={selectedElderly.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-gray-800">{selectedElderly.name}</p>
                  <p className="text-xs text-gray-500">{selectedElderly.age}岁 · {selectedElderly.chronicDiseases.join('、')}</p>
                </div>
              </div>
            )}
          </div>
          {abnormalCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">近期有 {abnormalCount} 条异常记录</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">血压</span>
            </div>
            {latestRecord?.bloodPressureSystolic && latestRecord?.bloodPressureDiastolic ? (
              <>
                <p className="text-2xl font-bold text-gray-800">
                  {latestRecord.bloodPressureSystolic}/{latestRecord.bloodPressureDiastolic}
                </p>
                <p className="text-xs text-gray-500">mmHg</p>
              </>
            ) : (
              <p className="text-gray-400">暂无数据</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">血糖</span>
            </div>
            {latestRecord?.bloodSugar ? (
              <>
                <p className="text-2xl font-bold text-gray-800">{latestRecord.bloodSugar}</p>
                <p className="text-xs text-gray-500">mmol/L</p>
              </>
            ) : (
              <p className="text-gray-400">暂无数据</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">心率</span>
            </div>
            {latestRecord?.heartRate ? (
              <>
                <p className="text-2xl font-bold text-gray-800">{latestRecord.heartRate}</p>
                <p className="text-xs text-gray-500">次/分钟</p>
              </>
            ) : (
              <p className="text-gray-400">暂无数据</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">体温</span>
            </div>
            {latestRecord?.temperature ? (
              <>
                <p className="text-2xl font-bold text-gray-800">{latestRecord.temperature}</p>
                <p className="text-xs text-gray-500">°C</p>
              </>
            ) : (
              <p className="text-gray-400">暂无数据</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            健康趋势
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="收缩压" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="舒张压" stroke="#F97316" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="血糖" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="心率" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            用药提醒
          </h3>
          <div className="space-y-3">
            {elderlyMedications.length > 0 ? elderlyMedications.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${med.isActive ? 'bg-teal-100' : 'bg-gray-200'}`}>
                    <Pill className={`w-6 h-6 ${med.isActive ? 'text-teal-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{med.name}</p>
                    <p className="text-sm text-gray-500">{med.dosage} · {med.frequency}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{med.times.join('、')}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${med.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {med.isActive ? '服用中' : '已停用'}
                </span>
              </div>
            )) : (
              <p className="text-gray-400 text-center py-8">暂无用药记录</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            历史记录
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {elderlyRecords.length > 0 ? elderlyRecords.map((record) => (
              <div key={record.id} className={`p-4 rounded-xl border ${record.isAbnormal ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {record.isAbnormal ? (
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <Heart className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(record.recordTime).toLocaleString('zh-CN')}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">记录人: {record.recordedBy}</p>
                    </div>
                  </div>
                  {record.isAbnormal && (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                      异常
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  {record.bloodPressureSystolic && (
                    <span className="text-xs text-gray-600">
                      血压: <span className="font-medium">{record.bloodPressureSystolic}/{record.bloodPressureDiastolic} mmHg</span>
                    </span>
                  )}
                  {record.bloodSugar && (
                    <span className="text-xs text-gray-600">
                      血糖: <span className="font-medium">{record.bloodSugar} mmol/L</span>
                    </span>
                  )}
                  {record.heartRate && (
                    <span className="text-xs text-gray-600">
                      心率: <span className="font-medium">{record.heartRate} 次/分</span>
                    </span>
                  )}
                </div>
                {record.notes && (
                  <p className="text-xs text-gray-500 mt-2">备注: {record.notes}</p>
                )}
              </div>
            )) : (
              <p className="text-gray-400 text-center py-8">暂无健康记录</p>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">录入健康数据</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">收缩压 (mmHg)</label>
                  <input
                    type="number"
                    value={newRecord.bloodPressureSystolic}
                    onChange={(e) => setNewRecord({ ...newRecord, bloodPressureSystolic: e.target.value })}
                    placeholder="如: 120"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">舒张压 (mmHg)</label>
                  <input
                    type="number"
                    value={newRecord.bloodPressureDiastolic}
                    onChange={(e) => setNewRecord({ ...newRecord, bloodPressureDiastolic: e.target.value })}
                    placeholder="如: 80"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">血糖 (mmol/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRecord.bloodSugar}
                    onChange={(e) => setNewRecord({ ...newRecord, bloodSugar: e.target.value })}
                    placeholder="如: 6.5"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">心率 (次/分)</label>
                  <input
                    type="number"
                    value={newRecord.heartRate}
                    onChange={(e) => setNewRecord({ ...newRecord, heartRate: e.target.value })}
                    placeholder="如: 75"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">体温 (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newRecord.temperature}
                  onChange={(e) => setNewRecord({ ...newRecord, temperature: e.target.value })}
                  placeholder="如: 36.5"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <textarea
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  placeholder="填写异常情况或其他说明..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
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
                确认录入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
