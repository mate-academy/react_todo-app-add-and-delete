import React from 'react';

type Props = {
  className: string;
  children: React.ReactNode;
};

export const Label: React.FC<Props> = ({ className, children }) => (
  <label className={className}>{children}</label>
);
