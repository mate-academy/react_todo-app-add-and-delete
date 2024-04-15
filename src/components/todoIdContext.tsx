import React, { useMemo, useState } from 'react';

interface TodoIdContextType {
  allId: number[];
  setAllId: (allId: number[]) => void;
}

export const TodoIdConstext = React.createContext<TodoIdContextType>({
  allId: [],
  setAllId: (allId: number[]) => {
    // eslint-disable-next-line no-console
    console.log(allId);
  },
});

type PropsTodoId = {
  children: React.ReactNode;
};

export const TodoIdProvider: React.FC<PropsTodoId> = ({ children }) => {
  const [allId, setAllId] = useState<number[]>([]);

  const value = useMemo(
    () => ({
      allId,
      setAllId,
    }),
    [allId],
  );

  return (
    <TodoIdConstext.Provider value={value}>{children}</TodoIdConstext.Provider>
  );
};
