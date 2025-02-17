import { createContext, ReactNode, useContext, useState, useMemo } from 'react';
import { TodoInterface } from '../types/Todo';
import { TodoContext } from './TodoContext';

export enum ACTIONSINFILTERCONTEXT {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  ACTIVE = 'ACTIVE',
}

interface FilterContextDataType {
  filteredTodos: TodoInterface[];
  setFilterCriteria: React.Dispatch<ACTIONSINFILTERCONTEXT>;
  currentFilterCriteria: ACTIONSINFILTERCONTEXT;
  itemsLeft: number;
  totalCompletedTodos: number;
}

export const FilterContext = createContext<undefined | FilterContextDataType>(
  undefined,
);

const refreshFilteredList = (
  state: Readonly<TodoInterface[]>,
  action: ACTIONSINFILTERCONTEXT,
) => {
  let newState;

  switch (action) {
    case ACTIONSINFILTERCONTEXT.ACTIVE:
      newState = state.filter(e => !e.completed);
      break;
    case ACTIONSINFILTERCONTEXT.COMPLETED:
      newState = state.filter(e => e.completed);
      break;
    default:
      newState = state;
      break;
  }

  return newState.map(e => {
    return { ...e };
  });
};

export const FilterContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { todosFromServer: todos } = useContext(TodoContext)!;

  const [criteriaFilter, setCriteriaFilter] = useState(
    ACTIONSINFILTERCONTEXT.ALL,
  );

  const totalCompletedTodos = useMemo(() => {
    return todos.reduce((acc: number, el: TodoInterface) => {
      const counter = acc + (el.completed ? 1 : 0);

      return counter;
    }, 0);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return refreshFilteredList(todos, criteriaFilter);
  }, [todos, criteriaFilter]);

  const itemsLeft = useMemo(
    () =>
      todos.reduce((acc: number, el: TodoInterface) => {
        const counter = acc + (el.completed || el.id === 0 ? 0 : 1);

        return counter;
      }, 0),
    [todos],
  );

  return (
    <FilterContext.Provider
      value={{
        filteredTodos: filteredTodos,
        setFilterCriteria: setCriteriaFilter,
        currentFilterCriteria: criteriaFilter,
        itemsLeft: itemsLeft,
        totalCompletedTodos: totalCompletedTodos,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
