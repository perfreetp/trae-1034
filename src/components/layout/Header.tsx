import { Bell, Search, ChevronDown, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

export function Header() {
  const { messages, currentRole, careWorkers, currentWorker, currentFamily, setCurrentRole, setCurrentWorker } = useStore();
  const unreadCount = messages.filter((m) => !m.isRead).length;
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [workerDropdownOpen, setWorkerDropdownOpen] = useState(false);

  const roles = [
    { id: 'admin', label: '街道管理员', icon: '管' },
    { id: 'worker', label: '护理员', icon: '护' },
    { id: 'family', label: '家属', icon: '家' }
  ] as const;

  const currentRoleInfo = roles.find((r) => r.id === currentRole);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索老人、护理员、预约..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentRole === 'worker' && careWorkers.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setWorkerDropdownOpen(!workerDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200"
            >
              <span className="text-sm font-medium text-teal-700">
                {currentWorker?.name || '选择护理员'}
              </span>
              <ChevronDown className="w-4 h-4 text-teal-600" />
            </button>
            {workerDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                {careWorkers.map((worker) => (
                  <button
                    key={worker.id}
                    onClick={() => {
                      setCurrentWorker(worker);
                      setWorkerDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                      currentWorker?.id === worker.id ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {worker.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <span className="text-sm block">{worker.name}</span>
                      <span className="text-xs text-gray-500">
                        {worker.status === 'on-duty' ? '在岗' : worker.status === 'busy' ? '忙碌' : '休息'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {currentRoleInfo?.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{currentRoleInfo?.label}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {roleDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setCurrentRole(role.id);
                    setRoleDropdownOpen(false);
                    setWorkerDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                    currentRole === role.id ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    currentRole === role.id ? 'bg-teal-500' : 'bg-gray-400'
                  }`}>
                    {role.icon}
                  </div>
                  <span className="text-sm">{role.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="relative p-2.5 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800">
              {currentRole === 'admin' ? '系统管理员' :
               currentRole === 'worker' ? (currentWorker?.name || '护理员') :
               (currentFamily?.name || '家属')}
            </p>
            <p className="text-xs text-gray-500">静安区养老服务中心</p>
          </div>
        </div>
      </div>
    </header>
  );
}
