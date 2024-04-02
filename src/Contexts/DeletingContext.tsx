import { createContext, useState } from 'react';

type SetIsDeletingType = React.Dispatch<React.SetStateAction<boolean>>;

export const IsDeletingContext = createContext<boolean>(false);
export const SetIsDeletingContext = createContext<SetIsDeletingType>(() => []);

type Props = {
  children: React.ReactNode;
};

export const IsDeletingProvider: React.FC<Props> = ({ children }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  return (
    <IsDeletingContext.Provider value={isDeleting}>
      <SetIsDeletingContext.Provider value={setIsDeleting}>
        {children}
      </SetIsDeletingContext.Provider>
    </IsDeletingContext.Provider>
  );
};
