import React, { useEffect } from 'react';
import { VoucherWithDetails } from '../types';
import { PrintableVoucher } from './PrintableVoucher';

interface VoucherPrintModalProps {
  voucher: VoucherWithDetails | null;
  onClose: () => void;
}

export const VoucherPrintModal: React.FC<VoucherPrintModalProps> = ({ voucher, onClose }) => {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!voucher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xs print:p-0 print:bg-transparent print:static">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-transparent print:max-h-none print:overflow-visible">
        <PrintableVoucher voucher={voucher} onClose={onClose} />
      </div>
    </div>
  );
};
