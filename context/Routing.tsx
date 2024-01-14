import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";

import "nprogress/nprogress.css";

interface RoutingProps {
  children: JSX.Element;
}

const Routing = ({ children }: RoutingProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      NProgress.start();
    };
    const handleRouteComplete = () => {
      NProgress.done();
    };
    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);
    router.events.on("routeChangeError", handleRouteComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteComplete);
      router.events.off("routeChangeError", handleRouteComplete);
    };
  }, []);

  return children;
};

export default Routing;
