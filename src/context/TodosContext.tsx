import { createContext, Dispatch, useReducer } from 'react';
import { Todo } from '../types/Todo';

export type Action =
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO' | 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'TOGGLE_ALL'; payload: boolean };

function todosHandler(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'SET_TODOS':
      return [...action.payload];
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'UPDATE_TODO':
      return state.map(item =>
        item.id === action.payload.id ? action.payload : item,
      );
    case 'DELETE_TODO':
      return state.filter(item => item.id !== action.payload);
    case 'TOGGLE_ALL':
      return state.map(item => ({
        ...item,
        completed: action.payload,
      }));
    default:
      return state;
  }
}

type DispatchType = Dispatch<Action>;

interface TodoContextType {
  todos: Todo[];
  dispatch: DispatchType;
}

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  dispatch: () => {},
});

type ProviderProps = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<ProviderProps> = ({ children }) => {
  const [todos, dispatch] = useReducer(todosHandler, []);
  const todoContextValue = { todos, dispatch };

  return (
    <TodoContext.Provider value={todoContextValue}>
      {children}
    </TodoContext.Provider>
  );
};
