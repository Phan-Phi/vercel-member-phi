export interface ME_ITEM {
  self: string;
  groups: string;
  addresses: string;
  permissions: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  birthday: string | null;
  gender: string;
  is_active: boolean;
  is_valid_email: boolean;
  note: string;
}
