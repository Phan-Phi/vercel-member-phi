type NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM = {
  self: string;
  push_times: string;
  image: null;
  title: string;
  sub_body: string;
  body: string;
  body_type: string;
  date_created: string;
  type: string;
  app_type: string;
  file: string;
};

type NOTIFICATIONS_PUSH_TIMES_ITEM = {
  self: string;
  notification: string;
  date_created: Date;
  date_updated: Date;
  status: string;
  message: string;
  is_pushed: boolean;
  owner_name: string;
  owner_email: string;
  owner_phone_number: string;
};

type NOTIFICATIONS_WALLETS_ITEM = {
  count: number | undefined;
};

export type {
  NOTIFICATIONS_FILE_NOTIFICATIONS_ITEM,
  NOTIFICATIONS_WALLETS_ITEM,
  NOTIFICATIONS_PUSH_TIMES_ITEM,
};
