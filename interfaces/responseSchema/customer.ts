type CUSTOMERS_ITEM = {
  self: string;
  wallet: string;
  addresses: string;
  memberships: string;
  avatar: null;
  stores: string;
  orders: string;
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
};

type CUSTOMERS_WALLETS_ITEM = {
  self: string;
  owner: string;
  point_in: number;
  point_out: number;
  date_updated: string;
};

type CUSTOMERS_ADDRESSES_ITEM = {
  self: string;
  user: string;
  line: string;
  ward: string;
  district: string;
  province: string;
};

type CUSTOMERS_TRANSACTIONS_ITEM = {
  self: string;
  directed_transaction_amount: number;
  target_name: string;
  source: string;
  source_type: string;
  date_created: string;
  transaction_type: string;
};

export type {
  CUSTOMERS_ITEM,
  CUSTOMERS_WALLETS_ITEM,
  CUSTOMERS_ADDRESSES_ITEM,
  CUSTOMERS_TRANSACTIONS_ITEM,
};
