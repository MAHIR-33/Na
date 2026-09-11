import React, { useState, useEffect } from 'react';
import {
  Customer,
  VoucherWithDetails,
  DashboardStats,
} from './types';
import {
  fetchCustomers,
  fetchVouchers,
  fetchNextVoucherNo,
  fetchStats,
  deleteVoucher,
} from './api';
import { VoucherForm } from './components/VoucherForm';
import { CustomerTimeline } from './components/CustomerTimeline';
import { VoucherLookup } from './components/VoucherLookup';
import { DashboardOverview } from './components/DashboardOverview';
import { VoucherPrintModal } from './components/VoucherPrintModal';
import {
  FileText,
  Users,
  Search,
  LayoutDashboard,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'entry' | 'timeline' | 'lookup' | 'dashboard'>('entry');

  // Data states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vouchers, setVouchers] = useState<VoucherWithDetails[]>([]);
  const [nextVoucherNo, setNextVoucherNo] = useState<number>(1005);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Workflow states
  const [editingVoucher, setEditingVoucher] = useState<VoucherWithDetails | null>(null);
  const [printingVoucher, setPrintingVoucher] = useState<VoucherWithDetails | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Load all initial data
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [custList, vList, nextSerial, statsData] = await Promise.all([
        fetchCustomers(),
        fetchVouchers(),
        fetchNextVoucherNo(),
        fetchStats(),
      ]);
      setCustomers(custList);
      setVouchers(vList);
      setNextVoucherNo(nextSerial);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handlers
  const handleSaveSuccess = () => {
    // Refresh data in background
    loadInitialData();
  };

  const handleEditVoucher = (voucher: VoucherWithDetails) => {
    setEditingVoucher(voucher);
    setActiveTab('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingVoucher(null);
  };

  const handleCreateNewForCustomer = (customer: Customer) => {
    setEditingVoucher(null);
    setSelectedCustomerId(customer.id);
    setActiveTab('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintVoucher = (voucher: VoucherWithDetails) => {
    setPrintingVoucher(voucher);
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    if (!window.confirm('Are you sure you want to delete this voucher record?')) return;
    try {
      await deleteVoucher(voucherId);
      loadInitialData();
    } catch (err) {
      alert('Failed to delete voucher');
    }
  };

  const handleViewCustomerTimeline = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveTab('timeline');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Industrial Header & Factory Status */}
      <header className="bg-slate-950 text-white border-b border-slate-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            {/* Factory Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md font-black text-lg">
                সুতা
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-white uppercase">
                    মেসার্স আল-মদিনা সুতা প্রসেসিং এন্ড ডাইং মিলস
                  </span>
                  <span className="hidden md:inline text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    YarnFlow Order Manager
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>AL-MADINA YARN PROCESSING MILLS</span>
                  <span>&bull;</span>
                  <span>টানবাজার, নারায়ণগঞ্জ</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Live Info */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="refresh-all-data-btn"
                onClick={loadInitialData}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Refresh All Database Records"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>

              <button
                id="header-create-memo-btn"
                type="button"
                onClick={() => {
                  setEditingVoucher(null);
                  setActiveTab('entry');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Memo #{nextVoucherNo}</span>
              </button>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-800 pt-2 pb-1 overflow-x-auto text-xs font-bold">
            <button
              id="nav-tab-entry"
              type="button"
              onClick={() => setActiveTab('entry')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'entry'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ভাউচার এন্ট্রি (Memo Entry)</span>
              {editingVoucher ? (
                <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                  Mode 2: #{editingVoucher.voucherNo}
                </span>
              ) : (
                <span className="text-[10px] bg-slate-700 text-slate-200 px-1.5 py-0.2 rounded font-mono">
                  #{nextVoucherNo}
                </span>
              )}
            </button>

            <button
              id="nav-tab-timeline"
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>গ্রাহক টাইমলাইন (Customer Records)</span>
              <span className="text-[10px] bg-slate-700 text-slate-200 px-1.5 py-0.2 rounded font-mono">
                {customers.length}
              </span>
            </button>

            <button
              id="nav-tab-lookup"
              type="button"
              onClick={() => setActiveTab('lookup')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'lookup'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>অনুসন্ধান রেজিস্ট্রি (Search Registry)</span>
              <span className="text-[10px] bg-slate-700 text-slate-200 px-1.5 py-0.2 rounded font-mono">
                {vouchers.length}
              </span>
            </button>

            <button
              id="nav-tab-dashboard"
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>মিল ড্যাশবোর্ড (Factory Overview)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'entry' && (
          <div className="space-y-6">
            <VoucherForm
              initialVoucher={editingVoucher}
              nextVoucherNo={nextVoucherNo}
              customers={customers}
              onSaveSuccess={handleSaveSuccess}
              onCancelEdit={handleCancelEdit}
              onOpenPrint={handlePrintVoucher}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <CustomerTimeline
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={(id) => setSelectedCustomerId(id)}
            onEditVoucher={handleEditVoucher}
            onPrintVoucher={handlePrintVoucher}
            onCreateNewForCustomer={handleCreateNewForCustomer}
            onRefreshData={loadInitialData}
          />
        )}

        {activeTab === 'lookup' && (
          <VoucherLookup
            vouchers={vouchers}
            onSelectEdit={handleEditVoucher}
            onSelectPrint={handlePrintVoucher}
            onViewCustomerTimeline={handleViewCustomerTimeline}
            onDeleteVoucher={handleDeleteVoucher}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardOverview
            stats={stats}
            onNavigateTab={(tab) => {
              if (tab === 'entry') setEditingVoucher(null);
              setActiveTab(tab);
            }}
            onSelectPrint={handlePrintVoucher}
            onSelectEdit={handleEditVoucher}
          />
        )}
      </main>

      {/* Printable Modal (Appears whenever user clicks Print Receipt) */}
      <VoucherPrintModal
        voucher={printingVoucher}
        onClose={() => setPrintingVoucher(null)}
      />

      {/* Industrial Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; 2026 Al-Madina Yarn Processing Mills &bull; YarnFlow Order &amp; Delivery Management System
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Standardized Textile Processing Memo</span>
            <span>&bull;</span>
            <span>Bilingual Bengali / English Memo Slip</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
