import { NavLink, useLocation } from 'react-router-dom';
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
import { useState } from 'react';

const navItems = [
  { path: '/', label: '运营看板', icon: LayoutDashboard },
  { path: '/elderly', label: '老人档案', icon: Users },
  { path: '/appointments', label: '服务预约', icon: CalendarClock },
  { path: '/tasks', label: '上门任务', icon: ClipboardList },
  { path: '/health', label: '健康记录', icon: Heart },
  { path: '/contacts', label: '紧急联系人', icon: Phone },
  { path: '/finance', label: '费用补贴', icon: Wallet },
  { path: '/messages', label: '家属消息', icon: MessageSquare }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
          {navItems.map((item) => {
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
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">管</span>
              </div>
              <div>
                <p className="font-medium text-sm">街道管理员</p>
                <p className="text-xs text-teal-200">admin@elderly.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
