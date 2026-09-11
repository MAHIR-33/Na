import React, { useState, useMemo, useEffect } from 'react';
import { Customer, VoucherWithDetails } from '../types';
import { fetchVouchers } from '../api';
import {
  Users,
  Search,
  Calendar,
  Layers,
  Printer,
  Edit,
  PlusCircle,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';

interface CustomerTimelineProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
  onEditVoucher: (voucher: VoucherWithDetails) => void;
  onPrintVoucher: (voucher: VoucherWithDetails) => void;
  onCreateNewForCustomer: (customer: Customer) => void;
  onRefreshData: () => void;
}

export const CustomerTimeline: React.FC<CustomerTimelineProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onEditVoucher,
  onPrintVoucher,
  onCreateNewForCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customerVouchers, setCustomerVouchers] = useState<VoucherWithDetails[]>([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState<boolean>(false);

  // Active Customer
  const activeCustomer = useMemo(() => {
    if (!selectedCustomerId && customers.length > 0) return customers[0];
    return customers.find((c) => c.id === selectedCustomerId) || customers[0] || null;
  }, [customers, selectedCustomerId]);

  // Load vouchers for active customer
  useEffect(() => {
    if (activeCustomer) {
      setIsLoadingTimeline(true);
      fetchVouchers({ customerId: activeCustomer.id })
        .then((res) => setCustomerVouchers(res))
        .catch((err) => console.error('Failed to fetch customer timeline:', err))
        .finally(() => setIsLoadingTimeline(false));
    } else {
      setCustomerVouchers([]);
    }
  }, [activeCustomer]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  // Customer Cumulative Stats
  const cumulativeStats = useMemo(() => {
    const totalOrders = customerVouchers.length;
    const totalBundles = customerVouchers.reduce((acc, v) => acc + (v.totalBundles || 0), 0);
    const totalBilled = customerVouchers.reduce((acc, v) => acc + (v.netAmount || 0), 0);
    const totalDue = customerVouchers.reduce((acc, v) => acc + (v.dueAmount || 0), 0);
    return { totalOrders, totalBundles, totalBilled, totalDue };
  }, [customerVouchers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Customer Directory */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>গ্রাহক তালিকা (Customer Directory)</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {customers.length}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="গ্রাহকের নাম, ফোন বা এলাকা খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Customer Cards List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCustomers.map((cust) => {
              const isSelected = activeCustomer?.id === cust.id;
              return (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => onSelectCustomer(cust.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs tracking-tight line-clamp-1">{cust.name}</div>
                  <div
                    className={`text-[11px] mt-1 flex items-center gap-2 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    <span>{cust.address || 'টানবাজার'}</span>
                    <span>&bull;</span>
                    <span>{cust.phone}</span>
                  </div>
                </button>
              );
            })}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">কোন গ্রাহক পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Customer Timeline Feed */}
      <div className="lg:col-span-8 space-y-4">
        {activeCustomer ? (
          <>
            {/* Customer Profile & Stats Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{activeCustomer.name}</h2>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      নিয়মিত পার্টি
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {activeCustomer.address}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {activeCustomer.phone}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onCreateNewForCustomer(activeCustomer)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>নতুন চালান প্রস্তুত (+ New Memo)</span>
                </button>
              </div>

              {/* Cumulative Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">মোট চালান (Memos)</span>
                  <span className="text-base font-bold font-mono text-slate-900">
                    {cumulativeStats.totalOrders} টি
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">মোট প্রসেসড বান্ডিল</span>
                  <span className="text-base font-bold font-mono text-slate-900">
                    {cumulativeStats.totalBundles} বান্ডিল
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">সর্বমোট বিল</span>
                  <span className="text-base font-bold font-mono text-emerald-700">
                    ৳{cumulativeStats.totalBilled.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">মোট বকেয়া (Due)</span>
                  <span className="text-base font-bold font-mono text-rose-700">
                    ৳{cumulativeStats.totalDue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Vouchers Feed */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>অর্ডার ও ডেলিভারি হিস্ট্রি (Order Timeline)</span>
              </h3>

              {isLoadingTimeline ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                  লোড হচ্ছে...
                </div>
              ) : customerVouchers.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                  এই গ্রাহকের জন্য কোনো চালান পাওয়া যায়নি। উপরের বাটনে ক্লিক করে নতুন চালান যুক্ত করুন।
                </div>
              ) : (
                customerVouchers.map((voucher) => {
                  return (
                    <div
                      key={voucher.id}
                      className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-colors"
                    >
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded-lg">
                            মেমো #{voucher.voucherNo}
                          </span>
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {voucher.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              voucher.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : voucher.status === 'ready'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {voucher.status === 'delivered'
                              ? 'ডেলিভারি সম্পন্ন'
                              : voucher.status === 'ready'
                              ? 'প্রস্তুত'
                              : 'প্রসেসিং'}
                          </span>

                          <button
                            type="button"
                            onClick={() => onPrintVoucher(voucher)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="মেমো প্রিন্ট করুন"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEditVoucher(voucher)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="ভাউচার সংশোধন করুন"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Items Mini Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="text-slate-500 font-semibold border-b border-slate-100">
                            <tr>
                              <th className="pb-1.5">সুতার বিবরণ</th>
                              <th className="pb-1.5 text-center">বান্ডিল</th>
                              <th className="pb-1.5 text-center">দর</th>
                              <th className="pb-1.5 text-right">মোট টাকা</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-800">
                            {voucher.items.map((item, i) => (
                              <tr key={item.id || i}>
                                <td className="py-1.5 font-medium">{item.yarnType}</td>
                                <td className="py-1.5 text-center font-mono font-bold">{item.bundleCount}</td>
                                <td className="py-1.5 text-center font-mono">৳{item.ratePerBundle}</td>
                                <td className="py-1.5 text-right font-mono font-bold">
                                  ৳{item.totalAmount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer Totals */}
                      <div className="bg-slate-50 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4">
                          <span>
                            মোট বান্ডিল: <strong>{voucher.totalBundles}</strong>
                          </span>
                          {voucher.notes && (
                            <span className="text-slate-500 italic">মন্তব্য: {voucher.notes}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 font-mono">
                          <span>
                            বিল: <strong>৳{voucher.netAmount.toLocaleString()}</strong>
                          </span>
                          <span>
                            জমা: <strong className="text-emerald-700">৳{voucher.paidAmount.toLocaleString()}</strong>
                          </span>
                          <span>
                            বকেয়া: <strong className="text-rose-700">৳{voucher.dueAmount.toLocaleString()}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            অনুগ্রহ করে বাম পাশ থেকে একজন গ্রাহক নির্বাচন করুন।
          </div>
        )}
      </div>
    </div>
  );
};
