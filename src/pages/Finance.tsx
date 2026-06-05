import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import {
  Wallet,
  Search,
  ChevronDown,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  X,
  Download,
  DollarSign,
  TrendingUp,
  Receipt,
  Plus,
  Check,
  Calendar
} from 'lucide-react';
import type { Bill, BillItem, Appointment } from '@/types';

export default function Finance() {
  const { bills, elderly, servicePackages, appointments, updateBillStatus, addBill, currentRole } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    elderlyId: '',
    month: new Date().toISOString().slice(0, 7),
    selectedAppointmentIds: [] as string[]
  });

  const canManage = currentRole === 'admin';

  const filteredBills = bills.filter((b) => {
    const matchSearch = b.elderlyName.includes(searchQuery);
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalAmount = filteredBills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalSubsidy = filteredBills.reduce((sum, b) => sum + b.subsidyAmount, 0);
  const totalActual = filteredBills.reduce((sum, b) => sum + b.actualAmount, 0);
  const unpaidCount = filteredBills.filter((b) => b.status === 'unpaid').length;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'paid': return { text: '已支付', color: 'bg-green-100 text-green-700', icon: CheckCircle };
      case 'unpaid': return { text: '待支付', color: 'bg-orange-100 text-orange-700', icon: Clock };
      case 'subsidized': return { text: '已补贴', color: 'bg-blue-100 text-blue-700', icon: CreditCard };
      default: return { text: '未知', color: 'bg-gray-100 text-gray-700', icon: Clock };
    }
  };

  const openDetail = (bill: Bill) => {
    setSelectedBill(bill);
    setShowDetail(true);
  };

  const handlePay = (billId: string) => {
    updateBillStatus(billId, 'paid');
    if (selectedBill?.id === billId) {
      setSelectedBill({ ...selectedBill, status: 'paid', paidTime: new Date().toISOString() });
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!generateForm.elderlyId || !generateForm.month) return [];
    
    return appointments.filter((apt) => {
      const matchElderly = apt.elderlyId === generateForm.elderlyId;
      const matchMonth = apt.scheduledTime.startsWith(generateForm.month);
      const matchStatus = apt.status === 'completed' || apt.status === 'confirmed';
      return matchElderly && matchMonth && matchStatus;
    });
  }, [generateForm.elderlyId, generateForm.month, appointments]);

  const calculatePreview = () => {
    let total = 0;
    let subsidy = 0;
    const items: BillItem[] = [];

    generateForm.selectedAppointmentIds.forEach((aptId) => {
      const apt = appointments.find((a) => a.id === aptId);
      if (!apt) return;
      
      const pkg = servicePackages.find((p) => p.id === apt.servicePackageId);
      if (!pkg) return;

      const item: BillItem = {
        id: `bi${Date.now()}-${aptId}`,
        name: `${apt.servicePackageName} - ${new Date(apt.scheduledTime).toLocaleDateString('zh-CN')}`,
        quantity: 1,
        unitPrice: pkg.price,
        amount: pkg.price,
        subsidyAmount: pkg.price - pkg.subsidyPrice
      };
      items.push(item);
      total += pkg.price;
      subsidy += pkg.price - pkg.subsidyPrice;
    });

    return { total, subsidy, actual: total - subsidy, items };
  };

  const handleGenerateBill = () => {
    if (!generateForm.elderlyId || !generateForm.month || generateForm.selectedAppointmentIds.length === 0) return;

    const elder = elderly.find((e) => e.id === generateForm.elderlyId);
    if (!elder) return;

    const { total, subsidy, actual, items } = calculatePreview();

    const newBill: Bill = {
      id: `b${Date.now()}`,
      elderlyId: generateForm.elderlyId,
      elderlyName: elder.name,
      month: generateForm.month,
      totalAmount: total,
      subsidyAmount: subsidy,
      actualAmount: actual,
      status: 'unpaid',
      items,
      createTime: new Date().toISOString()
    };

    addBill(newBill);
    setShowGenerateModal(false);
    setGenerateForm({ elderlyId: '', month: new Date().toISOString().slice(0, 7), selectedAppointmentIds: [] });
  };

  const handleDownload = (bill: Bill) => {
    const content = `
=====================================
        社区养老服务账单
=====================================

账单编号：${bill.id}
老人姓名：${bill.elderlyName}
账单月份：${bill.month}
生成时间：${new Date(bill.createTime).toLocaleString('zh-CN')}
${bill.paidTime ? `支付时间：${new Date(bill.paidTime).toLocaleString('zh-CN')}` : ''}

-------------------------------------
             费用明细
-------------------------------------
${bill.items.map((item, i) => `
${i + 1}. ${item.name}
   单价：¥${item.unitPrice.toLocaleString()}
   数量：${item.quantity}
   金额：¥${item.amount.toLocaleString()}
   补贴：¥${item.subsidyAmount.toLocaleString()}
`).join('')}
-------------------------------------
             费用汇总
-------------------------------------
总金额：    ¥${bill.totalAmount.toLocaleString()}
政府补贴： -¥${bill.subsidyAmount.toLocaleString()}
实付金额：  ¥${bill.actualAmount.toLocaleString()}

账单状态：${getStatusInfo(bill.status).text}

=====================================
    感谢使用社区养老服务平台
=====================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `账单_${bill.elderlyName}_${bill.month}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleAppointment = (aptId: string) => {
    setGenerateForm(prev => ({
      ...prev,
      selectedAppointmentIds: prev.selectedAppointmentIds.includes(aptId)
        ? prev.selectedAppointmentIds.filter(id => id !== aptId)
        : [...prev.selectedAppointmentIds, aptId]
    }));
  };

  const selectAllAppointments = () => {
    if (generateForm.selectedAppointmentIds.length === filteredAppointments.length) {
      setGenerateForm(prev => ({ ...prev, selectedAppointmentIds: [] }));
    } else {
      setGenerateForm(prev => ({ ...prev, selectedAppointmentIds: filteredAppointments.map(a => a.id) }));
    }
  };

  const preview = generateForm.selectedAppointmentIds.length > 0 ? calculatePreview() : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">费用补贴</h1>
          <p className="text-gray-500 mt-1">管理老人的费用账单和补贴核算</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Receipt className="w-5 h-5" />
            生成账单
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-teal-100 text-sm">总费用</span>
            <DollarSign className="w-6 h-6 text-teal-200" />
          </div>
          <p className="text-2xl font-bold">¥{totalAmount.toLocaleString()}</p>
          <p className="text-teal-200 text-sm mt-1">本月累计</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-100 text-sm">补贴总额</span>
            <TrendingUp className="w-6 h-6 text-blue-200" />
          </div>
          <p className="text-2xl font-bold">¥{totalSubsidy.toLocaleString()}</p>
          <p className="text-blue-200 text-sm mt-1">政府补贴</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-orange-100 text-sm">实际支付</span>
            <Wallet className="w-6 h-6 text-orange-200" />
          </div>
          <p className="text-2xl font-bold">¥{totalActual.toLocaleString()}</p>
          <p className="text-orange-200 text-sm mt-1">家属自付</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-red-100 text-sm">待支付</span>
            <Clock className="w-6 h-6 text-red-200" />
          </div>
          <p className="text-2xl font-bold">{unpaidCount}</p>
          <p className="text-red-200 text-sm mt-1">笔账单</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索老人姓名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">全部状态</option>
              <option value="unpaid">待支付</option>
              <option value="paid">已支付</option>
              <option value="subsidized">已补贴</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">老人信息</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">账单月份</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">总金额</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">补贴金额</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">实付金额</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => {
                const statusInfo = getStatusInfo(bill.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={bill.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-600 font-medium text-sm">
                            {bill.elderlyName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">{bill.elderlyName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700">{bill.month}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-800 font-medium">¥{bill.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-blue-600 font-medium">-¥{bill.subsidyAmount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-orange-600 font-bold">¥{bill.actualAmount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetail(bill)}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          详情
                        </button>
                        {bill.status === 'unpaid' && (
                          <button
                            onClick={() => handlePay(bill.id)}
                            className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                          >
                            <CreditCard className="w-4 h-4" />
                            支付
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(bill)}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                          title="下载账单"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">账单详情</h2>
                  <p className="text-teal-100 mt-1">{selectedBill.elderlyName} · {selectedBill.month}</p>
                </div>
                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500">总金额</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">¥{selectedBill.totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-600">政府补贴</p>
                  <p className="text-xl font-bold text-blue-700 mt-1">-¥{selectedBill.subsidyAmount.toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-orange-600">实付金额</p>
                  <p className="text-xl font-bold text-orange-700 mt-1">¥{selectedBill.actualAmount.toLocaleString()}</p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 mb-4">费用明细</h3>
              <div className="space-y-3 mb-6">
                {selectedBill.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">单价: ¥{item.unitPrice} x {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">¥{item.amount.toLocaleString()}</p>
                      <p className="text-sm text-blue-600">补贴: ¥{item.subsidyAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">账单生成时间</span>
                  <span className="text-gray-700">{new Date(selectedBill.createTime).toLocaleString('zh-CN')}</span>
                </div>
                {selectedBill.paidTime && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">支付时间</span>
                    <span className="text-gray-700">{new Date(selectedBill.paidTime).toLocaleString('zh-CN')}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  关闭
                </button>
                <button
                  onClick={() => handleDownload(selectedBill)}
                  className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载
                </button>
                {selectedBill.status === 'unpaid' && (
                  <button
                    onClick={() => handlePay(selectedBill.id)}
                    className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    立即支付
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">生成账单</h2>
                <button
                  onClick={() => { setShowGenerateModal(false); setGenerateForm({ elderlyId: '', month: new Date().toISOString().slice(0, 7), selectedAppointmentIds: [] }); }}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择老人</label>
                  <select
                    value={generateForm.elderlyId}
                    onChange={(e) => setGenerateForm({ ...generateForm, elderlyId: e.target.value, selectedAppointmentIds: [] })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">请选择老人</option>
                    {elderly.map((e) => (
                      <option key={e.id} value={e.id}>{e.name} - {e.age}岁</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">账单月份</label>
                  <input
                    type="month"
                    value={generateForm.month}
                    onChange={(e) => setGenerateForm({ ...generateForm, month: e.target.value, selectedAppointmentIds: [] })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {generateForm.elderlyId && generateForm.month && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">选择服务记录</label>
                    {filteredAppointments.length > 0 && (
                      <button
                        onClick={selectAllAppointments}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        {generateForm.selectedAppointmentIds.length === filteredAppointments.length ? '取消全选' : '全选'}
                      </button>
                    )}
                  </div>
                  
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">该月份暂无已完成或已确认的服务记录</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {filteredAppointments.map((apt) => {
                        const pkg = servicePackages.find((p) => p.id === apt.servicePackageId);
                        const isSelected = generateForm.selectedAppointmentIds.includes(apt.id);
                        return (
                          <div
                            key={apt.id}
                            onClick={() => toggleAppointment(apt.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                              isSelected
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-100 hover:border-teal-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  isSelected ? 'bg-teal-500' : 'border-2 border-gray-300'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{apt.servicePackageName}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    预约时间：{new Date(apt.scheduledTime).toLocaleString('zh-CN')}
                                  </p>
                                  {apt.careWorkerName && (
                                    <p className="text-xs text-gray-500">护理员：{apt.careWorkerName}</p>
                                  )}
                                  <p className={`text-xs mt-1 ${
                                    apt.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                                  }`}>
                                    状态：{apt.status === 'completed' ? '已完成' : '已确认'}
                                  </p>
                                </div>
                              </div>
                              {pkg && (
                                <div className="text-right">
                                  <p className="text-lg font-bold text-teal-600">¥{pkg.subsidyPrice}</p>
                                  <p className="text-xs text-gray-400 line-through">¥{pkg.price}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {preview && (
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-800 mb-3">费用预览</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">总金额</p>
                      <p className="text-xl font-bold text-gray-800 mt-1">¥{preview.total.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600">补贴</p>
                      <p className="text-xl font-bold text-blue-700 mt-1">-¥{preview.subsidy.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-orange-600">实付</p>
                      <p className="text-xl font-bold text-orange-700 mt-1">¥{preview.actual.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => { setShowGenerateModal(false); setGenerateForm({ elderlyId: '', month: new Date().toISOString().slice(0, 7), selectedAppointmentIds: [] }); }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleGenerateBill}
                disabled={!generateForm.elderlyId || !generateForm.month || generateForm.selectedAppointmentIds.length === 0}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                生成账单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
