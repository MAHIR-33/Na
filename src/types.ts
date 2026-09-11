export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface VoucherItem {
  id: string;
  voucherId?: string;
  bundleCount: number;
  yarnType: string;
  washColorDeduction: number;
  washPowderFee: number;
  firozaHspFee: number;
  firozaRtFee: number;
  ratePerBundle: number;
  totalAmount: number;
  remarks?: string;
}

export type VoucherStatus = 'pending' | 'processing' | 'ready' | 'delivered';

export interface Voucher {
  id: string;
  voucherNo: number;
  date: string;
  customerId: string;
  totalBundles: number;
  grossAmount: number;
  totalDeduction: number;
  netAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: VoucherStatus;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherWithDetails extends Voucher {
  customer: Customer;
  items: VoucherItem[];
}

export interface DashboardStats {
  totalVouchers: number;
  totalBundles: number;
  totalRevenue: number;
  totalDue: number;
  activeCustomers: number;
  recentVouchers: VoucherWithDetails[];
  statusCounts: Record<VoucherStatus, number>;
}
