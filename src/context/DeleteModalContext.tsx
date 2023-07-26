import React, { ReactNode, useState } from 'react';

type ContextType = {
  deleteModal: number[];
  setDeleteModal: (loadDelete: number[]) => void;
};

export const DeleteModalContext = React.createContext<ContextType>({
  deleteModal: [],
  setDeleteModal: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const DeleteModalProvider = ({ children }: ProviderProps) => {
  const [deleteModal, setDeleteModal] = useState<number[]>([]);

  const contextValue = {
    deleteModal,
    setDeleteModal,
  };

  return (
    <DeleteModalContext.Provider value={contextValue}>
      {children}
    </DeleteModalContext.Provider>
  );
};
