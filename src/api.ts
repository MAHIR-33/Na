import { Customer, Voucher, VoucherItem, VoucherWithDetails, DashboardStats } from './types';

const API_BASE = '/api';

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}/customers`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function createCustomer(data: { name: string; phone?: string; address?: string }): Promise<Customer> {
  const res = await fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create customer');
  return res.json();
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`${API_BASE}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update customer');
  return res.json();
}

export async function fetchVouchers(filter?: { customerId?: string; search?: string }): Promise<VoucherWithDetails[]> {
  const params = new URLSearchParams();
  if (filter?.customerId) params.append('customerId', filter.customerId);
  if (filter?.search) params.append('search', filter.search);
  const res = await fetch(`${API_BASE}/vouchers?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch vouchers');
  return res.json();
}

export async function fetchNextVoucherNo(): Promise<number> {
  const res = await fetch(`${API_BASE}/vouchers/next-serial`);
  if (!res.ok) throw new Error('Failed to fetch next voucher serial');
  const data = await res.json();
  return data.nextVoucherNo;
}

export async function fetchVoucherById(id: string): Promise<VoucherWithDetails> {
  const res = await fetch(`${API_BASE}/vouchers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch voucher');
  return res.json();
}

export async function createVoucher(
  voucher: Omit<Voucher, 'id' | 'voucherNo' | 'createdAt' | 'updatedAt'>,
  items: Array<Omit<VoucherItem, 'id' | 'voucherId'>>
): Promise<VoucherWithDetails> {
  const res = await fetch(`${API_BASE}/vouchers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voucher, items }),
  });
  if (!res.ok) throw new Error('Failed to create voucher');
  return res.json();
}

export async function updateVoucher(
  id: string,
  voucher: Partial<Voucher>,
  items?: Array<Omit<VoucherItem, 'id' | 'voucherId'>>
): Promise<VoucherWithDetails> {
  const res = await fetch(`${API_BASE}/vouchers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voucher, items }),
  });
  if (!res.ok) throw new Error('Failed to update voucher');
  return res.json();
}

export async function deleteVoucher(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/vouchers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete voucher');
}

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
