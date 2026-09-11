import React from 'react';
import { VoucherWithDetails } from '../types';
import { Printer, X } from 'lucide-react';

interface PrintableVoucherProps {
  voucher: VoucherWithDetails;
  onClose?: () => void;
}

export const PrintableVoucher: React.FC<PrintableVoucherProps> = ({ voucher, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden printable-slip text-slate-900">
      {/* Top Modal Controls - Hidden on Paper */}
      <div className="print:hidden bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm tracking-wide">
            মেমো প্রিন্ট প্রিভিউ (Print Preview) &bull; ভাউচার #{voucher.voucherNo}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="print-action-btn"
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন (Print Slip)</span>
          </button>
          {onClose && (
            <button
              id="close-print-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Actual Printable Physical Voucher Slip */}
      <div className="p-6 sm:p-10 font-sans">
        {/* Header */}
        <div className="border-b-2 border-slate-950 pb-5 text-center relative">
          <div className="text-xs font-bold tracking-widest text-slate-600 uppercase mb-1">
            বিসমিল্লাহির রাহমানির রাহিম
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
            মেসার্স আল-মদিনা সুতা প্রসেসিং এন্ড ডাইং মিলস
          </h1>
          <div className="text-sm font-semibold text-slate-700 tracking-wide mt-0.5">
            AL-MADINA YARN PROCESSING &amp; DYEING MILLS
          </div>
          <p className="text-xs text-slate-600 mt-1">
            টানবাজার, নারায়ণগঞ্জ &bull; মোবাইল: ০১৭১১-২৩৪৫৬৭, ০১৮১৯-৮৭৬৫৪৩
          </p>
          <div className="inline-block mt-3 px-4 py-1 bg-slate-950 text-white font-bold text-xs rounded-full uppercase tracking-wider">
            সুতা প্রসেসিং চালান ও ক্যাশ মেমো
          </div>
        </div>

        {/* Voucher Info & Customer Details */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-300 text-xs sm:text-sm">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-28 font-bold text-slate-700">ভাউচার নং:</span>
              <span className="font-black text-slate-950 font-mono text-base">#{voucher.voucherNo}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-700">গ্রাহকের নাম:</span>
              <span className="font-bold text-slate-900">{voucher.customer?.name || 'সাধারণ গ্রাহক'}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-700">ঠিকানা:</span>
              <span className="text-slate-800">{voucher.customer?.address || '-'}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-700">মোবাইল নং:</span>
              <span className="text-slate-800 font-mono">{voucher.customer?.phone || '-'}</span>
            </div>
          </div>

          <div className="space-y-1 text-right sm:text-left sm:pl-8">
            <div className="flex justify-between sm:justify-start">
              <span className="w-28 font-bold text-slate-700">তারিখ:</span>
              <span className="font-bold text-slate-900 font-mono">{voucher.date}</span>
            </div>
            <div className="flex justify-between sm:justify-start">
              <span className="w-28 font-bold text-slate-700">ডেলিভারি তারিখ:</span>
              <span className="text-slate-800 font-mono">{voucher.deliveryDate || 'নির্ধারিত নয়'}</span>
            </div>
            <div className="flex justify-between sm:justify-start">
              <span className="w-28 font-bold text-slate-700">স্ট্যাটাস:</span>
              <span className="font-bold capitalize text-slate-900">
                {voucher.status === 'delivered' ? 'ডেলিভারি সম্পন্ন' : voucher.status === 'ready' ? 'ডেলিভারির জন্য প্রস্তুত' : 'প্রসেসিং চলমান'}
              </span>
            </div>
            {voucher.notes && (
              <div className="flex justify-between sm:justify-start">
                <span className="w-28 font-bold text-slate-700">মন্তব্য:</span>
                <span className="text-slate-800 italic">{voucher.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse border border-slate-400 text-xs text-slate-900">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400 text-center">
                <th className="border border-slate-400 px-2 py-2 w-10">ক্রঃ</th>
                <th className="border border-slate-400 px-3 py-2 text-left">কাউন্ট ও সুতার বিবরণ</th>
                <th className="border border-slate-400 px-2 py-2 w-20">বান্ডিল সংখ্যা</th>
                <th className="border border-slate-400 px-2 py-2">ধোলাই - রং বাদ</th>
                <th className="border border-slate-400 px-2 py-2">ধোলাই - কুড়া পঃ</th>
                <th className="border border-slate-400 px-2 py-2">ফিরোজা - HSP</th>
                <th className="border border-slate-400 px-2 py-2">ফিরোজা - RT</th>
                <th className="border border-slate-400 px-2 py-2 w-20">দর (৳)</th>
                <th className="border border-slate-400 px-3 py-2 w-28 text-right">মোট টাকা (৳)</th>
              </tr>
            </thead>
            <tbody>
              {voucher.items.map((item, index) => (
                <tr key={item.id || index} className="text-center hover:bg-slate-50">
                  <td className="border border-slate-300 px-2 py-2 font-mono">{index + 1}</td>
                  <td className="border border-slate-300 px-3 py-2 text-left font-semibold">
                    {item.yarnType}
                    {item.remarks && <span className="text-[11px] text-slate-500 block italic">({item.remarks})</span>}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 font-bold font-mono text-sm">{item.bundleCount}</td>
                  <td className="border border-slate-300 px-2 py-2 font-mono">
                    {item.washColorDeduction > 0 ? `৳${item.washColorDeduction}` : '-'}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 font-mono">
                    {item.washPowderFee > 0 ? `৳${item.washPowderFee}` : '-'}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 font-mono">
                    {item.firozaHspFee > 0 ? `৳${item.firozaHspFee}` : '-'}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 font-mono">
                    {item.firozaRtFee > 0 ? `৳${item.firozaRtFee}` : '-'}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 font-mono">৳{item.ratePerBundle}</td>
                  <td className="border border-slate-300 px-3 py-2 text-right font-bold font-mono text-slate-950">
                    ৳{item.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {/* Fill empty rows to look like traditional printed receipt books if fewer than 4 items */}
              {Array.from({ length: Math.max(0, 3 - voucher.items.length) }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-8">
                  <td className="border border-slate-200"></td>
                  <td className="border border-slate-200"></td>
                  <td className="border border-slate-200"></td>
                  <td className="border border-slate-200"></td>
                  <td className="border border-slate-200"></td>
                  <td className="border border-slate-200"></td>
                  <td className="border border-slate-200"></td>
                  <td className="border border-slate-200"></td>
                  <td className="border border-slate-200"></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-400">
                <td colSpan={2} className="border border-slate-300 px-3 py-2 text-right">
                  সর্বমোট বান্ডিল:
                </td>
                <td className="border border-slate-300 px-2 py-2 text-center font-mono text-base font-black text-emerald-800">
                  {voucher.totalBundles}
                </td>
                <td colSpan={5} className="border border-slate-300 px-3 py-2 text-right">
                  মোট প্রসেসিং বিল:
                </td>
                <td className="border border-slate-300 px-3 py-2 text-right font-mono text-base text-slate-950">
                  ৳{voucher.grossAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Calculations & Statutory Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5 pt-3">
          {/* Statutory Clauses */}
          <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
            <div className="font-bold text-slate-900 uppercase tracking-wide mb-1 border-b border-slate-300 pb-1">
              জরুরী শর্তাবলী (Conditions):
            </div>
            <p className="font-semibold text-red-700 mb-1">
              ১. চালান অনুযায়ী মাল ৩ (তিন) দিনের মধ্যে গ্রহণ করিতে হইবে, অন্যথায় মাল নরম হওয়ার জন্য কর্তৃপক্ষ দায়ী থাকবে না।
            </p>
            <p className="mb-0.5">২. মিল প্রাঙ্গণ ত্যাগের পূর্বে বান্ডিল ও সুতার মান নিশ্চিত হয়ে বুঝে নিবেন।</p>
            <p>৩. পূর্ণ বিল পরিশোধ ব্যতিরেকে মাল ডেলিভারি দেওয়া হইবে না।</p>
          </div>

          {/* Financial Totals */}
          <div className="space-y-1.5 text-xs sm:text-sm font-semibold border border-slate-300 rounded-xl p-4 bg-white">
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-600">মোট গ্রস বিল (Gross Bill):</span>
              <span className="font-mono text-slate-900">৳{voucher.grossAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200 text-amber-800">
              <span>কর্তন / রং বাদ (Deduction):</span>
              <span className="font-mono">- ৳{voucher.totalDeduction.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b-2 border-slate-400 text-base font-bold text-slate-950">
              <span>নীট প্রদেয় বিল (Net Payable):</span>
              <span className="font-mono">৳{voucher.netAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200 text-emerald-700">
              <span>জমা / অগ্রিম (Paid Amount):</span>
              <span className="font-mono">৳{voucher.paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-black text-rose-700">
              <span>বকেয়া পাওনা (Due Balance):</span>
              <span className="font-mono">৳{voucher.dueAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="grid grid-cols-4 gap-4 mt-12 pt-8 text-center text-xs font-bold text-slate-700">
          <div>
            <div className="border-t border-slate-500 pt-1.5">প্রস্তুতকারক</div>
            <span className="text-[10px] text-slate-500 font-normal">Prepared By</span>
          </div>
          <div>
            <div className="border-t border-slate-500 pt-1.5">যাচাইকারী / হিসাব</div>
            <span className="text-[10px] text-slate-500 font-normal">Accountant</span>
          </div>
          <div>
            <div className="border-t border-slate-500 pt-1.5">গ্রাহকের স্বাক্ষর</div>
            <span className="text-[10px] text-slate-500 font-normal">Receiver's Sign</span>
          </div>
          <div>
            <div className="border-t border-slate-500 pt-1.5 text-slate-950 font-black">স্বত্বাধিকারী / কর্তৃপক্ষ</div>
            <span className="text-[10px] text-slate-500 font-normal">Authorized Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};
