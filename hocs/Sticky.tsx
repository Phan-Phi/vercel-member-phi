import Sticky from "react-stickynode";

import { SAFE_OFFSET } from "constant";

interface HOCStickyProps {
  children: React.ReactNode;
  StickyProps?: Omit<React.ComponentPropsWithoutRef<typeof Sticky>, "children">;
}

const HOCSticky = (props: HOCStickyProps) => {
  const { children, StickyProps } = props;

  return (
    <Sticky top={SAFE_OFFSET.top} {...StickyProps}>
      {children}
    </Sticky>
  );
};

export default HOCSticky;
