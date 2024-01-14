type PENDING_IMAGES_ITEM = {
  self: string;
  owner: string;
  confirmed_by_person: string | null;
  signature: string;
  original: string;
  is_confirmed: boolean;
  date_created: string;
  confirmed_by_person_name: string;
  confirmed_by_person_email: string;
  confirmed_by_person_phone_number: string;
};

export type { PENDING_IMAGES_ITEM };
