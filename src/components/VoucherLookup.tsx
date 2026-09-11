import React, { useState, useMemo } from 'react';
import { VoucherWithDetails, VoucherStatus } from '../types';
import { Search, Printer, Edit, Trash2, User, Filter, Eye } from 'lucide-react';

interface VoucherLookupProps {
  vouchers: VoucherWithDetails[];
  onSelectEdit: (voucher: VoucherWithDetails) => void;
  onSelectPrint: (voucher: VoucherWithDetails) => void;
  onViewCustomerTimeline: (customerId: string) => void;
  onDeleteVoucher: (id: string) => void;
}

export const VoucherLookup: React.FC<VoucherLookupProps> = ({
  vouchers,
  onSelectEdit,
  onSelectPrint,
  onViewCustomerTimeline,
  onDeleteVoucher,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const vNo = v.voucherNo.toString();
        const custName = (v.customer?.name || '').toLowerCase();
        const custPhone = (v.customer?.phone || '').toLowerCase();
        const custAddr = (v.customer?.address || '').toLowerCase();
        const itemsText = v.items.map((i) => i.yarnType).join(' ').toLowerCase();

        const match =
          vNo.includes(q) ||
          custName.includes(q) ||
          custPhone.includes(q) ||
          custAddr.includes(q) ||
          itemsText.includes(q);

        if (!match) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && v.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter && v.date !== dateFilter) {
        return false;
      }

      return true;
    });
  }, [vouchers, searchTerm, statusFilter, dateFilter]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-5">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" />
            <span>ভাউচার ও চালান রেজিস্ট্রি (Search Registry)</span>
          </h2>
          <p className="text-xs text-slate-500">
            ভাউচার নং, গ্রাহকের নাম, মোবাইল বা সুতার কাউন্ট দিয়ে যেকোনো চালান খুঁজুন।
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="মেমো নং, পার্টি বা সুতার নাম..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="pending">পেন্ডিং</option>
            <option value="processing">প্রসেসিং চলছে</option>
            <option value="ready">ডেলিভারির জন্য প্রস্তুত</option>
            <option value="delivered">ডেলিভারি সম্পন্ন</option>
          </select>

          {/* Date Picker Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
            title="নির্দিষ্ট তারিখ অনুযায়ী ফিল্টার"
          />

          {(searchTerm || statusFilter !== 'all' || dateFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
              }}
              className="text-xs text-slate-500 hover:text-slate-900 underline ml-1 cursor-pointer"
            >
              ফিল্টার মুছুন
            </button>
          )}
        </div>
      </div>

      {/* Registry Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="p-3 w-20 text-center">মেমো নং</th>
              <th className="p-3 w-24">তারিখ</th>
              <th className="p-3 min-w-[180px]">গ্রাহক ও এলাকা</th>
              <th className="p-3 min-w-[200px]">সুতার কাউন্ট ও বিবরণ</th>
              <th className="p-3 w-20 text-center">বান্ডিল</th>
              <th className="p-3 w-24 text-right">নীট বিল</th>
              <th className="p-3 w-24 text-right">বকেয়া</th>
              <th className="p-3 w-28 text-center">স্ট্যাটাস</th>
              <th className="p-3 w-32 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredVouchers.map((voucher) => (
              <tr key={voucher.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 text-center font-mono font-bold text-slate-950">
                  <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded">
                    #{voucher.voucherNo}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-600">{voucher.date}</td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => onViewCustomerTimeline(voucher.customerId)}
                    className="text-left font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer block line-clamp-1"
                    title="গ্রাহকের টাইমলাইন দেখুন"
                  >
                    {voucher.customer?.name}
                  </button>
                  <span className="text-[11px] text-slate-500 block">
                    {voucher.customer?.address || voucher.customer?.phone}
                  </span>
                </td>
                <td className="p-3">
                  <div className="space-y-0.5">
                    {voucher.items.map((item, i) => (
                      <div key={i} className="text-[11px] text-slate-700">
                        &bull; {item.yarnType} ({item.bundleCount} বাঃ)
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-center font-mono font-bold text-slate-900">
                  {voucher.totalBundles}
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">
                  ৳{voucher.netAmount.toLocaleString()}
                </td>
                <td className="p-3 text-right font-mono font-bold">
                  {voucher.dueAmount > 0 ? (
                    <span className="text-rose-700">৳{voucher.dueAmount.toLocaleString()}</span>
                  ) : (
                    <span className="text-emerald-700">পরিশোধিত</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      voucher.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : voucher.status === 'ready'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {voucher.status === 'delivered'
                      ? 'ডেলিভার্ড'
                      : voucher.status === 'ready'
                      ? 'প্রস্তুত'
                      : 'প্রসেসিং'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectPrint(voucher)}
                      className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="মেমো প্রিন্ট করুন"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectEdit(voucher)}
                      className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="সংশোধন করুন"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteVoucher(voucher.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredVouchers.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  কোন ভাউচার রেকর্ড পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
