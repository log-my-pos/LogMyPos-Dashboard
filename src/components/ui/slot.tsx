import { useRender } from '@base-ui/react/use-render';
import React from 'react';

type SlotProps = {
  children?: React.ReactNode;
} & Record<string, unknown>;

function Slot({ children, ...props }: SlotProps) {
  const child = React.Children.only(children);
  return useRender({
    render: child as React.ReactElement<Record<string, unknown>>,
    props: props,
  });
}

export { Slot };