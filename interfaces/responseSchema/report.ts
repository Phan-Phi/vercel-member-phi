export type REPORTS_MERCHANTS_OVEWVIEW_ITEM = {
  self: string;
  wallet: string;
  bank_accounts: string;
  addresses: string;
  stores: string;
  activated_by_person: string;
  transactions: string;
  total_order_cash: string | null;
  total_order_count: number | null;
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

export type REPORTS_CUSTOMERS_OVEWVIEW_ITEM = {
  total_order_cash: string;
  total_order_count: number;
  customer: string;
  customer_name: string;
  customer_email: string;
  customer_phone_number: string;
};

export type REPORTS_MERCHANTS_TOP_REGION_STORES_ITEM = {
  stores_count: number;
  province: string;
  district?: string;
};

export type REPORTS_MERCHANTS_TOP_REGION_BRANCHES_ITEM = {
  branches_count: number;
  province: string;
  district?: string;
};

export type REPORTS_CUSTOMERS_TOP_REGION_CUSTOMERS_ITEM = {
  customers_count: number;
  province: string;
  district?: string;
};

export type REPORTS_CUSTOMERS_TOP_REGION_ORDERS_ITEM = {
  orders_count: number;
  province: string;
  district?: string;
};

export type REPORTS_CUSTOMERS_TOP_STORE_ORDERS_ITEM = {
  orders_count: number;
  store: string;
};

export type REPORTS_CUSTOMERS_TOP_STORE_CATEGORY_ORDERS_ITEM = {
  orders_count: number;
  category: string;
};

export type REPORTS_CUSTOMERS_ORDERS_ITEM = {
  orders_count: number;
  date_start: string;
  date_end: string;
};
