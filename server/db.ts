import { Customer, Voucher, VoucherItem, VoucherWithDetails, DashboardStats } from '../src/types';

// Initial Mock / Pre-seeded Database
let customers: Customer[] = [
  {
    id: 'cust-1',
    name: 'হাজী মোঃ রফিকুল ইসলাম',
    phone: '01711-234567',
    address: 'টানবাজার, নারায়ণগঞ্জ',
    createdAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'cust-2',
    name: 'মেসার্স ভাই ভাই টেক্সটাইল ট্রেডার্স (স্বত্বাধিকারী: মোঃ আলমগীর)',
    phone: '01819-876543',
    address: 'বাবুরহাট, মাধবদী, নরসিংদী',
    createdAt: '2026-08-15T11:30:00.000Z',
  },
  {
    id: 'cust-3',
    name: 'শাহ সুফি ইয়ার্ন হাউস (মোঃ কামাল হোসেন)',
    phone: '01912-345678',
    address: 'নয়ামাটি, নারায়ণগঞ্জ',
    createdAt: '2026-08-20T14:15:00.000Z',
  },
  {
    id: 'cust-4',
    name: 'বিসমিল্লাহ উইভিং অ্যান্ড প্রসেসিং',
    phone: '01678-901234',
    address: 'আড়াইহাজার, নারায়ণগঞ্জ',
    createdAt: '2026-09-01T09:00:00.000Z',
  },
];

let vouchers: Voucher[] = [
  {
    id: 'vouch-1001',
    voucherNo: 1001,
    date: '2026-09-02',
    customerId: 'cust-1',
    totalBundles: 45,
    grossAmount: 18000,
    totalDeduction: 1200,
    netAmount: 16800,
    paidAmount: 15000,
    dueAmount: 1800,
    status: 'delivered',
    deliveryDate: '2026-09-05',
    notes: 'মার্সারাইজড ওয়াশ সম্পন্ন, ডেলিভারি রিসিভড।',
    createdAt: '2026-09-02T11:00:00.000Z',
    updatedAt: '2026-09-05T16:00:00.000Z',
  },
  {
    id: 'vouch-1002',
    voucherNo: 1002,
    date: '2026-09-05',
    customerId: 'cust-2',
    totalBundles: 60,
    grossAmount: 27000,
    totalDeduction: 1500,
    netAmount: 25500,
    paidAmount: 20000,
    dueAmount: 5500,
    status: 'ready',
    deliveryDate: '2026-09-08',
    notes: 'কুড়া পঃ ও এইচ.এস.পি ফিনিশিং ওকে। ৩ দিনের মধ্যে ডেলিভারি নিতে হবে।',
    createdAt: '2026-09-05T09:30:00.000Z',
    updatedAt: '2026-09-07T14:20:00.000Z',
  },
  {
    id: 'vouch-1003',
    voucherNo: 1003,
    date: '2026-09-08',
    customerId: 'cust-3',
    totalBundles: 30,
    grossAmount: 13500,
    totalDeduction: 900,
    netAmount: 12600,
    paidAmount: 12600,
    dueAmount: 0,
    status: 'processing',
    deliveryDate: '2026-09-12',
    notes: 'ফুল পেইড। ধোলাই ফ্লোরে চলমান।',
    createdAt: '2026-09-08T10:45:00.000Z',
    updatedAt: '2026-09-08T10:45:00.000Z',
  },
  {
    id: 'vouch-1004',
    voucherNo: 1004,
    date: '2026-09-10',
    customerId: 'cust-1',
    totalBundles: 50,
    grossAmount: 22500,
    totalDeduction: 1500,
    netAmount: 21000,
    paidAmount: 10000,
    dueAmount: 11000,
    status: 'pending',
    deliveryDate: '2026-09-14',
    notes: 'নতুন লট গ্রহণ করা হয়েছে।',
    createdAt: '2026-09-10T13:20:00.000Z',
    updatedAt: '2026-09-10T13:20:00.000Z',
  },
];

let voucherItems: VoucherItem[] = [
  // 1001
  {
    id: 'item-1001-1',
    voucherId: 'vouch-1001',
    bundleCount: 25,
    yarnType: '২৮/১ কটন (সুতি সুতা)',
    washColorDeduction: 20,
    washPowderFee: 400,
    firozaHspFee: 0,
    firozaRtFee: 0,
    ratePerBundle: 400,
    totalAmount: 10000,
    remarks: 'হোয়াইট ওয়াশ',
  },
  {
    id: 'item-1001-2',
    voucherId: 'vouch-1001',
    bundleCount: 20,
    yarnType: '৩২/১ পিসি (PC Yarn)',
    washColorDeduction: 35,
    washPowderFee: 350,
    firozaHspFee: 50,
    firozaRtFee: 0,
    ratePerBundle: 400,
    totalAmount: 8000,
    remarks: 'রং বাদ এডজাস্টেড',
  },

  // 1002
  {
    id: 'item-1002-1',
    voucherId: 'vouch-1002',
    bundleCount: 30,
    yarnType: '৪০/১ কম্বড ইয়ার্ন (Combed Yarn)',
    washColorDeduction: 25,
    washPowderFee: 450,
    firozaHspFee: 45,
    firozaRtFee: 30,
    ratePerBundle: 450,
    totalAmount: 13500,
    remarks: 'এইচ.এস.পি ফিনিশ',
  },
  {
    id: 'item-1002-2',
    voucherId: 'vouch-1002',
    bundleCount: 30,
    yarnType: '২৪/২ স্পান (Spun Yarn)',
    washColorDeduction: 25,
    washPowderFee: 450,
    firozaHspFee: 0,
    firozaRtFee: 50,
    ratePerBundle: 450,
    totalAmount: 13500,
    remarks: 'আর.টি. ফিনিশ স্পেশাল',
  },

  // 1003
  {
    id: 'item-1003-1',
    voucherId: 'vouch-1003',
    bundleCount: 30,
    yarnType: '২৬/১ কটন অটো কোন (Auto Cone)',
    washColorDeduction: 30,
    washPowderFee: 420,
    firozaHspFee: 30,
    firozaRtFee: 0,
    ratePerBundle: 450,
    totalAmount: 13500,
    remarks: 'হাই স্পিড প্রসেসিং',
  },

  // 1004
  {
    id: 'item-1004-1',
    voucherId: 'vouch-1004',
    bundleCount: 50,
    yarnType: '৩৪/১ কটন সিল্ক টাচ',
    washColorDeduction: 30,
    washPowderFee: 420,
    firozaHspFee: 30,
    firozaRtFee: 0,
    ratePerBundle: 450,
    totalAmount: 22500,
    remarks: 'অগ্রিম জমা ১০,০০০/-',
  },
];

export function getCustomers(): Customer[] {
  return [...customers].sort((a, b) => a.name.localeCompare(b.name, 'bn'));
}

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function createCustomer(data: Omit<Customer, 'id' | 'createdAt'>): Customer {
  const newCust: Customer = {
    id: `cust-${Date.now()}`,
    name: data.name.trim(),
    phone: data.phone.trim(),
    address: data.address.trim(),
    createdAt: new Date().toISOString(),
  };
  customers.push(newCust);
  return newCust;
}

export function updateCustomer(id: string, data: Partial<Customer>): Customer | undefined {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  customers[index] = { ...customers[index], ...data };
  return customers[index];
}

export function getNextVoucherNo(): number {
  if (vouchers.length === 0) return 1001;
  const max = Math.max(...vouchers.map((v) => v.voucherNo));
  return max + 1;
}

export function getVouchers(filter?: { customerId?: string; search?: string }): VoucherWithDetails[] {
  let list = [...vouchers];

  if (filter?.customerId) {
    list = list.filter((v) => v.customerId === filter.customerId);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter((v) => {
      const cust = customers.find((c) => c.id === v.customerId);
      const custName = (cust?.name || '').toLowerCase();
      const vNo = v.voucherNo.toString();
      const date = v.date;
      return custName.includes(q) || vNo.includes(q) || date.includes(q);
    });
  }

  // Sort descending by voucherNo
  list.sort((a, b) => b.voucherNo - a.voucherNo);

  return list.map((v) => {
    const customer = customers.find((c) => c.id === v.customerId) || {
      id: v.customerId,
      name: 'Unknown Customer',
      phone: '',
      address: '',
      createdAt: v.createdAt,
    };
    const items = voucherItems.filter((i) => i.voucherId === v.id);
    return {
      ...v,
      customer,
      items,
    };
  });
}

export function getVoucherById(id: string): VoucherWithDetails | undefined {
  const voucher = vouchers.find((v) => v.id === id || v.voucherNo.toString() === id);
  if (!voucher) return undefined;

  const customer = customers.find((c) => c.id === voucher.customerId) || {
    id: voucher.customerId,
    name: 'Unknown Customer',
    phone: '',
    address: '',
    createdAt: voucher.createdAt,
  };
  const items = voucherItems.filter((i) => i.voucherId === voucher.id);

  return {
    ...voucher,
    customer,
    items,
  };
}

export function createVoucher(
  voucherData: Omit<Voucher, 'id' | 'voucherNo' | 'createdAt' | 'updatedAt'>,
  itemsData: Array<Omit<VoucherItem, 'id' | 'voucherId'>>
): VoucherWithDetails {
  const nextNo = getNextVoucherNo();
  const voucherId = `vouch-${nextNo}`;
  const now = new Date().toISOString();

  const newVoucher: Voucher = {
    ...voucherData,
    id: voucherId,
    voucherNo: nextNo,
    createdAt: now,
    updatedAt: now,
  };

  vouchers.push(newVoucher);

  const createdItems: VoucherItem[] = itemsData.map((item, idx) => {
    const newItem: VoucherItem = {
      ...item,
      id: `item-${nextNo}-${idx + 1}`,
      voucherId,
    };
    voucherItems.push(newItem);
    return newItem;
  });

  const customer = customers.find((c) => c.id === newVoucher.customerId) || {
    id: newVoucher.customerId,
    name: 'Unknown Customer',
    phone: '',
    address: '',
    createdAt: now,
  };

  return {
    ...newVoucher,
    customer,
    items: createdItems,
  };
}

export function updateVoucher(
  id: string,
  voucherData: Partial<Voucher>,
  itemsData?: Array<Omit<VoucherItem, 'id' | 'voucherId'>>
): VoucherWithDetails | undefined {
  const index = vouchers.findIndex((v) => v.id === id);
  if (index === -1) return undefined;

  const existing = vouchers[index];
  const updated: Voucher = {
    ...existing,
    ...voucherData,
    id: existing.id,
    voucherNo: existing.voucherNo, // preserve serial
    updatedAt: new Date().toISOString(),
  };

  vouchers[index] = updated;

  if (itemsData) {
    // remove old items
    voucherItems = voucherItems.filter((i) => i.voucherId !== id);
    // add updated items
    itemsData.forEach((item, idx) => {
      voucherItems.push({
        ...item,
        id: `item-${existing.voucherNo}-${idx + 1}-${Date.now()}`,
        voucherId: id,
      });
    });
  }

  return getVoucherById(id);
}

export function deleteVoucher(id: string): boolean {
  const initialLen = vouchers.length;
  vouchers = vouchers.filter((v) => v.id !== id);
  voucherItems = voucherItems.filter((i) => i.voucherId !== id);
  return vouchers.length < initialLen;
}

export function getStats(): DashboardStats {
  const totalVouchers = vouchers.length;
  const totalBundles = vouchers.reduce((sum, v) => sum + (v.totalBundles || 0), 0);
  const totalRevenue = vouchers.reduce((sum, v) => sum + (v.netAmount || 0), 0);
  const totalDue = vouchers.reduce((sum, v) => sum + (v.dueAmount || 0), 0);
  const activeCustomers = new Set(vouchers.map((v) => v.customerId)).size;

  const statusCounts: Record<string, number> = {
    pending: 0,
    processing: 0,
    ready: 0,
    delivered: 0,
  };
  vouchers.forEach((v) => {
    if (statusCounts[v.status] !== undefined) {
      statusCounts[v.status]++;
    }
  });

  const recent = getVouchers().slice(0, 5);

  return {
    totalVouchers,
    totalBundles,
    totalRevenue,
    totalDue,
    activeCustomers,
    recentVouchers: recent,
    statusCounts: statusCounts as Record<'pending' | 'processing' | 'ready' | 'delivered', number>,
  };
}
