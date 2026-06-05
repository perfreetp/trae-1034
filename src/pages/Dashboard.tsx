import { useStore } from '@/store/useStore';
import {
  Users,
  UserCheck,
  ClipboardList,
  CheckCircle2,
  CalendarClock,
  AlertTriangle,
  TrendingUp,
  Star,
  Cake,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { monthlyServiceData, serviceTypeData } from '@/data/mockData';

const COLORS = ['#14B8A6', '#FB923C', '#60A5FA', '#A78BFA', '#F87171'];

const statCards = [
  { key: 'totalElderly', label: '服务老人总数', icon: Users, color: 'from-teal-400 to-teal-600', suffix: '人' },
  { key: 'activeCareWorkers', label: '在岗护理员', icon: UserCheck, color: 'from-blue-400 to-blue-600', suffix: '人' },
  { key: 'todayTasks', label: '今日任务数', icon: ClipboardList, color: 'from-orange-400 to-orange-600', suffix: '个' },
  { key: 'completedTasks', label: '已完成任务', icon: CheckCircle2, color: 'from-green-400 to-green-600', suffix: '个' },
  { key: 'pendingAppointments', label: '待处理预约', icon: CalendarClock, color: 'from-purple-400 to-purple-600', suffix: '个' },
  { key: 'highRiskElderly', label: '高风险老人', icon: AlertTriangle, color: 'from-red-400 to-red-600', suffix: '人' },
  { key: 'monthlyRevenue', label: '本月营收', icon: TrendingUp, color: 'from-cyan-400 to-cyan-600', suffix: '元', prefix: '¥' },
  { key: 'satisfactionRate', label: '满意度', icon: Star, color: 'from-yellow-400 to-yellow-600', suffix: '%' }
];

export default function Dashboard() {
  const { dashboardStats, elderly, tasks, messages } = useStore();

  const upcomingBirthdays = elderly.filter((e) => {
    const birthDate = new Date(e.birthDate);
    const today = new Date();
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const diffDays = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }).slice(0, 5);

  const recentTasks = tasks.slice(0, 5);
  const unreadMessages = messages.filter((m) => !m.isRead).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">运营看板</h1>
          <p className="text-gray-500 mt-1">欢迎回来，今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = dashboardStats[card.key as keyof typeof dashboardStats];
          return (
            <div key={card.key} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {card.prefix}{value.toLocaleString()}{card.suffix}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">服务趋势</h2>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>近6个月</option>
              <option>近12个月</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyServiceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line type="monotone" dataKey="服务人次" stroke="#14B8A6" strokeWidth={3} dot={{ fill: '#14B8A6', r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="新增老人" stroke="#FB923C" strokeWidth={3} dot={{ fill: '#FB923C', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">服务类型分布</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={serviceTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {serviceTypeData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Cake className="w-5 h-5 text-orange-500" />
              近期生日
            </h2>
          </div>
          <div className="space-y-3">
            {upcomingBirthdays.length > 0 ? upcomingBirthdays.map((e) => {
              const birthDate = new Date(e.birthDate);
              const today = new Date();
              const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
              const diffDays = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={e.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-transparent rounded-xl">
                  <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{e.name}</p>
                    <p className="text-xs text-gray-500">
                      {birthDate.getMonth() + 1}月{birthDate.getDate()}日 · {e.age}岁
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    diffDays === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {diffDays === 0 ? '今天' : `${diffDays}天后`}
                  </span>
                </div>
              );
            }) : (
              <p className="text-gray-400 text-center py-4">近期无生日</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-500" />
              最新任务
            </h2>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'completed' ? 'bg-green-500' :
                  task.status === 'in_progress' ? 'bg-orange-500' : 'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{task.elderlyName}</p>
                  <p className="text-xs text-gray-500 truncate">{task.serviceItems[0]}...</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.status === 'completed' ? 'bg-green-100 text-green-600' :
                  task.status === 'in_progress' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待开始'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              风险提醒
            </h2>
          </div>
          <div className="space-y-3">
            {unreadMessages.filter((m) => m.type === 'emergency' || m.type === 'system').map((msg) => (
              <div key={msg.id} className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{msg.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.createTime).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {unreadMessages.filter((m) => m.type === 'emergency' || m.type === 'system').length === 0 && (
              <p className="text-gray-400 text-center py-4">暂无风险提醒</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
