/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';

export const ManageCheckboxContext = React.createContext({
  isChecked: false,
  setIsChecked: (isChecked: boolean) => {},
});

type PropsIsItChecked = {
  children: React.ReactNode;
};

export const ManageCheckboxProvider: React.FC<PropsIsItChecked> = ({
  children,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const value = useMemo(
    () => ({
      isChecked,
      setIsChecked,
    }),
    [isChecked],
  );

  return (
    <ManageCheckboxContext.Provider value={value}>
      {children}
    </ManageCheckboxContext.Provider>
  );
};
