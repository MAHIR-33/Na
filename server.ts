import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  getVouchers,
  getVoucherById,
  getNextVoucherNo,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getStats,
} from './server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/customers', (_req, res) => {
    res.json(getCustomers());
  });

  app.post('/api/customers', (req, res) => {
    const { name, phone, address } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const customer = createCustomer({ name, phone: phone || '', address: address || '' });
    res.status(201).json(customer);
  });

  app.put('/api/customers/:id', (req, res) => {
    const updated = updateCustomer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json(updated);
  });

  app.get('/api/vouchers', (req, res) => {
    const customerId = req.query.customerId as string | undefined;
    const search = req.query.search as string | undefined;
    res.json(getVouchers({ customerId, search }));
  });

  app.get('/api/vouchers/next-serial', (_req, res) => {
    res.json({ nextVoucherNo: getNextVoucherNo() });
  });

  app.get('/api/vouchers/:id', (req, res) => {
    const voucher = getVoucherById(req.params.id);
    if (!voucher) return res.status(404).json({ error: 'Voucher not found' });
    res.json(voucher);
  });

  app.post('/api/vouchers', (req, res) => {
    const { voucher, items } = req.body;
    if (!voucher || !voucher.customerId) {
      return res.status(400).json({ error: 'Valid voucher data and customer are required' });
    }
    const created = createVoucher(voucher, items || []);
    res.status(201).json(created);
  });

  app.put('/api/vouchers/:id', (req, res) => {
    const { voucher, items } = req.body;
    const updated = updateVoucher(req.params.id, voucher, items);
    if (!updated) return res.status(404).json({ error: 'Voucher not found' });
    res.json(updated);
  });

  app.delete('/api/vouchers/:id', (req, res) => {
    const success = deleteVoucher(req.params.id);
    if (!success) return res.status(404).json({ error: 'Voucher not found' });
    res.json({ success: true });
  });

  app.get('/api/stats', (_req, res) => {
    res.json(getStats());
  });

  // Frontend integration: Vite middleware in dev, static files in prod
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
