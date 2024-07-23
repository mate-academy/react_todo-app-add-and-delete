import { createContext, useReducer } from 'react';
import { States } from '../types/States';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type DispatchContextType = {
  (action: Action): void;
};

type Action =
  | { type: 'loadTodos'; payload: Todo[] }
  | { type: 'showError'; payload: string | null }
  | { type: 'startUpdate' }
  | { type: 'stopUpdate' }
  | { type: 'selectTodo'; payload: number }
  | { type: 'updateTodo'; payload: Todo }
  | { type: 'setFilter'; payload: Filter }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'addTodo'; payload: Todo }
  | { type: 'addTempTodo'; payload: Todo }
  | { type: 'removeTempTodo' };

const initialStates: States = {
  todos: [],
  errorMessage: null,
  isUpdating: false,
  selectedTodo: null,
  filter: Filter.all,
  tempTodo: null,
};

function reducer(states: States, action: Action) {
  let newStates: States = { ...states };

  switch (action.type) {
    case 'loadTodos':
      newStates = { ...newStates, todos: action.payload };
      break;
    case 'showError':
      newStates = { ...newStates, errorMessage: action.payload };
      break;
    case 'startUpdate':
      newStates = { ...newStates, isUpdating: true };
      break;
    case 'stopUpdate':
      newStates = { ...newStates, isUpdating: false };
      break;
    case 'selectTodo':
      newStates = { ...newStates, selectedTodo: action.payload };
      break;
    case 'updateTodo':
      newStates = {
        ...newStates,
        todos: states.todos.map(t =>
          action.payload.id === t.id ? action.payload : t,
        ),
      };
      break;
    case 'setFilter':
      newStates = { ...newStates, filter: action.payload };
      break;
    case 'deleteTodo':
      newStates = {
        ...newStates,
        todos: states.todos.filter(t => t.id !== action.payload),
      };
      break;
    case 'addTodo':
      newStates = {
        ...newStates,
        todos: [...states.todos, action.payload],
      };
      break;
    case 'addTempTodo':
      newStates = { ...newStates, tempTodo: action.payload };
      break;
    case 'removeTempTodo':
      newStates = { ...newStates, tempTodo: null };
      break;
    default:
      return states;
  }

  return newStates;
}

export const StatesContext = createContext(initialStates);
export const DispatchContext = createContext<DispatchContextType>(() => {});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [states, dispatch] = useReducer(reducer, initialStates);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StatesContext.Provider value={states}>{children}</StatesContext.Provider>
    </DispatchContext.Provider>
  );
};
