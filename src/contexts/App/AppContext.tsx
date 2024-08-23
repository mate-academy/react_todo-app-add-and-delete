import ErrorsContext from '../Errors/ErrorsContext';
import TodosContext from '../Todos/TodosContext';
import FilterContext from '../Filter/FilterContext';

import { PropsWithChildren } from 'react';

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <ErrorsContext.Provider>
      <TodosContext.Provider>
        <FilterContext.Provider>{children}</FilterContext.Provider>
      </TodosContext.Provider>
    </ErrorsContext.Provider>
  );
};
