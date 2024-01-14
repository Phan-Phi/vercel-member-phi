export * from "./Login";

export * from "./Partner/Partner";
export * from "./Partner/PartnerAddress";

export * from "./Advertisement/Advertisement";

export * from "./Setting/AvatarCategory";
export * from "./Setting/Avatar";

export * from "./Setting/AdminAddress";
export * from "./Setting/Admin";

export * from "./Setting/StoreCategory";
export * from "./Setting/NotificationSetting";
export * from "./Setting/Setting";
export * from "./Setting/Rank";

export * from "./Notification/Notification";

export * from "./Customer/Customer";

export * from "./SocialIcon";
export * from "./ChangePassword";

export * from "./ResetPassword";
export * from "./ForgotPassword";

import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "Trường này là bắt buộc",
  },
  string: {
    email: "Định dạng email chưa đúng",
  },
});

export const isDevelopment = process.env.NODE_ENV === "development";
