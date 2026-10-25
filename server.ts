import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js"; // <-- TAMBAHKAN INI

// ==========================================
// INTERFACE DEFINITIONS
// ==========================================

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  features?: string[];
  image?: string;
  pestTarget?: string;
  formulation?: string;
  packaging?: string;
  price: number;
  stok?: number;
  createdAt?: string;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  author: string;
  category: string;
  image?: string;
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  registeredAt: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Menunggu' | 'Diproses' | 'Dikirim' | 'Selesai';
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  registeredAt: string;
}

interface DbData {
  products: Product[];
  categories: string[];
  customers: Customer[];
  orders: Order[];
  articles: Article[];
  users: User[];
}

// ==========================================
// SUPABASE SETUP
// ==========================================
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (supabase) {
  console.log("✅ Supabase terhubung berhasil!");
} else {
  console.warn("⚠️ Kredensial Supabase tidak ditemukan di .env. Menggunakan fallback db.json lokal.");
}

// ==========================================
// DATABASE HELPERS (Fallback)
// ==========================================

const DB_PATH = path.join(process.cwd(), "db.json");

function readDb(): DbData {
  try {
    if (!fs.existsSync(DB_PATH)) {
      throw new Error("db.json not found");
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as DbData;
  } catch (error) {
    return { products: [], categories: [], customers: [], orders: [], articles: [], users: [] };
  }
}

function writeDb(data: DbData) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to database", error);
  }
}

// ==========================================
// HELPER: GENERATE DESKRIPSI PRODUK
// ==========================================

function generateProductDescription(product: {
  name: string;
  category: string;
  description?: string;
  features?: string[];
  pestTarget?: string;
  formulation?: string;
  packaging?: string;
}): string {
  const { name, category, description, features, pestTarget } = product;
  let structuredDesc = '';

  // Section 1: Apa itu produk
  structuredDesc += `**APA ITU ${name.toUpperCase()}?**\n\n`;
  structuredDesc += description 
    ? `${description}\n\n` 
    : `${name} adalah produk ${category.toLowerCase()} berkualitas tinggi dari CV Tani Makmur Bersama.\n\n`;

  // Section 2: Panduan penggunaan
  structuredDesc += `**PANDUAN & CARA PENGGUNAAN**\n\n`;
  if (features && features.length > 0) {
    features.forEach((feat, idx) => {
      structuredDesc += `${idx + 1}. ${feat}\n`;
    });
  } else {
    structuredDesc += `1. Baca label dan petunjuk pemakaian\n`;
    structuredDesc += `2. Gunakan alat pelindung diri (APD)\n`;
    structuredDesc += `3. Aplikasikan sesuai dosis yang dianjurkan\n`;
  }
  structuredDesc += `\n`;

  // Section 3: Cocok diaplikasikan pada
  structuredDesc += `**COCOK DIAPLIKASIKAN PADA**\n\n`;
  if (pestTarget) {
    const pests = pestTarget.split(',').map(p => p.trim());
    pests.forEach(pest => {
      structuredDesc += `✓ ${pest}\n`;
    });
  } else {
    structuredDesc += `✓ Berbagai jenis hama sesuai kategori (${category})\n`;
  }
  structuredDesc += `\n`;

  // Section 4: Keunggulan
  structuredDesc += `**KEUNGGULAN PRODUK**\n\n`;
  structuredDesc += `✓ Efek ampuh dan terbukti membasmi hama secara efektif\n`;
  structuredDesc += `✓ Daya kerja cepat dan tahan lama\n`;
  structuredDesc += `✓ Aman untuk tanaman dan lingkungan sekitar\n`;
  structuredDesc += `✓ Mudah digunakan dan diaplikasikan\n`;
  structuredDesc += `✓ Kualitas original dengan efek tahan lama\n\n`;

  // Section 5: Tips penggunaan aman
  structuredDesc += `**TIPS PENGGUNAAN AMAN**\n\n`;
  structuredDesc += `✓ Gunakan alat pelindung diri lengkap\n`;
  structuredDesc += `✓ Hindari kontak langsung dengan kulit dan mata\n`;
  structuredDesc += `✓ Simpan produk di tempat sejuk dan kering\n`;
  structuredDesc += `✓ Gunakan sesuai petunjuk dan dosis yang dianjurkan\n\n`;

  // Section 6: Alasan membeli
  structuredDesc += `**ALASAN MEMBELI DI CV TANI MAKMUR BERSAMA**\n\n`;
  structuredDesc += `Sebagai distributor pest control terpercaya di Indonesia, kami selalu mengutamakan kualitas produk dan kepuasan pelanggan.\n\n`;
  structuredDesc += `✓ Produk 100% original dan berkualitas\n`;
  structuredDesc += `✓ Harga distributor langsung\n`;
  structuredDesc += `✓ Konsultasi GRATIS sebelum pembelian\n`;
  structuredDesc += `✓ Pengiriman cepat dan aman\n`;
  structuredDesc += `✓ Melayani pembelian eceran maupun partai besar\n`;
  structuredDesc += `✓ Pengalaman lebih dari 10 tahun di bidang pest control\n\n`;

  // Section 7: Pengiriman
  structuredDesc += `**MELAYANI PENGIRIMAN KE SELURUH INDONESIA**\n\n`;
  structuredDesc += `Kami melayani pengiriman ke berbagai kota di Indonesia seperti:\n`;
  structuredDesc += `Jakarta, Bandung, Surabaya, Medan, Makassar, Semarang, Yogyakarta, Denpasar, Mataram, Kupang, Jayapura, Ambon, Manado, Gorontalo, Palu, Kendari, Balikpapan, Samarinda, Banjarmasin, Pontianak, Palembang, Lampung, Pekanbaru, Batam, Padang, Jambi, Bengkulu, Aceh, Bogor, Depok, Tangerang, Bekasi, Cirebon, Tasikmalaya, Garut, Sukabumi, Serang, Cilegon, Malang, Kediri, Blitar, Jember, Banyuwangi, Probolinggo, Pasuruan, Gresik, Sidoarjo, Solo, Purwokerto, Tegal, Dumai, Tarakan, Sorong, Ternate, Pangkal Pinang, dan kota-kota lainnya di seluruh Nusantara.`;

  return structuredDesc;
}

// ==========================================
// SERVER SETUP
// ==========================================

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3001; // <-- UBAH PORT DEFAULT JADI 3001

  app.use(express.json());

  // ==========================================
  // MODULE: PRODUCTS (Updated to use Supabase)
  // ==========================================

  app.get("/api/products", async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error("Supabase fetch error:", error);
        return res.status(500).json({ error: "Gagal memuat produk dari database" });
      }
      return res.json(data);
    }
    const db = readDb();
    res.json(db.products);
  });

  app.get("/api/products/:id", async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
      if (error || !data) return res.status(404).json({ error: "Produk tidak ditemukan" });
      return res.json(data);
    }
    const db = readDb();
    const product = db.products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json(product);
  });

  app.post("/api/products", async (req, res) => {
    try {
      const { name, category, description, price, stok, features, image, pestTarget, formulation, packaging } = req.body;
      const missingFields = [];
      if (!name || name.trim() === "") missingFields.push("name");
      if (!category || category.trim() === "") missingFields.push("category");
      if (price === undefined || price === null || price === "") missingFields.push("price");

      if (missingFields.length > 0) {
        return res.status(400).json({ error: `Field berikut wajib diisi: ${missingFields.join(", ")}` });
      }

      const id = req.body.id || `product-${Date.now()}`;
      const finalDescription = generateProductDescription({ name: name.trim(), category: category.trim(), description, features, pestTarget, formulation, packaging });

      const newProduct = {
        id,
        name: name.trim(),
        category: category.trim(),
        description: finalDescription,
        price: Number(price),
        stok: stok !== undefined ? Number(stok) : 50,
        features: Array.isArray(features) ? features : [],
        image: image || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600",
        pest_target: pestTarget || "", // Map ke kolom pest_target di Supabase
        formulation: formulation || "",
        packaging: packaging || "1 Liter",
        created_at: new Date().toISOString()
      };

      if (supabase) {
        const { data, error } = await supabase.from('products').insert([newProduct]).select();
        if (error) {
          console.error("Supabase insert error:", error);
          return res.status(500).json({ error: "Gagal menyimpan produk ke database", details: error.message });
        }
        return res.status(201).json({ success: true, message: "Produk berhasil ditambahkan", data: data[0] });
      }

      // Fallback ke db.json
      const db = readDb();
      if (db.products.some((p) => p.id === id)) return res.status(400).json({ error: `ID produk "${id}" sudah ada` });
      db.products.push(newProduct);
      writeDb(db);
      res.status(201).json({ success: true, message: "Produk berhasil ditambahkan", data: newProduct });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Terjadi kesalahan server", details: errMsg });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    if (supabase) {
      const { price, stok, name, category, description, features, image, pestTarget, formulation, packaging } = req.body;
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (category !== undefined) updateData.category = category;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = Number(price);
      if (stok !== undefined) updateData.stok = Number(stok);
      if (features !== undefined) updateData.features = features;
      if (image !== undefined) updateData.image = image;
      if (pestTarget !== undefined) updateData.pest_target = pestTarget;
      if (formulation !== undefined) updateData.formulation = formulation;
      if (packaging !== undefined) updateData.packaging = packaging;
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase.from('products').update(updateData).eq('id', req.params.id).select();
      if (error || !data || data.length === 0) return res.status(404).json({ error: "Produk tidak ditemukan atau gagal diupdate" });
      return res.json(data[0]);
    }

    // Fallback ke db.json
    const db = readDb();
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Produk tidak ditemukan" });
    const updatedProduct = { ...db.products[index], ...req.body, id: db.products[index].id };
    if (req.body.price !== undefined) updatedProduct.price = Number(req.body.price);
    if (req.body.stok !== undefined) updatedProduct.stok = Number(req.body.stok);
    db.products[index] = updatedProduct;
    writeDb(db);
    res.json(updatedProduct);
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', req.params.id);
      if (error) return res.status(500).json({ error: "Gagal menghapus produk", details: error.message });
      return res.json({ message: `Produk dengan ID ${req.params.id} berhasil dihapus` });
    }
    const db = readDb();
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Produk tidak ditemukan" });
    db.products.splice(index, 1);
    writeDb(db);
    res.json({ message: `Produk dengan ID ${req.params.id} berhasil dihapus` });
  });

  // ==========================================
  // MODULE: CATEGORIES, CUSTOMERS, ORDERS, ARTICLES, AUTH
  // (Tetap menggunakan db.json sebagai fallback, bisa diupgrade ke Supabase nanti)
  // ==========================================

  app.get("/api/categories", (req, res) => { const db = readDb(); res.json(db.categories); });
  app.post("/api/categories", (req, res) => {
    const db = readDb(); const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nama kategori wajib diisi" });
    if (db.categories.includes(name)) return res.status(400).json({ error: "Kategori tersebut sudah ada" });
    db.categories.push(name); writeDb(db); res.status(201).json({ message: "Kategori berhasil ditambahkan", category: name });
  });
  app.delete("/api/categories", (req, res) => {
    const db = readDb(); if (db.categories.length === 0) return res.status(404).json({ error: "Tidak ada kategori" });
    db.categories = []; writeDb(db); res.json({ message: "Semua kategori terhapus" });
  });
  app.delete("/api/categories/:name", (req, res) => {
    const db = readDb(); const categoryName = decodeURIComponent(req.params.name);
    const index = db.categories.findIndex((cat) => cat === categoryName);
    if (index === -1) return res.status(404).json({ error: `Kategori "${categoryName}" tidak ditemukan` });
    db.categories.splice(index, 1); writeDb(db); res.json({ message: `Kategori "${categoryName}" berhasil dihapus` });
  });

  app.get("/api/customers", (req, res) => { const db = readDb(); res.json(db.customers); });
  app.get("/api/customers/:id", (req, res) => {
    const db = readDb(); const customer = db.customers.find((c) => c.id === req.params.id);
    if (!customer) return res.status(404).json({ error: "Data pelanggan tidak ditemukan" });
    res.json(customer);
  });
  app.post("/api/customers", (req, res) => {
    const db = readDb(); const { name, phone, address } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Nama & Nomor telepon wajib diisi" });
    const id = req.body.id || `cust-${Date.now()}`;
    const newCustomer: Customer = { id, name, phone, address: address || "", registeredAt: new Date().toISOString() };
    db.customers.push(newCustomer); writeDb(db); res.status(201).json(newCustomer);
  });
  app.delete("/api/customers/:id", (req, res) => {
    const db = readDb(); const index = db.customers.findIndex((c) => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Pelanggan tidak ditemukan" });
    db.customers.splice(index, 1); writeDb(db); res.json({ success: true, message: "Pelanggan berhasil dihapus" });
  });

  app.post("/api/orders", (req, res) => {
    try {
      const db = readDb(); const { customerId, items } = req.body;
      if (!customerId || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Field customerId & items wajib disediakan" });
      const user = db.users.find((u) => u.id === customerId);
      if (!user) return res.status(404).json({ error: "User tidak ditemukan." });
      let customer = db.customers.find((c) => c.id === customerId);
      if (!customer) {
        customer = { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address || "", registeredAt: user.registeredAt };
        db.customers.push(customer);
      }
      let totalAmount = 0; const processedItems: OrderItem[] = [];
      for (const item of items) {
        const product = db.products.find((p) => p.id === item.productId);
        if (!product) return res.status(404).json({ error: `Produk ${item.productId} tidak ditemukan` });
        const quantity = Number(item.quantity) || 1;
        if (product.stok !== undefined && product.stok < quantity) return res.status(400).json({ error: `Stok ${product.name} tidak cukup` });
        if (product.stok !== undefined) product.stok -= quantity;
        totalAmount += product.price * quantity;
        processedItems.push({ productId: product.id, name: product.name, price: product.price, quantity });
      }
      const newOrder: Order = {
        id: `ord-${Date.now()}`, customerId: customer.id, customerName: customer.name,
        customerEmail: customer.email || user.email, customerPhone: customer.phone || user.phone,
        shippingAddress: customer.address || user.address || "Alamat belum diisi",
        items: processedItems, totalAmount, status: "Menunggu", createdAt: new Date().toISOString()
      };
      db.orders.push(newOrder); writeDb(db);
      res.status(201).json({ success: true, message: "Pesanan berhasil dibuat", data: newOrder });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Terjadi kesalahan server", details: errMsg });
    }
  });

  app.get("/api/orders", (req, res) => { const db = readDb(); res.json(db.orders); });
  app.get("/api/orders/:id", (req, res) => {
    const db = readDb(); const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    res.json(order);
  });
  app.patch("/api/orders/:id/status", (req, res) => {
    const db = readDb(); const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    const { status } = req.body;
    const allowedStatuses: Order['status'][] = ["Menunggu", "Diproses", "Dikirim", "Selesai"];
    if (!status || !allowedStatuses.includes(status as Order['status'])) return res.status(400).json({ error: "Status tidak valid" });
    order.status = status as Order['status']; writeDb(db); res.json(order);
  });
  app.delete("/api/orders/:id", (req, res) => {
    const db = readDb(); const index = db.orders.findIndex((o) => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    db.orders.splice(index, 1); writeDb(db); res.json({ success: true, message: "Pesanan berhasil dihapus" });
  });

  app.get("/api/articles", (req, res) => { const db = readDb(); res.json(db.articles); });
  app.get("/api/articles/:id", (req, res) => {
    const db = readDb(); const article = db.articles.find((a) => a.id === req.params.id);
    if (!article) return res.status(404).json({ error: "Artikel tidak ditemukan" });
    res.json(article);
  });
  app.post("/api/articles", (req, res) => {
    const db = readDb(); const { title, summary, content, author, category, image } = req.body;
    if (!title || !content || !author) return res.status(400).json({ error: "Field title, content & author wajib diisi" });
    const id = req.body.id || `tips-${Date.now()}`;
    const newArticle: Article = {
      id, title, summary: summary || (content.length > 100 ? content.slice(0, 97) + "..." : content),
      content, publishedAt: new Date().toLocaleDateString("id-ID", { year: 'numeric', month: '2-digit', day: '2-digit' }),
      author, category: category || "Artikel Edukasi", image: image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600"
    };
    db.articles.push(newArticle); writeDb(db); res.status(201).json(newArticle);
  });
  app.delete("/api/articles/:id", (req, res) => {
    const db = readDb(); const index = db.articles.findIndex((a) => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Artikel tidak ditemukan" });
    db.articles.splice(index, 1); writeDb(db); res.json({ message: `Artikel dengan ID ${req.params.id} berhasil dihapus` });
  });

  app.post("/api/auth/register", (req, res) => {
    try {
      const db = readDb(); const { name, email, phone, password } = req.body;
      if (!name || !email || !phone || !password) return res.status(400).json({ error: "Semua field wajib diisi" });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return res.status(400).json({ error: "Format email tidak valid" });
      if (password.length < 6) return res.status(400).json({ error: "Password minimal 6 karakter" });
      if (db.users.some((u) => u.email === email.toLowerCase())) return res.status(400).json({ error: "Email sudah terdaftar" });
      const newUser: User = { id: `user-${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), phone, password, address: "", registeredAt: new Date().toISOString() };
      const newCustomer: Customer = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, address: "", registeredAt: newUser.registeredAt };
      db.users.push(newUser); db.customers.push(newCustomer); writeDb(db);
      res.status(201).json({ success: true, message: "Registrasi berhasil!", data: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, registeredAt: newUser.registeredAt } });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Terjadi kesalahan server", details: errMsg });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const db = readDb(); const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: "Email dan password wajib diisi" });
      const user = db.users.find((u) => u.email === email.toLowerCase());
      if (!user) return res.status(401).json({ error: "Email tidak terdaftar" });
      if (user.password !== password) return res.status(401).json({ error: "Password salah" });
      const customer = db.customers.find((c) => c.id === user.id);
      res.json({ success: true, message: "Login berhasil!", data: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: customer?.address || user.address || "", registeredAt: user.registeredAt } });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Terjadi kesalahan server", details: errMsg });
    }
  });

  app.get("/api/users", (req, res) => { const db = readDb(); res.json(db.users.map(({ password, ...user }) => user)); });
  app.get("/api/users/:id", (req, res) => {
    const db = readDb(); const user = db.users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    const { password, ...userWithoutPassword } = user; res.json(userWithoutPassword);
  });
  app.put("/api/users/:id", (req, res) => {
    try {
      const db = readDb(); const index = db.users.findIndex((u) => u.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: "User tidak ditemukan" });
      const { name, email, phone, address, newPassword } = req.body;
      if (!name || !email || !phone) return res.status(400).json({ error: "Name, email, dan phone wajib diisi" });
      const existingUser = db.users.find((u) => u.email === email.toLowerCase() && u.id !== req.params.id);
      if (existingUser) return res.status(400).json({ error: "Email sudah digunakan user lain" });
      const updatedUser: User = { ...db.users[index], name: name.trim(), email: email.trim().toLowerCase(), phone, address: address || "", ...(newPassword && { password: newPassword }) };
      db.users[index] = updatedUser;
      const customerIndex = db.customers.findIndex((c) => c.id === req.params.id);
      if (customerIndex !== -1) db.customers[customerIndex] = { ...db.customers[customerIndex], name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, address: updatedUser.address };
      writeDb(db); const { password, ...userWithoutPassword } = updatedUser;
      res.json({ success: true, message: "Profil berhasil diupdate", data: userWithoutPassword });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Terjadi kesalahan server", details: errMsg });
    }
  });
  app.delete("/api/users/:id", (req, res) => {
    try {
      const db = readDb(); const index = db.users.findIndex((u) => u.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: "User tidak ditemukan" });
      db.users.splice(index, 1);
      const customerIndex = db.customers.findIndex((c) => c.id === req.params.id);
      if (customerIndex !== -1) db.customers.splice(customerIndex, 1);
      writeDb(db); res.json({ success: true, message: "Akun berhasil dihapus" });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Terjadi kesalahan server", details: errMsg });
    }
  });

  // ==========================================
  // VITE & STATIC FILES
  // ==========================================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [FULL-STACK] Server listening on http://localhost:${PORT}`);
    console.log(`📁 [INFO] Database: ${DB_PATH}`);
    console.log(`🔌 [INFO] Total endpoints: 31`);
  });
}

startServer();