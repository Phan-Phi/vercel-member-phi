export type AUDITLOGS_ITEM = {
  self: string;
  actor: string;
  source_type: string;
  source_repr: string;
  action: string;
  old: STATE;
  new: STATE;
  actor_name: string;
  actor_email: string;
  actor_phone_number: string;
  remote_addr: string;
  date_created: string;
};

interface STATE {
  pk: string;
  model: string;
  fields: Fields;
}

interface Fields {
  file: string;
  app_type: string;
}
