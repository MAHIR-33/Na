import React from 'react';
import { DashboardStats, VoucherWithDetails } from '../types';
import {
  FileText,
  Layers,
  CircleDollarSign,
  AlertCircle,
  Users,
  PlusCircle,
  Search,
  Printer,
  Edit,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  onNavigateTab: (tab: 'entry' | 'timeline' | 'lookup' | 'dashboard') => void;
  onSelectPrint: (voucher: VoucherWithDetails) => void;
  onSelectEdit: (voucher: VoucherWithDetails) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  onNavigateTab,
  onSelectPrint,
  onSelectEdit,
}) => {
  if (!stats) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
        পরিসংখ্যান লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">মোট চালান (Vouchers)</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-slate-900">{stats.totalVouchers}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">নিবন্ধিত প্রসেসিং মেমো</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">প্রসেসড বান্ডিল</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-slate-900">{stats.totalBundles}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">মোট গৃহীত ও সমাপ্ত সুতা</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">মোট রাজস্ব (Revenue)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-slate-900">
            ৳{stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">নীট প্রসেসিং বিলিং</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">মোট বকেয়া (Due)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-rose-800">
            ৳{stats.totalDue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">গ্রাহকদের কাছে পাওনা</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">সক্রিয় মিল গ্রাহক</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-slate-900">{stats.activeCustomers}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">টানবাজার ও আঞ্চলিক পার্টি</div>
        </div>
      </div>

      {/* Production Status Grid & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>প্রসেসিং ও ডেলিভারি স্ট্যাটাস বিশ্লেষণ</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('lookup')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>রেজিস্ট্রি দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-amber-800 text-[11px] font-bold block">পেন্ডিং অর্ডার</span>
              <span className="text-xl font-black font-mono text-amber-900">
                {stats.statusCounts.pending || 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-blue-800 text-[11px] font-bold block">ওয়াশ ও ডাইং চলমান</span>
              <span className="text-xl font-black font-mono text-blue-900">
                {stats.statusCounts.processing || 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center">
              <span className="text-purple-800 text-[11px] font-bold block">ডেলিভারির জন্য প্রস্তুত</span>
              <span className="text-xl font-black font-mono text-purple-900">
                {stats.statusCounts.ready || 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-emerald-800 text-[11px] font-bold block">ডেলিভারি সম্পন্ন</span>
              <span className="text-xl font-black font-mono text-emerald-900">
                {stats.statusCounts.delivered || 0}
              </span>
            </div>
          </div>

          {/* Recent Vouchers List */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 mb-2">সাম্প্রতিক চালান মেমো (Recent Memos)</h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {stats.recentVouchers.map((v) => (
                <div
                  key={v.id}
                  className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-slate-900 text-white font-mono font-bold rounded">
                      #{v.voucherNo}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{v.customer?.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {v.date} &bull; {v.totalBundles} বান্ডিল
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold font-mono text-slate-900">৳{v.netAmount.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">
                        {v.dueAmount > 0 ? (
                          <span className="text-rose-600 font-bold">বকেয়া: ৳{v.dueAmount.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">পরিশোধিত</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onSelectPrint(v)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="প্রিন্ট মেমো"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectEdit(v)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="সংশোধন করুন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Operations Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>দ্রুত অপারেশন (Quick Actions)</span>
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onNavigateTab('entry')}
                className="w-full text-left p-3 bg-slate-800/90 hover:bg-slate-800 text-white rounded-xl border border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs">নতুন মেমো চালান তৈরি</div>
                  <div className="text-[11px] text-slate-400">স্বয়ংক্রিয় সিরিয়ালসহ এন্ট্রি ফর্ম</div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('timeline')}
                className="w-full text-left p-3 bg-slate-800/90 hover:bg-slate-800 text-white rounded-xl border border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs">গ্রাহকভিত্তিক হিস্ট্রি ও খতিয়ান</div>
                  <div className="text-[11px] text-slate-400">প্রতিটি মিলের অর্ডার টাইমলাইন</div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('lookup')}
                className="w-full text-left p-3 bg-slate-800/90 hover:bg-slate-800 text-white rounded-xl border border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs">চালান রেজিস্ট্রি ও অনুসন্ধান</div>
                  <div className="text-[11px] text-slate-400">ফিল্টারিং ও সার্বিক ভাউচার ডাটাবেজ</div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Industrial Notice Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
            <div className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>মিল পরিচালনা নির্দেশনা</span>
            </div>
            <p>
              &bull; প্রতিটি ভাউচারে বান্ডিল সংখ্যা, দর ও প্রযোজ্য ক্ষেত্রে রং বাদ কর্তন নিশ্চিত করুন।
            </p>
            <p>
              &bull; প্রিন্ট প্রিভিউ থেকে যেকোনো সময় স্ট্যান্ডার্ড মেমো স্লিপ A4 বা রসিদ সাইজে প্রিন্ট করা যায়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
