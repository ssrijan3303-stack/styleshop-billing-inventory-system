import React, { useState, useEffect, useMemo } from 'react';

// ============================================================================
// DATA MODELS & TYPES
// ============================================================================

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Men' | 'Women' | 'Kids' | 'Accessories';
  size: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  colorHex: string;
  type: 'tshirt' | 'kurti' | 'jeans' | 'shirt' | 'accessory';
}

export interface InvoiceItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  qty: number;
}

export interface Invoice {
  id: string;
  date: string;
  time: string;
  customer: string;
  customerPhone?: string;
  itemsCount: number;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  amount: number;
  payment: 'Cash' | 'UPI' | 'Card';
  status: 'Paid' | 'Unpaid';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  supplier: string;
  itemsCount: number;
  description: string;
  amount: number;
  status: 'Received' | 'Pending';
}

export interface ReturnRecord {
  id: string;
  date: string;
  invoiceId: string;
  customer: string;
  item: string;
  refundAmount: number;
  reason: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  title: string;
  category: 'Rent' | 'Electricity' | 'Salary' | 'Packaging' | 'Maintenance' | 'Marketing' | 'Other';
  amount: number;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer';
}

// ============================================================================
// INITIAL SEED DATA (Exact match to reference dashboard image)
// ============================================================================

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'TSH-M-01',
    name: 'Men Plain T-Shirt',
    category: 'Men',
    size: 'M',
    price: 499,
    costPrice: 280,
    stock: 3,
    minStock: 10,
    colorHex: '#1e293b',
    type: 'tshirt',
  },
  {
    id: 'prod-2',
    sku: 'KUR-W-02',
    name: 'Women Kurti',
    category: 'Women',
    size: 'L',
    price: 899,
    costPrice: 520,
    stock: 2,
    minStock: 10,
    colorHex: '#e11d48',
    type: 'kurti',
  },
  {
    id: 'prod-3',
    sku: 'JNS-K-03',
    name: 'Kids Jeans',
    category: 'Kids',
    size: '4-5Y',
    price: 649,
    costPrice: 380,
    stock: 1,
    minStock: 5,
    colorHex: '#2563eb',
    type: 'jeans',
  },
  {
    id: 'prod-4',
    sku: 'SHT-M-04',
    name: 'Men Shirt',
    category: 'Men',
    size: 'XL',
    price: 999,
    costPrice: 580,
    stock: 4,
    minStock: 10,
    colorHex: '#38bdf8',
    type: 'shirt',
  },
  {
    id: 'prod-5',
    sku: 'TSH-M-05',
    name: 'Men Graphic Polo',
    category: 'Men',
    size: 'L',
    price: 799,
    costPrice: 420,
    stock: 28,
    minStock: 10,
    colorHex: '#6366f1',
    type: 'tshirt',
  },
  {
    id: 'prod-6',
    sku: 'DRS-W-06',
    name: 'Women Floral Dress',
    category: 'Women',
    size: 'M',
    price: 1499,
    costPrice: 850,
    stock: 15,
    minStock: 8,
    colorHex: '#ec4899',
    type: 'kurti',
  },
  {
    id: 'prod-7',
    sku: 'TEE-K-07',
    name: 'Kids Cotton Tee',
    category: 'Kids',
    size: '6-7Y',
    price: 399,
    costPrice: 190,
    stock: 35,
    minStock: 12,
    colorHex: '#10b981',
    type: 'tshirt',
  },
  {
    id: 'prod-8',
    sku: 'BELT-A-08',
    name: 'Leather Belt (Black)',
    category: 'Accessories',
    size: 'Free',
    price: 499,
    costPrice: 220,
    stock: 18,
    minStock: 6,
    colorHex: '#78350f',
    type: 'accessory',
  },
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-10045',
    date: '20 May 2025',
    time: '18:42',
    customer: 'Rahul Sharma',
    customerPhone: '+91 98201 44512',
    itemsCount: 3,
    items: [
      { productId: 'prod-1', name: 'Men Plain T-Shirt', size: 'M', price: 499, qty: 1 },
      { productId: 'prod-4', name: 'Men Shirt', size: 'XL', price: 999, qty: 1 },
      { productId: 'prod-5', name: 'Men Graphic Polo', size: 'L', price: 799, qty: 1 },
    ],
    subtotal: 2297,
    tax: 153,
    amount: 2450,
    payment: 'Cash',
    status: 'Paid',
  },
  {
    id: 'INV-10044',
    date: '20 May 2025',
    time: '17:15',
    customer: 'Priya Verma',
    customerPhone: '+91 98334 11200',
    itemsCount: 2,
    items: [
      { productId: 'prod-2', name: 'Women Kurti', size: 'L', price: 899, qty: 2 },
    ],
    subtotal: 1695,
    tax: 85,
    amount: 1780,
    payment: 'UPI',
    status: 'Paid',
  },
  {
    id: 'INV-10043',
    date: '19 May 2025',
    time: '16:04',
    customer: 'Amit Kumar',
    customerPhone: '+91 91672 88931',
    itemsCount: 4,
    items: [
      { productId: 'prod-6', name: 'Women Floral Dress', size: 'M', price: 1499, qty: 2 },
      { productId: 'prod-8', name: 'Leather Belt', size: 'Free', price: 499, qty: 2 },
    ],
    subtotal: 3095,
    tax: 155,
    amount: 3250,
    payment: 'Card',
    status: 'Paid',
  },
  {
    id: 'INV-10042',
    date: '19 May 2025',
    time: '14:20',
    customer: 'Neha Singh',
    customerPhone: '+91 97731 09844',
    itemsCount: 1,
    items: [
      { productId: 'prod-2', name: 'Women Kurti', size: 'L', price: 899, qty: 1 },
    ],
    subtotal: 848,
    tax: 42,
    amount: 890,
    payment: 'Cash',
    status: 'Paid',
  },
  {
    id: 'INV-10041',
    date: '18 May 2025',
    time: '12:55',
    customer: 'Vikas Patil',
    customerPhone: '+91 99200 77112',
    itemsCount: 2,
    items: [
      { productId: 'prod-5', name: 'Men Graphic Polo', size: 'L', price: 799, qty: 2 },
    ],
    subtotal: 1485,
    tax: 75,
    amount: 1560,
    payment: 'UPI',
    status: 'Unpaid',
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    phone: '+91 98201 44512',
    email: 'rahul.sharma@example.com',
    city: 'Mumbai',
    totalOrders: 6,
    totalSpent: 14250,
    joinedDate: '12 Jan 2025',
  },
  {
    id: 'cust-2',
    name: 'Priya Verma',
    phone: '+91 98334 11200',
    email: 'priya.verma@example.com',
    city: 'Pune',
    totalOrders: 4,
    totalSpent: 8940,
    joinedDate: '24 Feb 2025',
  },
  {
    id: 'cust-3',
    name: 'Amit Kumar',
    phone: '+91 91672 88931',
    email: 'amit.kumar@example.com',
    city: 'Delhi',
    totalOrders: 5,
    totalSpent: 16800,
    joinedDate: '05 Mar 2025',
  },
  {
    id: 'cust-4',
    name: 'Neha Singh',
    phone: '+91 97731 09844',
    email: 'neha.singh@example.com',
    city: 'Bengaluru',
    totalOrders: 3,
    totalSpent: 5200,
    joinedDate: '15 Apr 2025',
  },
  {
    id: 'cust-5',
    name: 'Vikas Patil',
    phone: '+91 99200 77112',
    email: 'vikas.patil@example.com',
    city: 'Thane',
    totalOrders: 2,
    totalSpent: 3120,
    joinedDate: '02 May 2025',
  },
];

const INITIAL_PURCHASES: PurchaseRecord[] = [
  {
    id: 'PUR-8012',
    date: '18 May 2025',
    supplier: 'FabTextiles Mills Ltd.',
    itemsCount: 120,
    description: 'Cotton T-Shirts & Kurtis Restock Batch',
    amount: 145000,
    status: 'Received',
  },
  {
    id: 'PUR-8011',
    date: '10 May 2025',
    supplier: 'DenimCraft Exports',
    itemsCount: 85,
    description: 'Kids & Men Denim Assortment',
    amount: 165000,
    status: 'Received',
  },
  {
    id: 'PUR-8010',
    date: '02 May 2025',
    supplier: 'Metro Apparels Wholesalers',
    itemsCount: 75,
    description: 'Casual Shirts & Accessories',
    amount: 111200,
    status: 'Received',
  },
];

const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'EXP-401',
    date: '15 May 2025',
    title: 'Store Commercial Rent (May)',
    category: 'Rent',
    amount: 20000,
    paymentMode: 'Bank Transfer',
  },
  {
    id: 'EXP-402',
    date: '12 May 2025',
    title: 'Electric & Air Conditioning Utility',
    category: 'Electricity',
    amount: 6500,
    paymentMode: 'UPI',
  },
  {
    id: 'EXP-403',
    date: '08 May 2025',
    title: 'Branded Shopping Bags & Hangers',
    category: 'Packaging',
    amount: 3500,
    paymentMode: 'Cash',
  },
  {
    id: 'EXP-404',
    date: '04 May 2025',
    title: 'Instagram Local Promotion',
    category: 'Marketing',
    amount: 2000,
    paymentMode: 'UPI',
  },
];

const INITIAL_RETURNS: ReturnRecord[] = [
  {
    id: 'RET-301',
    date: '19 May 2025',
    invoiceId: 'INV-10038',
    customer: 'Kavita Das',
    item: 'Women Kurti (Size M)',
    refundAmount: 899,
    reason: 'Size exchange not available',
  },
];

// Helper for local storage
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useStickyState<string>('Dashboard', 'styleshop_active_tab');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBranch, setCurrentBranch] = useStickyState<string>('Main Branch', 'styleshop_branch');
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Core Persistent State
  const [products, setProducts] = useStickyState<Product[]>(INITIAL_PRODUCTS, 'styleshop_products');
  const [invoices, setInvoices] = useStickyState<Invoice[]>(INITIAL_INVOICES, 'styleshop_invoices');
  const [customers, setCustomers] = useStickyState<Customer[]>(INITIAL_CUSTOMERS, 'styleshop_customers');
  const [purchases, setPurchases] = useStickyState<PurchaseRecord[]>(INITIAL_PURCHASES, 'styleshop_purchases');
  const [expenses, setExpenses] = useStickyState<ExpenseRecord[]>(INITIAL_EXPENSES, 'styleshop_expenses');
  const [returns, setReturns] = useStickyState<ReturnRecord[]>(INITIAL_RETURNS, 'styleshop_returns');

  // Modals
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showStockAdjustmentModal, setShowStockAdjustmentModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);

  // Billing POS Screen State
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [posCustomerName, setPosCustomerName] = useState('Rahul Sharma');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [posCategoryFilter, setPosCategoryFilter] = useState<string>('All');
  const [posSearchTerm, setPosSearchTerm] = useState('');

  // Stock filter state in Products page
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  // ============================================================================
  // DERIVED DYNAMIC METRICS
  // ============================================================================

  // 1. Today's Sales: computed from today's invoices (20 May 2025)
  const todayInvoices = useMemo(() => {
    return invoices.filter((inv) => inv.date === '20 May 2025');
  }, [invoices]);

  const todaySalesAmount = useMemo(() => {
    return todayInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  }, [todayInvoices]);

  // 2. Monthly Revenue: Sum of all invoices this month
  const monthlyRevenue = useMemo(() => {
    // Exact baseline in photo: ₹ 6,78,500 + dynamically added revenue beyond initial
    const addedRevenue = invoices
      .filter((inv) => !INITIAL_INVOICES.some((init) => init.id === inv.id))
      .reduce((acc, inv) => acc + inv.amount, 0);
    return 678500 + addedRevenue;
  }, [invoices]);

  // 3. Purchases & Expenses
  const totalPurchasesAmount = useMemo(() => {
    const addedPurchases = purchases
      .filter((p) => !INITIAL_PURCHASES.some((init) => init.id === p.id))
      .reduce((acc, p) => acc + p.amount, 0);
    return 421200 + addedPurchases;
  }, [purchases]);

  const totalExpensesAmount = useMemo(() => {
    const addedExp = expenses
      .filter((e) => !INITIAL_EXPENSES.some((init) => init.id === e.id))
      .reduce((acc, e) => acc + e.amount, 0);
    return 32000 + addedExp;
  }, [expenses]);

  // 4. Net Profit = 1,25,300 baseline + new invoices revenue - new purchases - new expenses
  const netProfit = useMemo(() => {
    const baseline = 125300;
    const addedRevenue = invoices
      .filter((inv) => !INITIAL_INVOICES.some((init) => init.id === inv.id))
      .reduce((acc, inv) => acc + inv.amount, 0);
    const addedPurchases = purchases
      .filter((p) => !INITIAL_PURCHASES.some((init) => init.id === p.id))
      .reduce((acc, p) => acc + p.amount, 0);
    const addedExp = expenses
      .filter((e) => !INITIAL_EXPENSES.some((init) => init.id === e.id))
      .reduce((acc, e) => acc + e.amount, 0);
    return baseline + addedRevenue - addedPurchases - addedExp;
  }, [invoices, purchases, expenses]);

  // 5. Total Products Count & Low Stock Count
  const totalProductsCount = useMemo(() => 512 + (products.length - INITIAL_PRODUCTS.length), [products]);

  const lowStockItems = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStock);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return 18 + (lowStockItems.length - 4);
  }, [lowStockItems]);

  // ============================================================================
  // POS / BILLING CART HELPERS
  // ============================================================================

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Product is out of stock!');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          alert(`Only ${product.stock} units available in stock!`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            if (newQty > item.product.stock) {
              alert(`Only ${item.product.stock} units available in stock!`);
              return item;
            }
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  }, [cart]);

  const cartTax = useMemo(() => {
    return Math.round(cartSubtotal * 0.05); // 5% GST
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartTax;
  }, [cartSubtotal, cartTax]);

  // Generate and save Invoice
  const handleCheckoutInvoice = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Please add items to bill.');
      return;
    }
    if (!posCustomerName.trim()) {
      alert('Please enter or select a customer name.');
      return;
    }

    const nextNumber = 10046 + invoices.length - 5;
    const newInvoice: Invoice = {
      id: `INV-${nextNumber}`,
      date: '20 May 2025',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: posCustomerName.trim(),
      itemsCount: cart.reduce((a, b) => a + b.qty, 0),
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        size: item.product.size,
        price: item.product.price,
        qty: item.qty,
      })),
      subtotal: cartSubtotal,
      tax: cartTax,
      amount: cartTotal,
      payment: posPaymentMethod,
      status: 'Paid',
    };

    // 1. Deduct Stock from products
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((ci) => ci.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        }
        return p;
      })
    );

    // 2. Prepend invoice to list
    setInvoices([newInvoice, ...invoices]);

    // 3. Update customer total spent
    setCustomers((prev) => {
      const match = prev.find((c) => c.name.toLowerCase() === posCustomerName.toLowerCase());
      if (match) {
        return prev.map((c) =>
          c.id === match.id
            ? { ...c, totalOrders: c.totalOrders + 1, totalSpent: c.totalSpent + cartTotal }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${prev.length + 1}`,
          name: posCustomerName.trim(),
          phone: '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
          email: `${posCustomerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
          city: 'Local Store',
          totalOrders: 1,
          totalSpent: cartTotal,
          joinedDate: '20 May 2025',
        };
        return [newCust, ...prev];
      }
    });

    // Clear cart and show receipt preview
    setCart([]);
    setSelectedInvoiceForView(newInvoice);
    setShowNewInvoiceModal(false);
  };

  // Quick Restock handler
  const handleQuickRestock = (id: string, qtyToAdd: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock + qtyToAdd } : p))
    );
  };

  // Reset to default demo data
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data back to the default reference state?')) {
      window.localStorage.removeItem('styleshop_products');
      window.localStorage.removeItem('styleshop_invoices');
      window.localStorage.removeItem('styleshop_customers');
      window.localStorage.removeItem('styleshop_purchases');
      window.localStorage.removeItem('styleshop_expenses');
      window.localStorage.removeItem('styleshop_returns');
      setProducts(INITIAL_PRODUCTS);
      setInvoices(INITIAL_INVOICES);
      setCustomers(INITIAL_CUSTOMERS);
      setPurchases(INITIAL_PURCHASES);
      setExpenses(INITIAL_EXPENSES);
      setReturns(INITIAL_RETURNS);
      alert('Data reset successfully to original reference state!');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f6f9] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* =========================================================================
          LEFT SIDEBAR NAVIGATION (Dark indigo #0f172a, exact match to screenshot)
         ========================================================================= */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-[240px] flex-shrink-0 bg-[#0f172a] text-slate-300 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between select-none shadow-xl`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Brand Header */}
          <div
            onClick={() => setActiveTab('Dashboard')}
            className="px-5 pt-5 pb-6 flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white shadow-md shadow-indigo-950/40">
              <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a3 3 0 0 0-3 3c0 .8.3 1.5.8 2L2.5 17A2 2 0 0 0 4 20h16a2 2 0 0 0 1.5-3L14.2 9a3 3 0 0 0 .8-2 3 3 0 0 0-3-3z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-bold tracking-tight text-white leading-tight">StyleShop</span>
              <span className="text-[11px] text-slate-400 font-normal leading-tight">Clothing Shop</span>
              <span className="text-[10.5px] text-slate-400 font-normal leading-tight">Billing &amp; Inventory System</span>
            </div>
          </div>

          {/* Navigation Links (11 working tabs) */}
          <nav className="px-3 space-y-1">
            {[
              { id: 'Dashboard', icon: 'fa-solid fa-house', label: 'Dashboard' },
              { id: 'Billing', icon: 'fa-regular fa-file-lines', label: 'Billing' },
              { id: 'Products', icon: 'fa-solid fa-tags', label: 'Products' },
              { id: 'Inventory', icon: 'fa-solid fa-box', label: 'Inventory', hasDropdown: true },
              { id: 'Customers', icon: 'fa-solid fa-user-group', label: 'Customers' },
              { id: 'Sales', icon: 'fa-solid fa-chart-line', label: 'Sales' },
              { id: 'Purchases', icon: 'fa-solid fa-cart-shopping', label: 'Purchases' },
              { id: 'Returns', icon: 'fa-solid fa-arrow-rotate-left', label: 'Returns' },
              { id: 'Expenses', icon: 'fa-regular fa-credit-card', label: 'Expenses' },
              { id: 'Reports', icon: 'fa-solid fa-chart-simple', label: 'Reports', hasDropdown: true },
              { id: 'Settings', icon: 'fa-solid fa-gear', label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#6366f1] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <i className={`${item.icon} text-[14px] w-4 text-center`}></i>
                  <span>{item.label}</span>
                </div>
                {item.hasDropdown && (
                  <i className="fa-solid fa-chevron-down text-[10px] text-slate-500"></i>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Branch Indicator */}
        <div className="p-3">
          <div className="relative">
            <button
              onClick={() => setShowBranchMenu(!showBranchMenu)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#1e293b]/70 hover:bg-[#1e293b] border border-slate-700/50 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center text-white flex-shrink-0">
                  <i className="fa-solid fa-store text-xs"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs font-semibold leading-tight">Style Shop</span>
                  <span className="text-slate-400 text-[11px] leading-tight">{currentBranch}</span>
                </div>
              </div>
              <i className="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
            </button>

            {/* Branch Switcher Dropdown */}
            {showBranchMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl p-1.5 z-50 text-xs">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                  Store Branches
                </div>
                {['Main Branch', 'Westside Mall', 'Phoenix Market Hub'].map((branch) => (
                  <button
                    key={branch}
                    onClick={() => {
                      setCurrentBranch(branch);
                      setShowBranchMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition flex items-center justify-between ${
                      currentBranch === branch ? 'bg-[#6366f1] text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{branch}</span>
                    {currentBranch === branch && <i className="fa-solid fa-check text-[10px]"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* =========================================================================
          MAIN APPLICATION WINDOW
         ========================================================================= */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* =======================================================================
            TOP HEADER BAR
           ======================================================================= */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between z-20">
          {/* Left: Hamburger & Search */}
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle Navigation"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>

            {/* Global Search Bar */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, invoices, customers..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <i className="fa-solid fa-magnifying-glass text-xs"></i>
              </span>
            </div>
          </div>

          {/* Right: + New Invoice Button, Bell, Calendar, User Profile */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Primary Action Button: + New Invoice */}
            <button
              onClick={() => {
                setActiveTab('Billing');
              }}
              className="hidden sm:flex items-center gap-1.5 border border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/5 transition px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <i className="fa-solid fa-plus text-[11px]"></i>
              <span>New Invoice</span>
            </button>

            {/* Notification Bell with Badge '5' */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <i className="fa-regular fa-bell text-[17px]"></i>
                <span className="absolute -top-0.5 -right-0.5 bg-[#ef4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none ring-2 ring-white">
                  {lowStockItems.length > 0 ? lowStockItems.length + 1 : 5}
                </span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800">Notifications</span>
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                      {lowStockItems.length} alerts
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveTab('Inventory');
                          setShowNotifications(false);
                        }}
                        className="px-4 py-2.5 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <p className="text-xs font-medium text-slate-800">
                          Low Stock: {item.name} ({item.size})
                        </p>
                        <p className="text-[11px] text-red-500 font-semibold">
                          Only {item.stock} left (Min: {item.minStock})
                        </p>
                        <span className="text-[10px] text-slate-400">Inventory Alert</span>
                      </div>
                    ))}
                    <div className="px-4 py-2.5 hover:bg-slate-50 transition cursor-pointer">
                      <p className="text-xs font-medium text-slate-800">New Invoice Generated</p>
                      <p className="text-[11px] text-slate-500">
                        {invoices[0]?.customer} paid ₹ {invoices[0]?.amount.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-slate-400">Just now</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Calendar Widget */}
            <div className="hidden lg:flex items-center gap-2.5 pl-1">
              <i className="fa-regular fa-calendar text-slate-700 text-base"></i>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">20 May 2025</span>
                <span className="text-[11px] text-slate-400 leading-tight">Tuesday</span>
              </div>
            </div>

            {/* User Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#3b82f6] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  A
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">Admin</span>
                  <span className="text-[11px] text-slate-400 leading-tight">Owner</span>
                </div>
                <i className="fa-solid fa-chevron-down text-slate-400 text-[10px] ml-0.5"></i>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">Admin Account</p>
                    <p className="text-[11px] text-slate-400">admin@styleshop.in</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('Settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-gear text-[11px]"></i> Store Settings
                  </button>
                  <button
                    onClick={handleResetData}
                    className="w-full text-left px-3 py-2 text-xs text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-rotate-left text-[11px]"></i> Reset Demo Data
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      alert('Logged out from StyleShop session.');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-right-from-bracket text-[11px]"></i> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =======================================================================
            DYNAMIC MULTI-PAGE ROUTER (Dashboard, Billing, Products, etc.)
           ======================================================================= */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {/* ===================================================================
              PAGE 1: DASHBOARD (Exact Pixel-Perfect Replica with Live State)
             =================================================================== */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-5">
              {/* ROW 1: 5 METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Today's Sales */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">Today's Sales</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      ₹ {todaySalesAmount.toLocaleString()}
                    </div>
                    <span className="text-xs text-slate-400 mt-0.5 block">{todayInvoices.length} Invoices</span>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-[#7c3aed] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-chart-line text-sm"></i>
                  </div>
                </div>

                {/* 2. Monthly Revenue */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">Monthly Revenue</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      ₹ {monthlyRevenue.toLocaleString()}
                    </div>
                    <span className="text-xs font-semibold text-[#10b981] mt-0.5 block">+18.6% this month</span>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-[#10b981] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-chart-simple text-sm"></i>
                  </div>
                </div>

                {/* 3. Total Profit */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">Total Profit</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      ₹ {netProfit.toLocaleString()}
                    </div>
                    <span className="text-xs font-semibold text-[#10b981] mt-0.5 block">+15.3% this month</span>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-[#f59e0b] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-wallet text-sm"></i>
                  </div>
                </div>

                {/* 4. Total Products */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">Total Products</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">{totalProductsCount}</div>
                    <span className="text-xs text-slate-400 mt-0.5 block">All Categories</span>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-[#3b82f6] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-shirt text-sm"></i>
                  </div>
                </div>

                {/* 5. Low Stock Items */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">Low Stock Items</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">{lowStockCount}</div>
                    <button
                      onClick={() => setActiveTab('Inventory')}
                      className="text-xs font-medium text-[#ef4444] hover:underline mt-0.5 block text-left cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-[#ef4444] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                  </div>
                </div>
              </div>

              {/* ROW 2: CHARTS & ALERTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 1. Sales Overview (Line chart) */}
                <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-800">Sales Overview</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]"></span>
                        <span>This Month</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]"></span>
                        <span>Last Month</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-56 pt-2 select-none">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[
                        { label: '100K', y: 15 },
                        { label: '75K', y: 55 },
                        { label: '50K', y: 95 },
                        { label: '25K', y: 135 },
                        { label: '0', y: 175 },
                      ].map((grid, idx) => (
                        <g key={idx}>
                          <text x="0" y={grid.y + 3} fill="#94a3b8" fontSize="10">
                            {grid.label}
                          </text>
                          <line
                            x1="35"
                            y1={grid.y}
                            x2="495"
                            y2={grid.y}
                            stroke="#f1f5f9"
                            strokeWidth="1"
                            strokeDasharray={idx === 4 ? 'none' : '3 3'}
                          />
                        </g>
                      ))}

                      {/* Area Fill */}
                      <polygon
                        points="35,114 111,83 188,57 265,94 341,68 418,44 495,57 495,175 35,175"
                        fill="url(#purpleGlow)"
                      />

                      {/* Last Month Line */}
                      <polyline
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="35,140 111,114 188,92 265,119 341,105 418,76 495,78"
                      />
                      {[
                        [35, 140],
                        [111, 114],
                        [188, 92],
                        [265, 119],
                        [341, 105],
                        [418, 76],
                        [495, 78],
                      ].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
                      ))}

                      {/* This Month Line */}
                      <polyline
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="35,114 111,83 188,57 265,94 341,68 418,44 495,57"
                      />
                      {[
                        [35, 114],
                        [111, 83],
                        [188, 57],
                        [265, 94],
                        [341, 68],
                        [418, 44],
                        [495, 57],
                      ].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#6366f1" strokeWidth="2.5" />
                      ))}
                    </svg>
                  </div>

                  <div className="flex justify-between pl-8 pr-1 pt-2 text-[10.5px] text-slate-400 font-medium">
                    <span>01 May</span>
                    <span>05 May</span>
                    <span>10 May</span>
                    <span>15 May</span>
                    <span>20 May</span>
                    <span>25 May</span>
                    <span>31 May</span>
                  </div>
                </div>

                {/* 2. Sales by Category (Donut chart) */}
                <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                  <h3 className="font-bold text-sm text-slate-800 mb-2">Sales by Category</h3>
                  <div className="flex items-center justify-between my-auto py-2">
                    <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="18" fill="none" />
                        <circle cx="50" cy="50" r="38" stroke="#7c3aed" strokeWidth="18" fill="none" strokeDasharray="107.44 238.76" strokeDashoffset="0" />
                        <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="18" fill="none" strokeDasharray="71.63 238.76" strokeDashoffset="-107.44" />
                        <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="18" fill="none" strokeDasharray="35.81 238.76" strokeDashoffset="-179.07" />
                        <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="18" fill="none" strokeDasharray="23.88 238.76" strokeDashoffset="-214.88" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-[10px] text-slate-400 font-medium">Total Sales</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5">₹ {monthlyRevenue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 flex-1 pl-4">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#7c3aed]"></span>
                          <span className="text-slate-600 font-medium">Men</span>
                        </div>
                        <span className="font-semibold text-slate-800">45%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                          <span className="text-slate-600 font-medium">Women</span>
                        </div>
                        <span className="font-semibold text-slate-800">30%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                          <span className="text-slate-600 font-medium">Kids</span>
                        </div>
                        <span className="font-semibold text-slate-800">15%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                          <span className="text-slate-600 font-medium">Accessories</span>
                        </div>
                        <span className="font-semibold text-slate-800">10%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Low Stock Alert */}
                <div className="lg:col-span-3 bg-white rounded-xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-slate-800">Low Stock Alert</h3>
                    <button
                      onClick={() => setActiveTab('Inventory')}
                      className="text-xs font-semibold text-[#6366f1] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {products.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                            <span
                              className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px]"
                              style={{ backgroundColor: item.colorHex }}
                            >
                              <i className="fa-solid fa-shirt"></i>
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-800 leading-snug">{item.name}</span>
                            <span className="text-[11px] text-slate-400">Size: {item.size}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs">
                            <span className="text-slate-500">Stock: </span>
                            <span className="text-[#ef4444] font-bold">{item.stock}</span>
                          </div>
                          <span className="text-[10.5px] text-slate-400 block">Min: {item.minStock}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROW 3: TABLES & SUMMARY WIDGETS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Recent Invoices Table (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-slate-800">Recent Invoices</h3>
                    <button
                      onClick={() => setActiveTab('Sales')}
                      className="text-xs font-semibold text-[#6366f1] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-medium">
                          <th className="pb-2.5 font-medium">Invoice No.</th>
                          <th className="pb-2.5 font-medium">Date</th>
                          <th className="pb-2.5 font-medium">Customer</th>
                          <th className="pb-2.5 font-medium">Items</th>
                          <th className="pb-2.5 font-medium">Amount</th>
                          <th className="pb-2.5 font-medium">Payment</th>
                          <th className="pb-2.5 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {invoices.slice(0, 5).map((inv) => (
                          <tr
                            key={inv.id}
                            onClick={() => setSelectedInvoiceForView(inv)}
                            className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                          >
                            <td className="py-3 font-semibold text-slate-700">{inv.id}</td>
                            <td className="py-3 text-slate-600">{inv.date}</td>
                            <td className="py-3 font-medium text-slate-800">{inv.customer}</td>
                            <td className="py-3 text-slate-600">{inv.itemsCount}</td>
                            <td className="py-3 font-semibold text-slate-900">₹ {inv.amount.toLocaleString()}</td>
                            <td className="py-3 text-slate-600">{inv.payment}</td>
                            <td className="py-3 text-right">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                                  inv.status === 'Paid'
                                    ? 'bg-[#ecfdf5] text-[#10b981]'
                                    : 'bg-[#fef2f2] text-[#ef4444]'
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column: Quick Actions + Profit & Loss */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Quick Actions (6 Interactive Buttons) */}
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <h3 className="font-bold text-sm text-slate-800 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => setActiveTab('Billing')}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition cursor-pointer text-left"
                      >
                        <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center text-xs flex-shrink-0">
                          <i className="fa-solid fa-file-invoice"></i>
                        </div>
                        <span className="text-xs font-medium text-slate-700">+ New Invoice</span>
                      </button>

                      <button
                        onClick={() => setShowAddProductModal(true)}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition cursor-pointer text-left"
                      >
                        <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0">
                          <i className="fa-solid fa-tags"></i>
                        </div>
                        <span className="text-xs font-medium text-slate-700">+ Add Product</span>
                      </button>

                      <button
                        onClick={() => setShowAddCustomerModal(true)}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition cursor-pointer text-left"
                      >
                        <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs flex-shrink-0">
                          <i className="fa-solid fa-user-plus"></i>
                        </div>
                        <span className="text-xs font-medium text-slate-700">+ Add Customer</span>
                      </button>

                      <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition cursor-pointer text-left"
                      >
                        <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center text-xs flex-shrink-0">
                          <i className="fa-solid fa-cart-shopping"></i>
                        </div>
                        <span className="text-xs font-medium text-slate-700">Purchase</span>
                      </button>

                      <button
                        onClick={() => setShowExpenseModal(true)}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 transition cursor-pointer text-left"
                      >
                        <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center text-xs flex-shrink-0">
                          <i className="fa-regular fa-credit-card"></i>
                        </div>
                        <span className="text-xs font-medium text-slate-700">Add Expense</span>
                      </button>

                      <button
                        onClick={() => setShowStockAdjustmentModal(true)}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/40 transition cursor-pointer text-left"
                      >
                        <div className="w-6 h-6 rounded-md bg-cyan-50 text-cyan-600 flex items-center justify-center text-xs flex-shrink-0">
                          <i className="fa-solid fa-sliders"></i>
                        </div>
                        <span className="text-xs font-medium text-slate-700">Stock Adjustment</span>
                      </button>
                    </div>
                  </div>

                  {/* Profit & Loss Summary (Live Reactive) */}
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                    <h3 className="font-bold text-sm text-slate-800 mb-3">Profit &amp; Loss Summary (This Month)</h3>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Total Sales</span>
                        <span className="font-semibold text-[#10b981]">₹ {monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Total Purchases</span>
                        <span className="font-semibold text-[#ef4444]">₹ {totalPurchasesAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Total Expenses</span>
                        <span className="font-semibold text-[#ef4444]">₹ {totalExpensesAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-[#ecfdf5] border border-emerald-100 rounded-lg p-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Net Profit</span>
                      <span className="text-sm font-bold text-[#10b981]">₹ {netProfit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 2: BILLING & POS SYSTEM (Fully interactive counter sales)
             =================================================================== */}
          {activeTab === 'Billing' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Counter POS / Billing Terminal</h2>
                  <p className="text-xs text-slate-400">Select apparel items to add to ticket, calculate tax &amp; print bill.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Cashier:</span>
                  <span className="text-xs font-semibold bg-indigo-50 text-[#6366f1] px-2.5 py-1 rounded-md">Admin / Main Counter</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Product Catalog Grid (8 cols) */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                  {/* Category Pills & Search */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {['All', 'Men', 'Women', 'Kids', 'Accessories'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setPosCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                            posCategoryFilter === cat
                              ? 'bg-[#6366f1] text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Filter catalog..."
                        value={posSearchTerm}
                        onChange={(e) => setPosSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-800 focus:outline-indigo-500"
                      />
                      <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    {products
                      .filter((p) => posCategoryFilter === 'All' || p.category === posCategoryFilter)
                      .filter((p) => !posSearchTerm || p.name.toLowerCase().includes(posSearchTerm.toLowerCase()))
                      .map((product) => {
                        const inCart = cart.find((c) => c.product.id === product.id);
                        return (
                          <div
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white rounded-xl p-3 border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between relative group"
                          >
                            {inCart && (
                              <span className="absolute top-2 right-2 bg-[#6366f1] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {inCart.qty}
                              </span>
                            )}
                            <div>
                              <div
                                className="w-full h-24 rounded-lg flex items-center justify-center text-white text-2xl mb-2 transition transform group-hover:scale-[1.02]"
                                style={{ backgroundColor: product.colorHex }}
                              >
                                <i className="fa-solid fa-shirt"></i>
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                                <span>Size: {product.size}</span>
                                <span className={product.stock <= product.minStock ? 'text-red-500 font-semibold' : ''}>
                                  {product.stock} in stock
                                </span>
                              </div>
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">₹ {product.price}</span>
                              <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                                + Add
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Right Side: Billing Ticket / Cart Summary (4 cols) */}
                <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between h-[680px]">
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between border-b pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-receipt text-[#6366f1]"></i>
                        <h3 className="font-bold text-sm text-slate-800">Current Ticket</h3>
                      </div>
                      <span className="text-xs font-medium text-slate-400">{cart.length} items</span>
                    </div>

                    {/* Customer Name Selector / Input */}
                    <div className="space-y-2 mb-3">
                      <label className="text-[11px] font-semibold text-slate-600 block">Customer</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={posCustomerName}
                          onChange={(e) => setPosCustomerName(e.target.value)}
                          placeholder="Enter Customer Name"
                          className="flex-1 border rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-indigo-500"
                        />
                        <select
                          onChange={(e) => setPosCustomerName(e.target.value)}
                          className="border rounded-lg px-2 py-1.5 text-xs text-slate-600 bg-slate-50"
                        >
                          <option value="">Quick Select</option>
                          {customers.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Cart Items Scrollable List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1">
                      {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
                          <i className="fa-solid fa-cart-shopping text-4xl mb-2"></i>
                          <p className="text-xs text-slate-400">Cart is empty</p>
                          <span className="text-[11px] text-slate-400">Tap items on the left to add to bill</span>
                        </div>
                      ) : (
                        cart.map((item) => (
                          <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <h5 className="text-xs font-semibold text-slate-800">{item.product.name}</h5>
                              <span className="text-[11px] text-slate-400">
                                ₹{item.product.price} × {item.qty} (Size: {item.product.size})
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateCartQty(item.product.id, -1)}
                                className="w-6 h-6 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                              >
                                -
                              </button>
                              <span className="w-5 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                              <button
                                onClick={() => updateCartQty(item.product.id, 1)}
                                className="w-6 h-6 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-400 hover:text-red-600 text-xs ml-1.5"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Payment Details & Checkout Button */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal</span>
                        <span>₹ {cartSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>GST (5%)</span>
                        <span>₹ {cartTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t">
                        <span>Grand Total</span>
                        <span className="text-[#6366f1]">₹ {cartTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {(['Cash', 'UPI', 'Card'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setPosPaymentMethod(method)}
                          className={`py-1.5 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                            posPaymentMethod === method
                              ? 'bg-indigo-50 border-[#6366f1] text-[#6366f1] font-semibold'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>

                    {/* Save & Print Invoice */}
                    <button
                      onClick={handleCheckoutInvoice}
                      disabled={cart.length === 0}
                      className="w-full py-2.5 bg-[#6366f1] hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-lg text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i className="fa-solid fa-print"></i>
                      <span>Save &amp; Generate Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 3: PRODUCTS & INVENTORY MANAGEMENT
             =================================================================== */}
          {(activeTab === 'Products' || activeTab === 'Inventory') && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {activeTab === 'Products' ? 'Product Catalog & Pricing' : 'Inventory & Stock Audit'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Track stock thresholds, retail prices, and replenish depleted sizes in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowStockAdjustmentModal(true)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-sliders text-cyan-600"></i> Stock Audit
                  </button>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#6366f1] text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
                  >
                    <i className="fa-solid fa-plus text-[10px]"></i> Add Product
                  </button>
                </div>
              </div>

              {/* Low stock alert banner */}
              {lowStockItems.length > 0 && (
                <div className="bg-red-50/80 border border-red-200 rounded-xl p-3 flex items-center justify-between text-xs text-red-700">
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-sm"></i>
                    <span>
                      <strong>{lowStockItems.length} items</strong> have fallen below safety inventory limits!
                    </span>
                  </div>
                  <span className="font-semibold text-xs">Action Required</span>
                </div>
              )}

              {/* Table of Products */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-3 border-b flex items-center justify-between gap-3 text-xs">
                  <div className="flex gap-2">
                    {['All', 'Men', 'Women', 'Kids', 'Accessories'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setProductCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                          productCategoryFilter === cat ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <span className="text-slate-400 text-xs">{products.length} Products registered</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-medium bg-slate-50/50">
                        <th className="py-2.5 pl-4 font-medium">SKU</th>
                        <th className="py-2.5 font-medium">Item Details</th>
                        <th className="py-2.5 font-medium">Category</th>
                        <th className="py-2.5 font-medium">Size</th>
                        <th className="py-2.5 font-medium">Cost / Selling</th>
                        <th className="py-2.5 font-medium">Stock Level</th>
                        <th className="py-2.5 font-medium">Status</th>
                        <th className="py-2.5 pr-4 font-medium text-right">Quick Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products
                        .filter((p) => productCategoryFilter === 'All' || p.category === productCategoryFilter)
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 pl-4 font-mono text-slate-500 font-semibold">{item.sku}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: item.colorHex }}
                                ></span>
                                <span className="font-semibold text-slate-800">{item.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-slate-600">{item.category}</td>
                            <td className="py-3 font-semibold text-slate-700">{item.size}</td>
                            <td className="py-3 text-slate-700">
                              <span className="text-slate-400">₹{item.costPrice}</span> /{' '}
                              <span className="font-bold text-slate-900">₹{item.price}</span>
                            </td>
                            <td className="py-3">
                              <span
                                className={`font-bold ${
                                  item.stock <= item.minStock ? 'text-red-500' : 'text-slate-900'
                                }`}
                              >
                                {item.stock}
                              </span>
                              <span className="text-slate-400 text-[11px]"> / min {item.minStock}</span>
                            </td>
                            <td className="py-3">
                              {item.stock === 0 ? (
                                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[11px] font-semibold">
                                  Out of Stock
                                </span>
                              ) : item.stock <= item.minStock ? (
                                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                                  Low Stock
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[11px] font-semibold">
                                  In Stock
                                </span>
                              )}
                            </td>
                            <td className="py-3 pr-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleQuickRestock(item.id, 5)}
                                  className="px-2 py-0.5 text-[11px] font-semibold rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => handleQuickRestock(item.id, 10)}
                                  className="px-2 py-0.5 text-[11px] font-semibold rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                >
                                  +10
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 4: CUSTOMERS DIRECTORY & HISTORY
             =================================================================== */}
          {activeTab === 'Customers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Customer Relationship Management</h2>
                  <p className="text-xs text-slate-400">View customer purchases, reward store loyalty, and track contact records.</p>
                </div>
                <button
                  onClick={() => setShowAddCustomerModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#6366f1] text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
                >
                  <i className="fa-solid fa-user-plus text-[10px]"></i> Add Customer
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-medium bg-slate-50/50">
                      <th className="py-2.5 pl-4 font-medium">Customer Name</th>
                      <th className="py-2.5 font-medium">Phone Number</th>
                      <th className="py-2.5 font-medium">Email Address</th>
                      <th className="py-2.5 font-medium">City</th>
                      <th className="py-2.5 font-medium">Total Orders</th>
                      <th className="py-2.5 font-medium">Lifetime Spend</th>
                      <th className="py-2.5 pr-4 font-medium text-right">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 pl-4 font-bold text-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                              {cust.name[0]}
                            </div>
                            <span>{cust.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-slate-600">{cust.phone}</td>
                        <td className="py-3 text-slate-500">{cust.email}</td>
                        <td className="py-3 text-slate-600">{cust.city}</td>
                        <td className="py-3 font-semibold text-slate-800">{cust.totalOrders} bills</td>
                        <td className="py-3 font-bold text-slate-900">₹ {cust.totalSpent.toLocaleString()}</td>
                        <td className="py-3 pr-4 text-right text-slate-400">{cust.joinedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 5: SALES / INVOICES ARCHIVE
             =================================================================== */}
          {activeTab === 'Sales' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Sales Transactions &amp; Billing Invoices</h2>
                  <p className="text-xs text-slate-400">All receipts issued across cash registers with printable invoice view.</p>
                </div>
                <button
                  onClick={() => setActiveTab('Billing')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#6366f1] text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i> Create Sale
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-medium bg-slate-50/50">
                      <th className="py-2.5 pl-4 font-medium">Invoice No.</th>
                      <th className="py-2.5 font-medium">Date &amp; Time</th>
                      <th className="py-2.5 font-medium">Customer</th>
                      <th className="py-2.5 font-medium">Items Count</th>
                      <th className="py-2.5 font-medium">Subtotal</th>
                      <th className="py-2.5 font-medium">Total Bill</th>
                      <th className="py-2.5 font-medium">Payment Mode</th>
                      <th className="py-2.5 font-medium">Status</th>
                      <th className="py-2.5 pr-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 pl-4 font-bold text-indigo-600 font-mono">{inv.id}</td>
                        <td className="py-3 text-slate-600">{inv.date}</td>
                        <td className="py-3 font-semibold text-slate-800">{inv.customer}</td>
                        <td className="py-3 text-slate-600">{inv.itemsCount} pcs</td>
                        <td className="py-3 text-slate-500">₹ {inv.subtotal.toLocaleString()}</td>
                        <td className="py-3 font-bold text-slate-900">₹ {inv.amount.toLocaleString()}</td>
                        <td className="py-3 font-medium text-slate-700">{inv.payment}</td>
                        <td className="py-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                              inv.status === 'Paid'
                                ? 'bg-[#ecfdf5] text-[#10b981]'
                                : 'bg-[#fef2f2] text-[#ef4444]'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <button
                            onClick={() => setSelectedInvoiceForView(inv)}
                            className="text-xs text-[#6366f1] hover:underline font-semibold"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 6: PURCHASES
             =================================================================== */}
          {activeTab === 'Purchases' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Supplier Purchases &amp; Inward Stock</h2>
                  <p className="text-xs text-slate-400">Track raw clothing procurement from mills and wholesale suppliers.</p>
                </div>
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 flex items-center gap-1.5 shadow-xs"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i> New Purchase Order
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-medium bg-slate-50/50">
                      <th className="py-2.5 pl-4 font-medium">Order ID</th>
                      <th className="py-2.5 font-medium">Date</th>
                      <th className="py-2.5 font-medium">Supplier</th>
                      <th className="py-2.5 font-medium">Batch Description</th>
                      <th className="py-2.5 font-medium">Units</th>
                      <th className="py-2.5 font-medium">Total Cost</th>
                      <th className="py-2.5 pr-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchases.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 pl-4 font-mono font-bold text-amber-700">{p.id}</td>
                        <td className="py-3 text-slate-600">{p.date}</td>
                        <td className="py-3 font-semibold text-slate-800">{p.supplier}</td>
                        <td className="py-3 text-slate-600">{p.description}</td>
                        <td className="py-3 font-semibold text-slate-700">{p.itemsCount} units</td>
                        <td className="py-3 font-bold text-slate-900">₹ {p.amount.toLocaleString()}</td>
                        <td className="py-3 pr-4 text-right">
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[11px] font-semibold">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 7: RETURNS
             =================================================================== */}
          {activeTab === 'Returns' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Customer Returns &amp; Exchanges</h2>
                  <p className="text-xs text-slate-400">Process return items back into store inventory and record refund balances.</p>
                </div>
                <button
                  onClick={() => setShowReturnModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#6366f1] text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
                >
                  <i className="fa-solid fa-rotate-left text-[10px]"></i> Log Return
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-medium bg-slate-50/50">
                      <th className="py-2.5 pl-4 font-medium">Return ID</th>
                      <th className="py-2.5 font-medium">Date</th>
                      <th className="py-2.5 font-medium">Original Invoice</th>
                      <th className="py-2.5 font-medium">Customer</th>
                      <th className="py-2.5 font-medium">Returned Item</th>
                      <th className="py-2.5 font-medium">Reason</th>
                      <th className="py-2.5 pr-4 font-medium text-right">Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {returns.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 pl-4 font-mono font-bold text-slate-700">{r.id}</td>
                        <td className="py-3 text-slate-600">{r.date}</td>
                        <td className="py-3 text-indigo-600 font-mono">{r.invoiceId}</td>
                        <td className="py-3 font-semibold text-slate-800">{r.customer}</td>
                        <td className="py-3 text-slate-700">{r.item}</td>
                        <td className="py-3 text-slate-500 italic">{r.reason}</td>
                        <td className="py-3 pr-4 text-right font-bold text-red-500">₹ {r.refundAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 8: EXPENSES TRACKER
             =================================================================== */}
          {activeTab === 'Expenses' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Operational Shop Expenses</h2>
                  <p className="text-xs text-slate-400">All overhead costs are deducted live from your monthly Net Profit summary.</p>
                </div>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 flex items-center gap-1.5 shadow-xs"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i> Add Expense
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Total Expenses Logged</span>
                  <div className="text-xl font-bold text-rose-600 mt-1">₹ {totalExpensesAmount.toLocaleString()}</div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{expenses.length} expense items</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Top Cost Category</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">Rent &amp; Utilities</div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">82% of overheads</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Net Profit Impact</span>
                  <div className="text-xl font-bold text-[#10b981] mt-1">₹ {netProfit.toLocaleString()}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Live balance preserved</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-medium bg-slate-50/50">
                      <th className="py-2.5 pl-4 font-medium">Expense ID</th>
                      <th className="py-2.5 font-medium">Date</th>
                      <th className="py-2.5 font-medium">Expense Title</th>
                      <th className="py-2.5 font-medium">Category</th>
                      <th className="py-2.5 font-medium">Payment Mode</th>
                      <th className="py-2.5 pr-4 font-medium text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 pl-4 font-mono font-bold text-rose-600">{e.id}</td>
                        <td className="py-3 text-slate-600">{e.date}</td>
                        <td className="py-3 font-semibold text-slate-800">{e.title}</td>
                        <td className="py-3">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                            {e.category}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">{e.paymentMode}</td>
                        <td className="py-3 pr-4 text-right font-bold text-rose-600">₹ {e.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 9: REPORTS & FINANCIAL ANALYTICS
             =================================================================== */}
          {activeTab === 'Reports' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <h2 className="text-base font-bold text-slate-800">Financial Reports &amp; Margins</h2>
                <p className="text-xs text-slate-400">Monthly breakdown of gross earnings, overhead deductions, and net yield.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-xs text-slate-500">Gross Sales</span>
                  <div className="text-lg font-bold text-[#10b981] mt-1">₹ {monthlyRevenue.toLocaleString()}</div>
                  <span className="text-[11px] text-slate-400">100% Volume</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-xs text-slate-500">Cost of Goods (Purchases)</span>
                  <div className="text-lg font-bold text-red-500 mt-1">₹ {totalPurchasesAmount.toLocaleString()}</div>
                  <span className="text-[11px] text-slate-400">62.1% of Revenue</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-xs text-slate-500">Overhead Expenses</span>
                  <div className="text-lg font-bold text-red-500 mt-1">₹ {totalExpensesAmount.toLocaleString()}</div>
                  <span className="text-[11px] text-slate-400">4.7% of Revenue</span>
                </div>
                <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 shadow-xs">
                  <span className="text-xs text-emerald-800 font-semibold">Net Profit Realized</span>
                  <div className="text-xl font-bold text-emerald-700 mt-1">₹ {netProfit.toLocaleString()}</div>
                  <span className="text-[11px] text-emerald-600 font-medium">18.4% Clean Margin</span>
                </div>
              </div>

              {/* Profit & Loss Comprehensive Statement */}
              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-slate-800">Monthly Income Statement (May 2025)</h3>
                <div className="space-y-2 text-xs divide-y divide-slate-100">
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-600 font-medium">A. Store Retail Invoices Revenue</span>
                    <span className="font-bold text-slate-900">₹ {monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 flex justify-between text-red-600">
                    <span>B. Total Wholesale Merchandise Purchases</span>
                    <span>- ₹ {totalPurchasesAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 flex justify-between font-semibold text-slate-800">
                    <span>Gross Retail Margin (A - B)</span>
                    <span>₹ {(monthlyRevenue - totalPurchasesAmount).toLocaleString()}</span>
                  </div>
                  <div className="pt-2 flex justify-between text-red-600">
                    <span>C. Store Operational Overheads &amp; Utility Expenses</span>
                    <span>- ₹ {totalExpensesAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 flex justify-between font-bold text-sm text-[#10b981] bg-[#ecfdf5] p-2.5 rounded-lg">
                    <span>Final Net Profit Realized</span>
                    <span>₹ {netProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 10: SETTINGS
             =================================================================== */}
          {activeTab === 'Settings' && (
            <div className="space-y-4 max-w-4xl">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                <h2 className="text-base font-bold text-slate-800">Store Settings &amp; Configuration</h2>
                <p className="text-xs text-slate-400">Configure business information, GST billing rules, and manage demo backups.</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-sm text-slate-800 border-b pb-2">Business Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Shop Name</label>
                    <input
                      type="text"
                      defaultValue="StyleShop"
                      className="w-full border rounded-lg p-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Tagline</label>
                    <input
                      type="text"
                      defaultValue="Clothing Shop Billing & Inventory System"
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={currentBranch}
                      onChange={(e) => setCurrentBranch(e.target.value)}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      defaultValue="27AABCU9603R1ZM"
                      className="w-full border rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <h4 className="font-bold text-xs text-slate-800 mb-2">Reset &amp; Backup Controls</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={handleResetData}
                      className="px-3.5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition"
                    >
                      <i className="fa-solid fa-rotate-left mr-1.5"></i> Reset to Default Screenshot Data
                    </button>
                    <button
                      onClick={() => alert('All store data is automatically synced into your browser local storage!')}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition"
                    >
                      <i className="fa-solid fa-cloud mr-1.5"></i> Data Status: Synchronized
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <footer className="pt-2 pb-4 text-center text-xs text-slate-400">
            © 2025 StyleShop. All rights reserved.
          </footer>
        </main>
      </div>

      {/* =========================================================================
          INTERACTIVE MODALS
         ========================================================================= */}

      {/* 1. PRINT INVOICE / RECEIPT MODAL */}
      {selectedInvoiceForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 p-6 space-y-4">
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <div className="w-10 h-10 rounded-xl bg-[#6366f1] text-white flex items-center justify-center mx-auto mb-2 text-lg">
                <i className="fa-solid fa-shirt"></i>
              </div>
              <h3 className="font-bold text-base text-slate-900">StyleShop</h3>
              <p className="text-[11px] text-slate-500">Clothing Shop Billing &amp; Inventory</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{currentBranch} • GSTIN: 27AABCU9603R1ZM</p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice:</span>
                <span className="font-mono font-bold text-slate-800">{selectedInvoiceForView.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date &amp; Time:</span>
                <span className="text-slate-700">{selectedInvoiceForView.date} {selectedInvoiceForView.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-semibold text-slate-800">{selectedInvoiceForView.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment:</span>
                <span className="font-semibold text-indigo-600">{selectedInvoiceForView.payment}</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-slate-200 py-2.5 max-h-48 overflow-y-auto space-y-2 text-xs">
              {selectedInvoiceForView.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800 leading-tight">{it.name}</p>
                    <span className="text-[10px] text-slate-400">Size: {it.size} • {it.qty} × ₹{it.price}</span>
                  </div>
                  <span className="font-semibold text-slate-900">₹ {it.qty * it.price}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>₹ {selectedInvoiceForView.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (5%):</span>
                <span>₹ {selectedInvoiceForView.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t">
                <span>Grand Total:</span>
                <span className="text-[#6366f1]">₹ {selectedInvoiceForView.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t">
              <button
                onClick={() => setSelectedInvoiceForView(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 text-xs font-semibold bg-[#6366f1] hover:bg-indigo-700 text-white rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-print"></i> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-tags text-emerald-600"></i> Add New Apparel Item
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('pName') as HTMLInputElement).value;
                const cat = (form.elements.namedItem('pCat') as HTMLSelectElement).value as any;
                const size = (form.elements.namedItem('pSize') as HTMLInputElement).value;
                const price = Number((form.elements.namedItem('pPrice') as HTMLInputElement).value);
                const cost = Number((form.elements.namedItem('pCost') as HTMLInputElement).value);
                const stock = Number((form.elements.namedItem('pStock') as HTMLInputElement).value);

                const newProd: Product = {
                  id: `prod-${Date.now()}`,
                  sku: `${cat.slice(0, 3).toUpperCase()}-${size}-${Math.floor(10 + Math.random() * 90)}`,
                  name,
                  category: cat,
                  size,
                  price,
                  costPrice: cost,
                  stock,
                  minStock: 10,
                  colorHex: '#6366f1',
                  type: 'tshirt',
                };

                setProducts([newProd, ...products]);
                setShowAddProductModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Item Name</label>
                <input
                  name="pName"
                  required
                  placeholder="e.g. Slim Fit Denim Jacket"
                  className="w-full border rounded-lg p-2 focus:outline-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Category</label>
                  <select name="pCat" className="w-full border rounded-lg p-2 focus:outline-indigo-500">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Size</label>
                  <input
                    name="pSize"
                    required
                    defaultValue="M"
                    className="w-full border rounded-lg p-2 focus:outline-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Cost (₹)</label>
                  <input
                    name="pCost"
                    type="number"
                    required
                    defaultValue="450"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Retail Price (₹)</label>
                  <input
                    name="pPrice"
                    type="number"
                    required
                    defaultValue="899"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Opening Stock</label>
                  <input
                    name="pStock"
                    type="number"
                    required
                    defaultValue="20"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-user-plus text-blue-600"></i> Add New Customer
              </h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('cName') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('cPhone') as HTMLInputElement).value;
                const city = (form.elements.namedItem('cCity') as HTMLInputElement).value;

                const newC: Customer = {
                  id: `cust-${Date.now()}`,
                  name,
                  phone,
                  email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
                  city,
                  totalOrders: 0,
                  totalSpent: 0,
                  joinedDate: '20 May 2025',
                };

                setCustomers([newC, ...customers]);
                setShowAddCustomerModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Customer Full Name</label>
                <input
                  name="cName"
                  required
                  placeholder="e.g. Meera Joshi"
                  className="w-full border rounded-lg p-2 focus:outline-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Phone Number</label>
                <input
                  name="cPhone"
                  required
                  placeholder="+91 98200 12345"
                  className="w-full border rounded-lg p-2 focus:outline-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">City</label>
                <input
                  name="cCity"
                  required
                  defaultValue="Mumbai"
                  className="w-full border rounded-lg p-2 focus:outline-indigo-500"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PURCHASE ORDER MODAL */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-cart-shopping text-amber-600"></i> New Inward Purchase Batch
              </h3>
              <button onClick={() => setShowPurchaseModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const supplier = (form.elements.namedItem('purSupplier') as HTMLInputElement).value;
                const desc = (form.elements.namedItem('purDesc') as HTMLInputElement).value;
                const qty = Number((form.elements.namedItem('purQty') as HTMLInputElement).value);
                const amount = Number((form.elements.namedItem('purAmount') as HTMLInputElement).value);

                const newPur: PurchaseRecord = {
                  id: `PUR-${8013 + purchases.length - 3}`,
                  date: '20 May 2025',
                  supplier,
                  itemsCount: qty,
                  description: desc,
                  amount,
                  status: 'Received',
                };

                // Add to inventory
                setProducts((prev) =>
                  prev.map((p) => ({ ...p, stock: p.stock + Math.round(qty / prev.length) }))
                );

                setPurchases([newPur, ...purchases]);
                setShowPurchaseModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Mill / Supplier Name</label>
                <input
                  name="purSupplier"
                  required
                  defaultValue="Apex Textiles Mumbai"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Batch Description</label>
                <input
                  name="purDesc"
                  required
                  defaultValue="Summer T-Shirt & Dress Restock"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Total Items (pcs)</label>
                  <input
                    name="purQty"
                    type="number"
                    required
                    defaultValue="50"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Total Inward Cost (₹)</label>
                  <input
                    name="purAmount"
                    type="number"
                    required
                    defaultValue="25000"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold bg-amber-600 text-white hover:bg-amber-700"
                >
                  Record Purchase &amp; Inward Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADD EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <i className="fa-regular fa-credit-card text-rose-600"></i> Record Store Expense
              </h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem('expTitle') as HTMLInputElement).value;
                const cat = (form.elements.namedItem('expCat') as HTMLSelectElement).value as any;
                const amount = Number((form.elements.namedItem('expAmount') as HTMLInputElement).value);
                const mode = (form.elements.namedItem('expMode') as HTMLSelectElement).value as any;

                const newExp: ExpenseRecord = {
                  id: `EXP-${405 + expenses.length - 4}`,
                  date: '20 May 2025',
                  title,
                  category: cat,
                  amount,
                  paymentMode: mode,
                };

                setExpenses([newExp, ...expenses]);
                setShowExpenseModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Expense Title</label>
                <input
                  name="expTitle"
                  required
                  placeholder="e.g. Tailoring Supplies & Threads"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Category</label>
                  <select name="expCat" className="w-full border rounded-lg p-2">
                    <option value="Rent">Rent</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Salary">Salary</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Amount (₹)</label>
                  <input
                    name="expAmount"
                    type="number"
                    required
                    defaultValue="1500"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Payment Mode</label>
                <select name="expMode" className="w-full border rounded-lg p-2">
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold bg-rose-600 text-white hover:bg-rose-700"
                >
                  Deduct &amp; Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. STOCK ADJUSTMENT MODAL */}
      {showStockAdjustmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-sliders text-cyan-600"></i> Stock Audit &amp; Adjustment
              </h3>
              <button onClick={() => setShowStockAdjustmentModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const prodId = (form.elements.namedItem('adjProd') as HTMLSelectElement).value;
                const newQty = Number((form.elements.namedItem('adjQty') as HTMLInputElement).value);

                setProducts((prev) =>
                  prev.map((p) => (p.id === prodId ? { ...p, stock: newQty } : p))
                );
                setShowStockAdjustmentModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Select Item</label>
                <select name="adjProd" className="w-full border rounded-lg p-2">
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.size}) — Current: {p.stock} pcs
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Adjusted Physical Count</label>
                <input
                  name="adjQty"
                  type="number"
                  required
                  defaultValue="15"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Reason for Adjustment</label>
                <select className="w-full border rounded-lg p-2">
                  <option>Physical Inventory Audit Count</option>
                  <option>Damaged or Stained in Rack</option>
                  <option>Store Display Sample</option>
                  <option>Internal Shrinkage / Return</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowStockAdjustmentModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  Apply Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. RETURN LOG MODAL */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-rotate-left text-indigo-600"></i> Process Customer Return
              </h3>
              <button onClick={() => setShowReturnModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const cust = (form.elements.namedItem('retCust') as HTMLInputElement).value;
                const item = (form.elements.namedItem('retItem') as HTMLInputElement).value;
                const refund = Number((form.elements.namedItem('retRefund') as HTMLInputElement).value);
                const reason = (form.elements.namedItem('retReason') as HTMLInputElement).value;

                const newR: ReturnRecord = {
                  id: `RET-${302 + returns.length - 1}`,
                  date: '20 May 2025',
                  invoiceId: 'INV-10044',
                  customer: cust,
                  item,
                  refundAmount: refund,
                  reason,
                };

                setReturns([newR, ...returns]);
                setShowReturnModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Customer Name</label>
                <input
                  name="retCust"
                  required
                  defaultValue="Priya Verma"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Item Name &amp; Size</label>
                <input
                  name="retItem"
                  required
                  defaultValue="Women Kurti (Size L)"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Refund Amount (₹)</label>
                  <input
                    name="retRefund"
                    type="number"
                    required
                    defaultValue="899"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Reason</label>
                  <input
                    name="retReason"
                    required
                    defaultValue="Size fitting issue"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold bg-[#6366f1] text-white hover:bg-indigo-700"
                >
                  Record Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
