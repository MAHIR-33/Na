import React, { useState, useEffect, useMemo } from 'react';
import { Customer, VoucherWithDetails, VoucherItem, VoucherStatus } from '../types';
import { createVoucher, updateVoucher, createCustomer } from '../api';
import { Plus, Trash2, Save, Printer, UserPlus, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

interface VoucherFormProps {
  initialVoucher: VoucherWithDetails | null;
  nextVoucherNo: number;
  customers: Customer[];
  onSaveSuccess: (savedVoucher: VoucherWithDetails, isNew: boolean) => void;
  onCancelEdit: () => void;
  onOpenPrint: (voucher: VoucherWithDetails) => void;
}

const COMMON_YARN_TYPES = [
  '২৮/১ কটন (সুতি সুতা)',
  '৩২/১ পিসি (PC Yarn)',
  '৪০/১ কম্বড ইয়ার্ন',
  '২৪/২ স্পান (Spun Yarn)',
  '৩৪/১ কটন সিল্ক টাচ',
  '২০/১ ওপেন এন্ড',
];

interface FormItemState {
  id?: string;
  bundleCount: number;
  yarnType: string;
  washColorDeduction: number;
  washPowderFee: number;
  firozaHspFee: number;
  firozaRtFee: number;
  ratePerBundle: number;
  remarks: string;
}

export const VoucherForm: React.FC<VoucherFormProps> = ({
  initialVoucher,
  nextVoucherNo,
  customers,
  onSaveSuccess,
  onCancelEdit,
  onOpenPrint,
}) => {
  const isEditMode = Boolean(initialVoucher);

  // Header & Customer State
  const [date, setDate] = useState<string>(
    initialVoucher?.date || new Date().toISOString().split('T')[0]
  );
  const [deliveryDate, setDeliveryDate] = useState<string>(initialVoucher?.deliveryDate || '');
  const [status, setStatus] = useState<VoucherStatus>(initialVoucher?.status || 'pending');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialVoucher?.customerId || (customers[0]?.id || '')
  );
  const [isNewCustomerModal, setIsNewCustomerModal] = useState<boolean>(false);
  const [newCustName, setNewCustName] = useState<string>('');
  const [newCustPhone, setNewCustPhone] = useState<string>('');
  const [newCustAddress, setNewCustAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>(initialVoucher?.notes || '');

  // Line items state
  const [items, setItems] = useState<FormItemState[]>(() => {
    if (initialVoucher && initialVoucher.items && initialVoucher.items.length > 0) {
      return initialVoucher.items.map((i) => ({
        id: i.id,
        bundleCount: i.bundleCount,
        yarnType: i.yarnType,
        washColorDeduction: i.washColorDeduction,
        washPowderFee: i.washPowderFee,
        firozaHspFee: i.firozaHspFee,
        firozaRtFee: i.firozaRtFee,
        ratePerBundle: i.ratePerBundle,
        remarks: i.remarks || '',
      }));
    }
    return [
      {
        bundleCount: 20,
        yarnType: '২৮/১ কটন (সুতি সুতা)',
        washColorDeduction: 0,
        washPowderFee: 400,
        firozaHspFee: 0,
        firozaRtFee: 0,
        ratePerBundle: 400,
        remarks: '',
      },
    ];
  });

  // Financial inputs
  const [paidAmount, setPaidAmount] = useState<number>(initialVoucher?.paidAmount || 0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if initialVoucher changes
  useEffect(() => {
    if (initialVoucher) {
      setDate(initialVoucher.date);
      setDeliveryDate(initialVoucher.deliveryDate || '');
      setStatus(initialVoucher.status);
      setSelectedCustomerId(initialVoucher.customerId);
      setNotes(initialVoucher.notes || '');
      setPaidAmount(initialVoucher.paidAmount);
      setItems(
        initialVoucher.items.map((i) => ({
          id: i.id,
          bundleCount: i.bundleCount,
          yarnType: i.yarnType,
          washColorDeduction: i.washColorDeduction,
          washPowderFee: i.washPowderFee,
          firozaHspFee: i.firozaHspFee,
          firozaRtFee: i.firozaRtFee,
          ratePerBundle: i.ratePerBundle,
          remarks: i.remarks || '',
        }))
      );
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setDeliveryDate('');
      setStatus('pending');
      setSelectedCustomerId(customers[0]?.id || '');
      setNotes('');
      setPaidAmount(0);
      setItems([
        {
          bundleCount: 20,
          yarnType: '২৮/১ কটন (সুতি সুতা)',
          washColorDeduction: 0,
          washPowderFee: 400,
          firozaHspFee: 0,
          firozaRtFee: 0,
          ratePerBundle: 400,
          remarks: '',
        },
      ]);
    }
  }, [initialVoucher, customers]);

  // Selected customer info
  const currentCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId);
  }, [customers, selectedCustomerId]);

  // Calculations
  const totalBundles = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.bundleCount) || 0), 0);
  }, [items]);

  const grossAmount = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + (Number(item.bundleCount) || 0) * (Number(item.ratePerBundle) || 0),
      0
    );
  }, [items]);

  const totalDeduction = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + (Number(item.washColorDeduction) || 0) * (Number(item.bundleCount) || 0),
      0
    );
  }, [items]);

  const netAmount = useMemo(() => {
    return Math.max(0, grossAmount - totalDeduction);
  }, [grossAmount, totalDeduction]);

  const dueAmount = useMemo(() => {
    return Math.max(0, netAmount - (Number(paidAmount) || 0));
  }, [netAmount, paidAmount]);

  // Row item actions
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        bundleCount: 10,
        yarnType: '৩২/১ পিসি (PC Yarn)',
        washColorDeduction: 0,
        washPowderFee: 400,
        firozaHspFee: 0,
        firozaRtFee: 0,
        ratePerBundle: 400,
        remarks: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: keyof FormItemState, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Quick Customer Creation
  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    try {
      const created = await createCustomer({
        name: newCustName,
        phone: newCustPhone,
        address: newCustAddress,
      });
      customers.push(created);
      setSelectedCustomerId(created.id);
      setIsNewCustomerModal(false);
      setNewCustName('');
      setNewCustPhone('');
      setNewCustAddress('');
    } catch (err: any) {
      alert('Failed to register customer');
    }
  };

  // Submit Handler
  const handleSave = async (shouldPrintAfter: boolean = false) => {
    if (!selectedCustomerId) {
      setErrorMessage('অনুগ্রহ করে গ্রাহক নির্বাচন করুন (Please select a customer)');
      return;
    }

    if (items.length === 0 || totalBundles <= 0) {
      setErrorMessage('কমপক্ষে একটি সুতার আইটেম এবং সঠিক বান্ডিল সংখ্যা দিন (Valid bundle count required)');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const voucherPayload = {
        date,
        customerId: selectedCustomerId,
        totalBundles,
        grossAmount,
        totalDeduction,
        netAmount,
        paidAmount: Number(paidAmount) || 0,
        dueAmount,
        status,
        deliveryDate: deliveryDate || undefined,
        notes: notes || undefined,
      };

      const itemsPayload: Array<Omit<VoucherItem, 'id' | 'voucherId'>> = items.map((i) => ({
        bundleCount: Number(i.bundleCount) || 0,
        yarnType: i.yarnType,
        washColorDeduction: Number(i.washColorDeduction) || 0,
        washPowderFee: Number(i.washPowderFee) || 0,
        firozaHspFee: Number(i.firozaHspFee) || 0,
        firozaRtFee: Number(i.firozaRtFee) || 0,
        ratePerBundle: Number(i.ratePerBundle) || 0,
        totalAmount: (Number(i.bundleCount) || 0) * (Number(i.ratePerBundle) || 0),
        remarks: i.remarks || undefined,
      }));

      let saved: VoucherWithDetails;
      if (isEditMode && initialVoucher) {
        saved = await updateVoucher(initialVoucher.id, voucherPayload, itemsPayload);
        onSaveSuccess(saved, false);
      } else {
        saved = await createVoucher(voucherPayload, itemsPayload);
        onSaveSuccess(saved, true);
      }

      if (shouldPrintAfter) {
        onOpenPrint(saved);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'ভাউচার সংরক্ষণ করতে ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Mode Banner / Header */}
      <div
        className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b ${
          isEditMode
            ? 'bg-amber-500/10 border-amber-300 text-amber-950'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              isEditMode ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            #{isEditMode ? initialVoucher?.voucherNo : nextVoucherNo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight">
                {isEditMode
                  ? `ভাউচার সংশোধন (Edit Mode: Voucher #${initialVoucher?.voucherNo})`
                  : `নতুন সুতা প্রসেসিং মেমো (New Memo Entry)`}
              </h2>
              {isEditMode ? (
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  সংশোধন মোড
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  স্বয়ংক্রিয় সিরিয়াল
                </span>
              )}
            </div>
            <p
              className={`text-xs ${
                isEditMode ? 'text-amber-800' : 'text-slate-400'
              }`}
            >
              {isEditMode
                ? 'এই ভাউচারের তথ্য ও আইটেম আপডেট করুন। অন্যান্য ভাউচার অপরিবর্তিত থাকবে।'
                : 'গ্রাহকের জন্য নতুন সিরিয়াল যুক্ত করে আইটেম তালিকা ও বিল প্রস্তুত করুন।'}
            </p>
          </div>
        </div>

        {isEditMode && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>বাতিল করে নতুন এন্ট্রি মোডে যান (Cancel)</span>
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="p-6 space-y-6">
        {/* Customer & Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer Selection */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="customer-select" className="text-xs font-bold text-slate-700">
                গ্রাহক / মিল মালিকের নাম (Customer / Mill Name) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsNewCustomerModal(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ নতুন গ্রাহক নিবন্ধন</span>
              </button>
            </div>
            <select
              id="customer-select"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
            >
              <option value="">গ্রাহক নির্বাচন করুন...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.address} ({c.phone})
                </option>
              ))}
            </select>

            {/* Quick Customer Detail Pill */}
            {currentCustomer && (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  <strong>ঠিকানা:</strong> {currentCustomer.address || 'তথ্য নেই'}
                </span>
                <span>
                  <strong>মোবাইল:</strong> {currentCustomer.phone || 'তথ্য নেই'}
                </span>
              </div>
            )}
          </div>

          {/* Date Picker & Voucher Serial */}
          <div className="space-y-2">
            <label htmlFor="voucher-date" className="text-xs font-bold text-slate-700">
              চালান তারিখ (Voucher Date) <span className="text-red-500">*</span>
            </label>
            <input
              id="voucher-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
            />
          </div>
        </div>

        {/* Secondary Details: Status & Delivery Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label htmlFor="status-select" className="text-xs font-bold text-slate-700 mb-1 block">
              প্রসেসিং স্ট্যাটাস (Status)
            </label>
            <select
              id="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as VoucherStatus)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="pending">পেন্ডিং (Pending)</option>
              <option value="processing">প্রসেসিং চলছে (Processing)</option>
              <option value="ready">ডেলিভারির জন্য প্রস্তুত (Ready)</option>
              <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
            </select>
          </div>

          <div>
            <label htmlFor="delivery-date-input" className="text-xs font-bold text-slate-700 mb-1 block">
              সম্ভাব্য ডেলিভারি তারিখ (Est. Delivery Date)
            </label>
            <input
              id="delivery-date-input"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="order-notes" className="text-xs font-bold text-slate-700 mb-1 block">
              বিশেষ নোট / মন্তব্য (Remarks)
            </label>
            <input
              id="order-notes"
              type="text"
              placeholder="লট নম্বর, বিশেষ ওয়াশ নির্দেশনা ইত্যাদি..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic Line Items Table */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>সুতার বিবরণ ও প্রসেসিং খরচ সূচী</span>
              <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded-full">
                {items.length} লাইন আইটেম
              </span>
            </h3>
            <button
              id="add-item-row-btn"
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন লাইন যোগ করুন</span>
            </button>
          </div>

          {/* Quick Preset Yarn Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
            <span className="font-bold text-slate-400 mr-1">দ্রুত নির্বাচন:</span>
            {COMMON_YARN_TYPES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  handleItemChange(items.length - 1, 'yarnType', preset);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                title="Use for the current item row"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Item Table */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-2.5 w-10 text-center">#</th>
                  <th className="p-2.5 min-w-[180px]">কাউন্ট / সুতার বিবরণ</th>
                  <th className="p-2.5 w-24">বান্ডিল সংখ্যা</th>
                  <th className="p-2.5 w-28">ধোলাই - রং বাদ (৳)</th>
                  <th className="p-2.5 w-28">ধোলাই - কুড়া পঃ (৳)</th>
                  <th className="p-2.5 w-24">ফিরোজা HSP</th>
                  <th className="p-2.5 w-24">ফিরোজা RT</th>
                  <th className="p-2.5 w-24">দর / রেট (৳)</th>
                  <th className="p-2.5 w-28 text-right">মোট টাকা</th>
                  <th className="p-2.5 w-10 text-center">মুছুন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, idx) => {
                  const lineTotal = (Number(item.bundleCount) || 0) * (Number(item.ratePerBundle) || 0);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-2 text-center font-mono text-slate-500 font-bold">{idx + 1}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.yarnType}
                          onChange={(e) => handleItemChange(idx, 'yarnType', e.target.value)}
                          placeholder="কাউন্ট ও সুতা (যেমন: ২৮/১ কটন)"
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={item.bundleCount || ''}
                          onChange={(e) => handleItemChange(idx, 'bundleCount', Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={item.washColorDeduction || ''}
                          onChange={(e) => handleItemChange(idx, 'washColorDeduction', Number(e.target.value))}
                          placeholder="0"
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-800 focus:border-emerald-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={item.washPowderFee || ''}
                          onChange={(e) => handleItemChange(idx, 'washPowderFee', Number(e.target.value))}
                          placeholder="0"
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-800 focus:border-emerald-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={item.firozaHspFee || ''}
                          onChange={(e) => handleItemChange(idx, 'firozaHspFee', Number(e.target.value))}
                          placeholder="0"
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-800 focus:border-emerald-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={item.firozaRtFee || ''}
                          onChange={(e) => handleItemChange(idx, 'firozaRtFee', Number(e.target.value))}
                          placeholder="0"
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-800 focus:border-emerald-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={item.ratePerBundle || ''}
                          onChange={(e) => handleItemChange(idx, 'ratePerBundle', Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-950">
                        ৳{lineTotal.toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={items.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer transition-colors"
                          title="লাইন মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation & Billing Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-bold">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">মোট বান্ডিল সংখ্যা</span>
              <span className="text-xl font-mono font-black text-slate-900">{totalBundles}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">মোট গ্রস প্রসেসিং বিল</span>
              <span className="text-xl font-mono font-black text-slate-900">৳{grossAmount.toLocaleString()}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-amber-700 block mb-0.5">সর্বমোট কর্তন (রং বাদ)</span>
              <span className="text-xl font-mono font-black text-amber-800">- ৳{totalDeduction.toLocaleString()}</span>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 block mb-0.5">নীট প্রদেয় বিল (Net)</span>
              <span className="text-xl font-mono font-black text-emerald-900">৳{netAmount.toLocaleString()}</span>
            </div>

            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
              <span className="text-rose-800 block mb-0.5">বকেয়া পাওনা (Due)</span>
              <span className="text-xl font-mono font-black text-rose-900">৳{dueAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Paid / Advance Input Row */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label htmlFor="paid-amount-input" className="text-xs font-bold text-slate-700 whitespace-nowrap">
                জমা / অগ্রিম বিল (Paid Amount):
              </label>
              <div className="relative w-44">
                <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">৳</span>
                <input
                  id="paid-amount-input"
                  type="number"
                  min="0"
                  value={paidAmount || ''}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>রিয়েল-টাইম হিসাব সংরক্ষিত থাকবে</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            id="save-voucher-btn"
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave(false)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isEditMode ? 'ভাউচার আপডেট করুন (Update Memo)' : 'মেমো সংরক্ষণ করুন (Save Memo)'}</span>
          </button>

          <button
            id="save-and-print-voucher-btn"
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>সংরক্ষণ ও প্রিন্ট রসিদ (Save &amp; Print)</span>
          </button>
        </div>
      </div>

      {/* New Customer Modal */}
      {isNewCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">নতুন গ্রাহক / মিলের তথ্য যোগ করুন</h3>
            <p className="text-xs text-slate-500 mb-4">
              ভাউচারিং ও হিসেবের সুবিধার জন্য গ্রাহকের নাম, মোবাইল ও ঠিকানা প্রদান করুন।
            </p>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">গ্রাহকের নাম / ট্রেডার্স *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মেসার্স চৌধুরী টেক্সটাইল"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  placeholder="যেমন: ০১৭১১-XXXXXX"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ঠিকানা / বাজার</label>
                <input
                  type="text"
                  placeholder="যেমন: টানবাজার, নারায়ণগঞ্জ"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  গ্রাহক সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
