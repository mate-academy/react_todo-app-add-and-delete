import classNames from 'classnames';
import React from 'react';

type Props = {
  href: string;
  className: string;
  dataCy: string;
  content: string;
  status: string;
  onClick?: () => void;
};

export const Link: React.FC<Props> = ({
  href,
  className,
  dataCy,
  content,
  status,
  onClick = () => {},
}) => {
  return (
    <a
      href={href}
      className={classNames(className, { selected: status === content })}
      data-cy={dataCy}
      onClick={onClick}
    >
      {content}
    </a>
  );
};
