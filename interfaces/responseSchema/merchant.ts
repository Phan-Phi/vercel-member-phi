type MERCHANTS_STORES_CATEGORIES_ITEM = {
  self: string;
  name: string;
  icon_for_member: string;
  icon_for_all: string;
};

type MERCHANTS_STORES_ITEM = {
  self: string;
  rank_bands: string;
  ranks: string;
  branches: string;
  category: string;
  memberships: string;
  merchant: string;
  logo: string | null;
  pending_logo: string | null;
  banner: string | null;
  pending_banner: string | null;
  customers: string;
  slug: string;
  name: string;
  facebook_link: string;
  instagram_link: string;
  is_active: boolean;
  is_published: boolean;
  date_created: string;
};

type MERCHANTS_ITEM = {
  self: string;
  wallet: string;
  bank_accounts: string;
  addresses: string;
  stores: string;
  activated_by_person: string;
  transactions: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  birthday: string | null;
  gender: string;
  is_active: boolean;
  is_valid_email: boolean;
  activated_by_person_name: string;
  activated_by_person_email: string;
  activated_by_person_phone_number: string;
  note: string;
};

type MERCHANTS_ADDRESSES_ITEM = {
  self: string;
  user: string;
  line: string;
  ward: string;
  district: string;
  province: string;
};

type MERCHANTS_BANK_ACCOUNTS_ITEM = {
  self: string;
  user: string;
  owner_name: string;
  account_number: string;
  bank_name: string;
  bank_branch: string;
};

type MERCHANTS_STORES_BRANCHES_ITEM = {
  self: string;
  promotions: string;
  products: string;
  product_categories: string;
  modifiers: string;
  weekday_opening_periods: string;
  store: string;
  orders: string;
  feedbacks: string;
  cashiers: string;
  ward: string;
  district: string;
  province: string;
  name: string;
  address: string;
  coordinates: string;
  manager_name: string;
  phone_number: string;
  email: string;
  description: string;
  date_created: string;
  total_order_count: number;
  total_order_gift_point: number;
  total_order_transaction_fee: number;
  total_order_paid_cash: string;
  total_order_cash: string;
};

type MERCHANTS_STORES_BRANCHES_CATEGORIES_ITEM = {
  self: string;
  branch: string;
  products: string;
  name: string;
  description: string;
};

type MERCHANTS_STORES_RANKBANDS_ITEM = {
  self: string;
  rank: string;
  store: string;
  band_amount: number;
  gift_rate: number;
  description: string;
};

type MERCHANTS_STORES_MEMBERSHIPS_ITEM = {
  self: string;
  store: string;
  customer: string;
  point_earn: number;
  date_joined: string;
  date_updated: string;
};

type MERCHANTS_STORES_BRANCHES_WEEKDAYOPENINGPERIODS_ITEM = {
  self: string;
  branch: string;
  weekday: string;
  sort_order: number;
  start: string;
  end: string;
  is_closed: boolean;
};

type MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM = {
  self: string;
  branch: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  birthday: string | null;
  gender: string;
  is_active: boolean;
  is_valid_email: boolean;
};

type MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM = {
  self: string;
  image: string | null;
  pending_image: string | null;
  promotions: string;
  modifiers: string;
  branch: string;
  category: string;
  discounted_price: string;
  name: string;
  is_published: boolean;
  is_available: boolean;
  description: string;
  price: string;
  unit: string;
};

type MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM = {
  self: string;
  branch: string;
  products: string;
  order_promotions: string;
  name: string;
  description: string;
  date_created: string;
  date_start: string;
  date_end: string;
  usage_limit: number;
  usage_count: number;
  discount_type: string;
  discount_amount: string;
  priority: number;
};

type MERCHANTS_WALLETS_ITEM = {
  self: string;
  owner: string;
  point_in: number;
  point_out: number;
  date_updated: string;
};

type MERCHANTS_STORES_BRANCHES_ORDERS_ITEM = {
  self: string;
  paid_cash: string;
  gift_point: number;
  transaction_fee: number;
  branch: string;
  order_promotions: string;
  customer: null;
  cashier: string;
  branch_name: string;
  store_name: string;
  cashier_name: string;
  cashier_email: string;
  cashier_phone_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone_number: string;
  customer_rank_name: string;
  customer_rank_gift_rate: number;
  sid: string;
  date_placed: string;
  total_cash: string;
  paid_point: number;
  status: string;
  note: string;
};

type MERCHANTS_TRANSACTIONS_ITEM = {
  self: string;
  directed_transaction_amount: number;
  target_name: string;
  source: string;
  source_type: string;
  date_created: string;
  transaction_type: string;
};

// *

export type {
  MERCHANTS_STORES_CATEGORIES_ITEM,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_ITEM,
  MERCHANTS_ADDRESSES_ITEM,
  MERCHANTS_BANK_ACCOUNTS_ITEM,
  MERCHANTS_STORES_BRANCHES_ITEM,
  MERCHANTS_STORES_BRANCHES_CATEGORIES_ITEM,
  MERCHANTS_STORES_RANKBANDS_ITEM,
  MERCHANTS_STORES_MEMBERSHIPS_ITEM,
  MERCHANTS_STORES_BRANCHES_WEEKDAYOPENINGPERIODS_ITEM,
  MERCHANTS_STORES_BRANCHES_CASHIERS_ITEM,
  MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM,
  MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM,
  MERCHANTS_WALLETS_ITEM,
  MERCHANTS_STORES_BRANCHES_ORDERS_ITEM,
  MERCHANTS_TRANSACTIONS_ITEM,
};

// *
