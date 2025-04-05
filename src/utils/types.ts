
export type UserRole = 'manager' | 'bartender' | 'inventory_staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  barId?: string;
}

export interface Bar {
  id: string;
  name: string;
  location: string;
  managerId: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  barId: string;
  supplierId: string;
  expirationDate?: string;
  minimumLevel: number;
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  itemsSupplied: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  ingredients: Array<{itemId: string, quantity: number}>;
  barId: string;
  available: boolean;
  image?: string;
}

export interface Order {
  id: string;
  barId: string;
  customerName?: string;
  tableNumber?: string;
  items: Array<{menuItemId: string, quantity: number, notes?: string}>;
  totalPrice: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface TransferRecord {
  id: string;
  itemId: string;
  itemName: string;
  sourceBarId: string;
  targetBarId: string;
  quantity: number;
  unit: string;
  transferredBy: string;
  date: string;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'transfer';
  amount: number;
  date: string;
  barId: string;
  relatedId?: string; // Order ID or transfer ID
  notes?: string;
}

export interface DashboardStats {
  totalSales: number;
  ordersCompleted: number;
  lowStockItems: number;
  expiringSoon: number;
}

export interface InventoryAlert {
  id: string;
  itemId: string;
  itemName: string;
  type: 'low_stock' | 'expiring_soon';
  barId: string;
  barName: string;
  message: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  barId: string;
  barName: string;
  productName: string;
  amount: number;
  quantity: number;
  total: number;
  date: string;
  staffName: string;
}
