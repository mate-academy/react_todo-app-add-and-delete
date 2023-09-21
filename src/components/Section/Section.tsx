import React from 'react';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export const Section: React.FC<Props> = (
  {
    title = '',
    children,
  },
) => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        {title}
      </h1>

      {children}
    </div>
  );
};
