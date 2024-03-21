import { createContext, useState } from 'react';

type SetIsDeletingCompleted = React.Dispatch<React.SetStateAction<boolean>>;

export const IsDeletingCompletedContext = createContext(false);
export const SetIsDeletingCompletedContext =
  createContext<SetIsDeletingCompleted>(() => []);

type Props = {
  children: React.ReactNode;
};

export const IsDeletingCompletedContextProvider: React.FC<Props> = ({
  children,
}) => {
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  return (
    <IsDeletingCompletedContext.Provider value={isDeletingCompleted}>
      <SetIsDeletingCompletedContext.Provider value={setIsDeletingCompleted}>
        {children}
      </SetIsDeletingCompletedContext.Provider>
    </IsDeletingCompletedContext.Provider>
  );
};
