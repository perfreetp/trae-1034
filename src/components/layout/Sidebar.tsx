import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  ClipboardList,
  Heart,
  Phone,
  Wallet,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

type Role = 'admin' | 'worker' | 'family';

const allNavItems = [
  { path: '/', label: '运营看板', icon: LayoutDashboard, roles: ['admin'] as Role[] },
  { path: '/elderly', label: '老人档案', icon: Users, roles: ['admin', 'family'] as Role[] },
  { path: '/appointments', label: '服务预约', icon: CalendarClock, roles: ['admin'] as Role[] },
  { path: '/tasks', label: '上门任务', icon: ClipboardList, roles: ['admin', 'worker'] as Role[] },
  { path: '/health', label: '健康记录', icon: Heart, roles: ['admin', 'worker'] as Role[] },
  { path: '/contacts', label: '紧急联系人', icon: Phone, roles: ['admin'] as Role[] },
  { path: '/finance', label: '费用补贴', icon: Wallet, roles: ['admin', 'family'] as Role[] },
  { path: '/messages', label: '家属消息', icon: MessageSquare, roles: ['admin', 'family'] as Role[] }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, currentWorker, currentFamily } = useStore();

  const filteredNavItems = allNavItems.filter(item =>
    item.roles.includes(currentRole as Role)
  );

  const getCurrentUserInfo = () => {
    if (currentRole === 'admin') {
      return { name: '街道管理员', email: 'admin@elderly.com', icon: '管', color: 'bg-orange-400' };
    } else if (currentRole === 'worker' && currentWorker) {
      return { name: currentWorker.name, email: currentWorker.phone || 'worker@elderly.com', icon: '护', color: 'bg-teal-400' };
    } else if (currentRole === 'family' && currentFamily) {
      return { name: currentFamily.name, email: currentFamily.phone || 'family@elderly.com', icon: '家', color: 'bg-blue-400' };
    }
    return { name: '用户', email: '', icon: '用', color: 'bg-gray-400' };
  };

  const userInfo = getCurrentUserInfo();

  useEffect(() => {
    const visiblePaths = filteredNavItems.map(item => item.path);
    if (!visiblePaths.includes(location.pathname) && visiblePaths.length > 0) {
      navigate(visiblePaths[0]);
    }
  }, [currentRole, location.pathname, filteredNavItems, navigate]);

  return (
    <div className={`relative h-screen bg-gradient-to-b from-teal-700 to-teal-800 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col shadow-xl`}>
      <div className="flex items-center justify-between p-4 border-b border-teal-600">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg">养老服务</h1>
              <p className="text-xs text-teal-200">社区协同平台</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 text-teal-600" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-teal-600 rounded-lg transition-colors"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-teal-700 shadow-lg'
                      : 'text-teal-100 hover:bg-teal-600/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-teal-600' : ''}`} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-teal-600">
        {!collapsed && (
          <div className="bg-teal-600/50 rounded-xl p-4">
            <p className="text-sm text-teal-100 mb-2">当前角色</p>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${userInfo.color} rounded-full flex items-center justify-center`}>
                <span className="text-sm font-bold">{userInfo.icon}</span>
              </div>
              <div>
                <p className="font-medium text-sm">{userInfo.name}</p>
                <p className="text-xs text-teal-200">{userInfo.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
