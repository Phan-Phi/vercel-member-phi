import useSWR from "swr";
import { useSession } from "next-auth/react";
import React, { createContext, useMemo } from "react";

import { ME, PERMISSIONS } from "apis";

import { ME_ITEM, PERMISSIONS_ITEM, responseSchema } from "interfaces";
import { transformUrl } from "libs";
import { isEmpty } from "lodash";

interface PermissionProps {
  children: React.ReactNode;
}

export type PERMISSION_TYPE = (typeof SYSTEM_PERMISSION_LIST)[number];

export const PermissionContext = createContext<{
  userPermission: string[];
  systemPermission: PERMISSION_TYPE[];
}>({
  userPermission: [],
  systemPermission: [],
});

const Permission = ({ children }: PermissionProps) => {
  const { status } = useSession();

  const { data: resMeData, error } = useSWR<ME_ITEM>(() => {
    if (status !== "authenticated") return;

    return ME;
  });

  const { data: resUserPermissionData } = useSWR<responseSchema<PERMISSIONS_ITEM>>(
    () => {
      if (resMeData == undefined) return;

      return transformUrl(resMeData.permissions, {
        get_all: true,
      });
    },
    {
      refreshInterval: 5 * 60 * 1000,
    }
  );

  const { data: resSystemPermissionData } = useSWR<responseSchema<PERMISSIONS_ITEM>>(
    () => {
      if (status !== "authenticated") return;

      return transformUrl(PERMISSIONS, {
        get_all: true,
      });
    },
    {
      refreshInterval: 30 * 60 * 1000,
    }
  );

  const contextValue = useMemo(() => {
    if (status === "unauthenticated") {
      return {
        userPermission: [],
        systemPermission: [],
      };
    }

    if (resUserPermissionData == undefined || resSystemPermissionData == undefined)
      return null;

    const systemPermission = resSystemPermissionData.results.map(
      (el) => el.codename
    ) as PERMISSION_TYPE[];

    let userPermission: string[] = [];

    if (isEmpty(resUserPermissionData.results)) {
      userPermission = systemPermission;
    } else {
      userPermission = resUserPermissionData.results.map((el) => el.codename);
    }

    return {
      userPermission,
      systemPermission,
    };
  }, [resUserPermissionData, resSystemPermissionData, status]);

  if (contextValue == undefined) return null;

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};

export default Permission;

const SYSTEM_PERMISSION_LIST = [
  "approve_pending_image",
  "approve_point_note",
  "export_customer_report",
  "export_merchant_report",
  "read_admin",
  "read_admin_transaction",
  "read_advertisement",
  "read_auditlog",
  "read_cashier",
  "read_category",
  "read_customer",
  "read_customer_report",
  "read_customer_transaction",
  "read_feedback",
  "read_introduce_event",
  "read_membership",
  "read_merchant",
  "read_merchant_report",
  "read_merchant_transaction",
  "read_modifier",
  "read_notification",
  "read_order",
  "read_pending_image",
  "read_point_note",
  "read_product",
  "read_promotion",
  "read_rank",
  "read_rank_band",
  "read_store",
  "read_store_branch",
  "read_store_category",
  "write_admin",
  "write_advertisement",
  "write_avatar",
  "write_avatar_category",
  "write_cashier",
  "write_customer",
  "write_merchant",
  "write_notification",
  "write_point_note",
  "write_rank",
  "write_setting_internal",
  "write_setting_notification",
  "write_setting_point_earn",
  "write_store",
  "write_store_category",
  "write_version",
  "export_transaction",
] as const;
