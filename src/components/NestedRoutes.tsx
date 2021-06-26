import type { FunctionComponent } from "preact";
import { useRouter, useLocation, Router, RouterProps } from "wouter-preact";

export const NestedRoutes: FunctionComponent<RouterProps> = ({ base, children }) => {
  const router = useRouter();
  const [location] = useLocation();
  const nestedBase = `${router.base}${base}`
  if (!location.startsWith(nestedBase)) return null;
  return <Router base={nestedBase} key={nestedBase}>{children}</Router>;
};
