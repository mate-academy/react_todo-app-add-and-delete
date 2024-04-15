import React, { useMemo, useState } from 'react';

export const SubmitingConstext = React.createContext({
  isSubmiting: false,
  setIsSubmiting: (isSubmiting: boolean) => {
    // eslint-disable-next-line no-console
    console.log(isSubmiting);
  },
});

type PropsSubmiting = {
  children: React.ReactNode;
};

export const SubmitingProvider: React.FC<PropsSubmiting> = ({ children }) => {
  const [isSubmiting, setIsSubmiting] = useState(false);

  const value = useMemo(
    () => ({
      isSubmiting,
      setIsSubmiting,
    }),
    [isSubmiting],
  );

  return (
    <SubmitingConstext.Provider value={value}>
      {children}
    </SubmitingConstext.Provider>
  );
};
