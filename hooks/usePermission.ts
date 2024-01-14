import { useContext, useMemo } from "react";
import { PermissionContext, PERMISSION_TYPE } from "context/Permission";

export const usePermission = (codename?: PERMISSION_TYPE) => {
  const { systemPermission, userPermission } = useContext(PermissionContext);

  const hasPermission = useMemo(() => {
    if (codename == undefined) return undefined;

    return userPermission.includes(codename);
  }, [codename, userPermission]);

  return { hasPermission, systemPermission, userPermission };
};
