const PREFIX = "admin";
const COLECTIONS = "api/collections";

const login = "login";
const version = "version_tracks/records";
const version_released_notes = "released_notes/records";
const ranks = "ranks";
const admins = "admins";
const groups = "groups";
const stores = "stores";
const orders = "orders";
const choices = "choices";
const wallets = "wallets";
const cashiers = "cashiers";
const branches = "branches";
const divisions = "divisions";
const customers = "customers";
const addresses = "addresses";
const merchants = "merchants";
const modifiers = "modifiers";
const categories = "categories";
const promotions = "promotions";
const rank_bands = "rank-bands";
const memberships = "memberships";
const point_notes = "point-notes";
const verify_token = "verify-token";
const refresh_token = "refresh-token";
const bank_accounts = "bank-accounts";
const reset_password = "reset-password";
const forgot_password = "forgot-password";
const change_password = "change-password";
const convert_divisions = "convert-divisions";
const file_notifications = "file-notifications";
const pending_images = "pending-images";
const reports = "reports";
const top = "top";
const region_stores = "region-stores";
const region_branches = "region-branches";
const region_customers = "region-customers";
const region_orders = "region-orders";
const store_orders = "store-orders";
const store_category_orders = "store-category-orders";

const overview = "overview";
const auditlogs = "auditlogs";
const permissions = "permissions";

const export_files = "export-files";

// NOT CHECK YET

const me = "me";
const settings = "settings";
const products = "products";

const push_times = "push-times";
const notifications = "notifications";
const advertisements = "advertisements";
const avatars = "avatars";
const search_divisions = "search-divisions";
const social_icons = "social-icons";

const generatePathname = (data: string[]): string => {
  const arr = [PREFIX, ...data];
  return `/${arr.join("/")}/`;
};
const generatePathname2 = (data: string[]): string => {
  const arr = [COLECTIONS, ...data];
  return `/${arr.join("/")}/`;
};

// * VALID URL

export const RANKS = generatePathname([ranks]);

export const LOGIN = generatePathname([login]);
export const CHOICES = generatePathname([choices]);

export const MERCHANTS = generatePathname([merchants]);
export const MERCHANTS_STORES = generatePathname([merchants, stores]);
export const MERCHANTS_ADDRESSES = generatePathname([merchants, addresses]);
export const MERCHANTS_BANK_ACCOUNTS = generatePathname([merchants, bank_accounts]);

export const MERCHANTS_STORES_CATEGORIES = generatePathname([
  merchants,
  stores,
  categories,
]);
export const AVATARS_CATEGORIES = generatePathname([avatars, categories]);

export const MERCHANTS_STORES_BRANCHES = generatePathname([merchants, stores, branches]);

export const MERCHANTS_STORES_BRANCHES_PROMOTIONS = generatePathname([
  merchants,
  stores,
  branches,
  promotions,
]);

// * NOT CHECK YET

export const ME = generatePathname([me]);
export const ME_BANK = generatePathname([me, bank_accounts]);
export const ME_ADDRESSES = generatePathname([me, addresses]);

export const SETTINGS = generatePathname([settings]);
export const PERMISSIONS = generatePathname([permissions]);

export const ADVERTISEMENTS = generatePathname([advertisements]);

export const NOTIFICATIONS_FILE_NOTIFICATIONS = generatePathname([
  notifications,
  file_notifications,
]);
export const NOTIFICATIONS_PUSH_TIME = generatePathname([notifications, push_times]);

export const AVATARS = generatePathname([avatars]);
export const ADMINS = generatePathname([admins]);
export const VERSION = generatePathname2([version]);
export const VERSION_RELEASED_NOTES = generatePathname2([version_released_notes]);
export const GROUPS = generatePathname([groups]);
export const ADMINS_ADDRESS = generatePathname([admins, addresses]);
export const DIVISIONS = generatePathname([choices, divisions]);
export const SEARCH_DIVISIONS = generatePathname([choices, search_divisions]);

export const VERIFY_TOKEN = generatePathname([verify_token]);
export const REFRESH_TOKEN = generatePathname([refresh_token]);
export const RESET_PASSWORD = generatePathname([reset_password]);
export const FORGOT_PASSWORD = generatePathname([forgot_password]);
export const ME_CHANGE_PASSWORD = generatePathname([me, change_password]);

export const CASHIERS = generatePathname([cashiers]);
export const CASHIERS_ADDRESS = generatePathname([cashiers, addresses]);

export const STORE = generatePathname([stores]);
export const STORE_BRANCHES = generatePathname([stores, branches]);
export const STORE_BRANCHES_CATEGORIES = generatePathname([stores, branches, categories]);
export const STORE_BRANCHES_MODIFIERS = generatePathname([stores, branches, modifiers]);
export const STORE_BRANCHES_MODIFIERS_OPTIONS = generatePathname([stores, rank_bands]);

export const MERCHANTS_STORES_MEMBERSHIPS = generatePathname([
  merchants,
  stores,
  memberships,
]);

export const MERCHANTS_STORES_BRANCHES_ORDERS = generatePathname([
  merchants,
  stores,
  branches,
  orders,
]);

export const MERCHANTS_STORES_BRANCHES_PRODUCTS = generatePathname([
  merchants,
  stores,
  branches,
  products,
]);

export const MERCHANTS_WALLETS = generatePathname([merchants, wallets]);
export const CUSTOMERS_WALLETS = generatePathname([customers, wallets]);

export const POINTNOTES = generatePathname([point_notes]);

export const CUSTOMERS = generatePathname([customers]);
export const CUSTOMERS_ADDRESSES = generatePathname([customers, addresses]);
export const PENDING_IMAGES = generatePathname([pending_images]);

export const WARD = generatePathname([choices, divisions]);
export const PROVINCE = generatePathname([choices, divisions]);
export const DISTRICT = generatePathname([choices, divisions]);

export const CONVERT_DIVISIONS = generatePathname([choices, convert_divisions]);
export const CHOICES_DIVISIONS = generatePathname([choices, divisions]);

export const REPORTS_MERCHANTS_OVEWVIEW = generatePathname([
  reports,
  merchants,
  overview,
]);

export const REPORTS_CUSTOMERS_OVEWVIEW = generatePathname([
  reports,
  customers,
  overview,
]);

export const REPORTS_MERCHANTS_TOP_REGION_STORES = generatePathname([
  reports,
  merchants,
  top,
  region_stores,
]);

export const REPORTS_MERCHANTS_TOP_REGION_BRANCHES = generatePathname([
  reports,
  merchants,
  top,
  region_branches,
]);

export const REPORTS_CUSTOMERS_TOP_REGION_CUSTOMERS = generatePathname([
  reports,
  customers,
  top,
  region_customers,
]);

export const REPORTS_CUSTOMERS_TOP_REGION_ORDERS = generatePathname([
  reports,
  customers,
  top,
  region_orders,
]);

export const REPORTS_CUSTOMERS_TOP_STORE_ORDERS = generatePathname([
  reports,
  customers,
  top,
  store_orders,
]);

export const REPORTS_CUSTOMERS_TOP_STORE_CATEGORY_ORDERS = generatePathname([
  reports,
  customers,
  top,
  store_category_orders,
]);

export const REPORTS_CUSTOMERS_ORDERS = generatePathname([reports, customers, orders]);
export const AUDITLOGS = generatePathname([auditlogs]);

export const SOCIAL_ICONS = generatePathname([social_icons]);

export const EXPORT_FILES = generatePathname([export_files]);

// import { string, object, bool, array, mixed } from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";

// import { ChoiceType } from "interfaces";

// import { getChoiceValue } from "libs";

// import { isDevelopment } from "yups";

// import Chance from "chance";

// const chance = new Chance();

// export interface PointNoteSchemaSchemaProps {
//   note: string;
//   owner: string;
//   owner_as_customer: string;
//   flow_type: string;
//   point_amount: string;
//   type: string;
// }

// export const pointNoteSchema = (choice?: ChoiceType) => {
//   if (choice) {
//     const { point_note_flow_types } = choice;

//     const filteredAppType = point_note_flow_types.filter((el) => {
//       return el[0] !== "Admin";
//     });

//     return yupResolver(
//       object().shape({
//         note: string().required(),
//         owner: string().required(),
//         point_amount: string().required(),
//         owner_as_customer: string().required(),
//         flow_type: string().oneOf(getChoiceValue(filteredAppType)),
//         type: mixed(),
//       })
//     );
//   } else {
//     return yupResolver(
//       object().shape({
//         flow_type: string(),
//         note: string().required(),
//         owner: string().required(),
//         point_amount: string().required(),
//         owner_as_customer: string().required(),
//         type: mixed(),
//       })
//     );
//   }
// };

// export const defaultPointNoteFormState = (
//   choice?: ChoiceType
// ): PointNoteSchemaSchemaProps => {
//   if (choice) {
//     const { point_note_flow_types } = choice;

//     const filteredAppType = point_note_flow_types.filter((el) => {
//       return el[0] !== "Admin";
//     });
//     const filteredAppTypeValue = getChoiceValue(filteredAppType);

//     return {
//       flow_type: filteredAppTypeValue[0],
//       type: isDevelopment
//         ? chance.name({
//             suffix: true,
//           })
//         : "",
//       owner: isDevelopment
//         ? chance.name({
//             suffix: true,
//           })
//         : "",
//       owner_as_customer: isDevelopment
//         ? chance.name({
//             suffix: true,
//           })
//         : "",
//       note: isDevelopment
//         ? chance.word({
//             length: 50,
//           })
//         : "",

//       point_amount: isDevelopment
//         ? chance
//             .integer({
//               min: 0,
//               max: 99,
//             })
//             .toString()
//         : "",
//     };
//   } else {
//     return {
//       flow_type: "",
//       owner: isDevelopment
//         ? chance.name({
//             suffix: true,
//           })
//         : "",
//       owner_as_customer: isDevelopment
//         ? chance.name({
//             suffix: true,
//           })
//         : "",
//       note: "",
//       type: "",
//       point_amount: "",
//     };
//   }
// };
