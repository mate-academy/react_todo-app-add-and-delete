import React from 'react';

type Props = {
  type: 'button' | 'submit' | 'reset' | undefined;
  className: string;
  dataCy: string;
  content?: string;
  onClick?: () => void;
};

export const Button: React.FC<Props> = ({
  type,
  className,
  dataCy,
  content = '',
  onClick = () => {},
}) => {
  return (
    <button
      type={type}
      className={className}
      data-cy={dataCy}
      onClick={onClick}
    >
      {content}
    </button>
  );
};
