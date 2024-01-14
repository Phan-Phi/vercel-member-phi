import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import StackedLineChartOutlinedIcon from "@mui/icons-material/StackedLineChartOutlined";

import { SvgIconComponent } from "@mui/icons-material";

import { PERMISSION_TYPE } from "context/Permission";

export type RouteItemProps = {
  label: string;
  icon?: SvgIconComponent;
  route?: string;
  codename?: PERMISSION_TYPE | "general";
  routes?: ChildRouteItemProps[];
};

export type ChildRouteItemProps = {
  label: string;
  route: string;
  codename?: PERMISSION_TYPE;
};

type RouteType = RouteItemProps[];

export const PATHNAME = {
  // Parner
  DOI_TAC: "doi-tac",
  TAO_MOI: "tao-moi",
  TAI_KHOAN: "tai-khoan",

  THIET_LAP_QUAN: "thiet-lap-quan",

  LICH_SU: "lich-su",
  LICH_SU_GIAO_DICH: "lich-su-giao-dich",
  LICH_SU_DON_HANG: "lich-su-don-hang",
  KHACH_HANG: "khach-hang",
  XU_LY_DIEM: "xu-ly-diem",
  // Setting
  CAI_DAT: "cai-dat",
  CAU_HINH: "cau-hinh",
  AVATAR: "avatar",
  NGUOI_DUNG: "nguoi-dung",
  CAP_NHAT: "cap-nhat",
  DANH_MUC_QUAN: "danh-muc-quan",
  TICH_DIEM_CAP_NHAT: "tich-diem-cap-nhat",
  THONG_BAO_CAP_NHAT: "thong-bao-cap-nhat",

  // Report

  BAO_CAO: "bao-cao",

  // Notification
  THONG_BAO: "thong-bao",

  // Notification
  QUANG_CAO: "quang-cao",
  TIN_TUC: "tin-tuc",
} as const;

export const ROUTES: RouteType = [
  {
    label: "Tổng Quan",
    icon: HomeOutlinedIcon,
    route: "/",
    codename: "read_auditlog",
  },

  {
    label: "Đối tác",
    icon: HandshakeOutlinedIcon,
    codename: "read_merchant",
    routes: [
      {
        label: "Tài Khoản",
        route: "/doi-tac/tai-khoan",
        codename: "read_merchant",
      },
      {
        label: "Thiết Lập Quán",
        route: "/doi-tac/thiet-lap-quan",
        codename: "read_store",
      },
      {
        label: "Lịch Sử",
        route: "/doi-tac/lich-su",
        codename: "read_customer_transaction",
      },
      {
        label: "Xử Lý Điểm",
        route: "/doi-tac/xu-ly-diem",
        codename: "read_point_note",
      },
      {
        label: "Xử Lý Hình Ảnh",
        route: "/doi-tac/xu-ly-anh",
        codename: "read_pending_image",
      },
    ],
  },
  {
    label: "Khách hàng",
    icon: PeopleAltOutlinedIcon,
    codename: "read_customer",
    routes: [
      {
        label: "Tài Khoản",
        route: "/khach-hang/tai-khoan",
        codename: "read_customer",
      },
      {
        label: "Lịch Sử",
        route: "/khach-hang/lich-su",
        codename: "read_customer_report",
      },
      // {
      //   label: "Tặng Điểm",
      //   route: "/khach-hang/tang-diem",
      //   codename: "read_customer_report",
      // },
    ],
  },
  {
    label: "Báo Cáo",
    icon: StackedLineChartOutlinedIcon,
    codename: "general",
    routes: [
      {
        label: "Đối tác, Quán",
        route: "/bao-cao/doi-tac",
        codename: "read_merchant_report",
      },
      {
        label: "Khách hàng",
        route: "/bao-cao/khach-hang",
        codename: "read_customer_report",
      },
    ],
  },
  {
    label: "Quảng Cáo",
    icon: CalendarMonthOutlinedIcon,
    route: "/quang-cao/tin-tuc",
    codename: "read_advertisement",
  },
  {
    label: "Thông Báo",
    icon: NotificationsOutlinedIcon,
    route: "/thong-bao",
    codename: "read_notification",
  },
  {
    label: "Cài đặt",
    icon: SettingsOutlinedIcon,
    codename: "general",
    routes: [
      {
        label: "Danh Mục",
        route: "/cai-dat/danh-muc-quan",
        codename: "read_store_category",
      },
      {
        label: "Cấu Hình",
        route: "/cai-dat/cau-hinh",
        codename: "write_setting_internal",
      },
      {
        label: "Avatar",
        route: "/cai-dat/avatar",
        codename: "write_avatar",
      },
      {
        label: "Người Dùng",
        route: "/cai-dat/nguoi-dung",
        codename: "read_admin",
      },

      {
        label: "Cập Nhật",
        route: "/cai-dat/cap-nhat",
        codename: "write_version",
      },
    ],
  },
];

// [
//   "read_customer_report",
//   "read_merchant_report",
//   "read_customer_transaction",
//   "read_merchant_transaction",
//   "read_introduce_event",
//   "read_store",
//   "read_store_branch",
//   "read_order"
// ];

export const ACCOUNTANT_ROUTES: RouteType = [
  {
    label: "Tổng Quan",
    icon: HomeOutlinedIcon,
    route: "/",
  },
  {
    label: "Đối tác",
    icon: HandshakeOutlinedIcon,
    routes: [
      {
        label: "Tài Khoản",
        route: "/doi-tac/tai-khoan",
        codename: "read_merchant",
      },
      {
        label: "Thiết Lập Quán",
        route: "/doi-tac/thiet-lap-quan",
      },
      {
        label: "Lịch Sử",
        route: "/doi-tac/lich-su",
      },
    ],
  },
  {
    label: "Khách hàng",
    icon: PeopleAltOutlinedIcon,
    routes: [
      {
        label: "Lịch Sử",
        route: "/khach-hang/lich-su",
      },
    ],
  },
  {
    label: "Báo Cáo",
    icon: StackedLineChartOutlinedIcon,
    routes: [
      {
        label: "Đối tác, Quán",
        route: "/bao-cao/doi-tac",
      },
      {
        label: "Khách hàng",
        route: "/bao-cao/khach-hang",
      },
    ],
  },

  {
    label: "Cài đặt",
    icon: SettingsOutlinedIcon,
    routes: [
      {
        label: "Người Dùng",
        route: "/cai-dat/nguoi-dung",
        codename: "read_admin",
      },
    ],
  },
];

export const SALE_ROUTES: RouteType = [
  {
    label: "Tổng Quan",
    icon: HomeOutlinedIcon,
    route: "/",
  },

  {
    label: "Đối tác",
    icon: HandshakeOutlinedIcon,
    routes: [
      {
        label: "Tài Khoản",
        route: "/doi-tac/tai-khoan",
      },
      {
        label: "Thiết Lập Quán",
        route: "/doi-tac/thiet-lap-quan",
      },
      {
        label: "Lịch Sử",
        route: "/doi-tac/lich-su",
      },
      {
        label: "Xử Lý Điểm",
        route: "/doi-tac/xu-ly-diem",
      },
      {
        label: "Xử Lý Hình Ảnh",
        route: "/doi-tac/xu-ly-anh",
      },
    ],
  },
  {
    label: "Khách hàng",
    icon: PeopleAltOutlinedIcon,
    routes: [
      {
        label: "Tài Khoản",
        route: "/khach-hang/tai-khoan",
      },
      {
        label: "Lịch Sử",
        route: "/khach-hang/lich-su",
      },
    ],
  },
  {
    label: "Báo Cáo",
    icon: StackedLineChartOutlinedIcon,
    routes: [
      {
        label: "Đối tác, Quán",
        route: "/bao-cao/doi-tac",
      },
      {
        label: "Khách hàng",
        route: "/bao-cao/khach-hang",
      },
    ],
  },
  {
    label: "Cài đặt",
    icon: SettingsOutlinedIcon,
    routes: [
      {
        label: "Danh Mục",
        route: "/cai-dat/danh-muc-quan",
      },
      {
        label: "Cấu Hình",
        route: "/cai-dat/cau-hinh",
      },
      {
        label: "Người Dùng",
        route: "/cai-dat/nguoi-dung",
      },
    ],
  },
];

export const MARKETING_ROUTES: RouteType = [
  {
    label: "Tổng Quan",
    icon: HomeOutlinedIcon,
    route: "/",
  },

  {
    label: "Đối tác",
    icon: HandshakeOutlinedIcon,
    routes: [
      {
        label: "Tài Khoản",
        route: "/doi-tac/tai-khoan",
      },
      {
        label: "Thiết Lập Quán",
        route: "/doi-tac/thiet-lap-quan",
      },
    ],
  },
  {
    label: "Khách hàng",
    icon: PeopleAltOutlinedIcon,
    routes: [
      {
        label: "Tài Khoản",
        route: "/khach-hang/tai-khoan",
      },
      {
        label: "Lịch Sử",
        route: "/khach-hang/lich-su",
      },
    ],
  },
  {
    label: "Báo Cáo",
    icon: StackedLineChartOutlinedIcon,
    routes: [
      {
        label: "Đối tác, Quán",
        route: "/bao-cao/doi-tac",
      },
      {
        label: "Khách hàng",
        route: "/bao-cao/khach-hang",
      },
    ],
  },
  {
    label: "Quảng Cáo",
    icon: CalendarMonthOutlinedIcon,
    route: "/quang-cao/tin-tuc",
  },
  {
    label: "Thông Báo",
    icon: NotificationsOutlinedIcon,
    route: "/thong-bao",
  },
  {
    label: "Cài đặt",
    icon: SettingsOutlinedIcon,
    routes: [
      {
        label: "Cấu Hình",
        route: "/cai-dat/cau-hinh",
      },

      {
        label: "Người Dùng",
        route: "/cai-dat/nguoi-dung",
      },
    ],
  },
];

export const QC_ROUTES: RouteType = ROUTES;

export const UNAUTH_ROUTES = ["/dang-nhap", "/dat-lai-mat-khau", "/quen-mat-khau"];
