import React, { ReactNode } from 'react';
type Props = {
  type: 'submit' | 'reset' | 'button';
  className: string;
  dataCy: string;
  onClick: () => void;
  children?: ReactNode;
  disabled?: boolean;
};

export const Button: React.FC<Props> = ({
  type,
  className,
  dataCy,
  onClick,
  children,
  disabled,
}) => {
  return (
    <button
      className={className}
      type={type}
      data-cy={dataCy}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
