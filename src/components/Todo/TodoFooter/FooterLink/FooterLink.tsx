import React from 'react';

type Props = {
  dataCy: string,
  href: string,
  className: string,
  text: string,
  onClick: () => void,
};

const FooterLink: React.FC<Props> = ({
  dataCy, href, className, onClick, text,
}) => {
  return (
    <a
      data-cy={dataCy}
      href={href}
      className={`${className}`}
      onClick={onClick}
    >
      {text}
    </a>
  );
};

export default FooterLink;
