import React, { ReactNode, createContext, useEffect, useReducer } from 'react';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { updateTodo } from './api/todos';

interface State {
  todos: Todo[];
  tempTodo: Todo | null;
  filterBy: Status;
  error: string | null;
  loading: boolean;
  selectedTodoId: number;
  isTodoDeleted: boolean;
}

const initialState: State = {
  todos: [],
  tempTodo: null,
  filterBy: Status.ALL,
  error: null,
  loading: false,
  selectedTodoId: 0,
  isTodoDeleted: false,
};

type Action =
  | { type: 'filter'; payload: Status }
  | { type: 'addTodo'; payload: Todo }
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'clearCompleted' }
  | { type: 'setToggleAll'; payload: boolean }
  | { type: 'editTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: number | undefined }
  | { type: 'setIsTodoDeleted'; payload: boolean }
  | { type: 'setError'; payload: string | null }
  | { type: 'loading'; payload: { load: boolean; id: number } }
  | { type: 'setTempTodo'; payload: Todo | null }
  | { type: 'toggleTodo'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'filter':
      return {
        ...state,
        filterBy: action.payload,
      };

    case 'setTodos':
      return {
        ...state,
        todos: action.payload,
      };

    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'setIsTodoDeleted':
      return {
        ...state,
        isTodoDeleted: action.payload,
      };

    case 'clearCompleted':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    case 'setError':
      return {
        ...state,
        error: action.payload,
      };

    case 'loading':
      return {
        ...state,
        loading: action.payload.load,
        selectedTodoId: action.payload.id,
      };

    case 'editTodo':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return { ...todo, ...action.payload };
          }

          return todo;
        }),
      };

    case 'toggleTodo':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        }),
      };

    case 'setToggleAll':
      return {
        ...state,
        todos: state.todos.map(todo => {
          updateTodo({
            ...todo,
            completed: !action.payload,
          });

          return {
            ...todo,
            completed: !action.payload,
          };
        }),
      };

    default:
      return state;
  }
}

const getLocalStorege = () => {
  const storedTodos = localStorage.getItem('todos');

  return {
    ...initialState,
    todos: storedTodos ? JSON.parse(storedTodos) : [],
  };
};

export const TodosContext = createContext(initialState);
export const DispatchContext = createContext<(action: Action) => void>(
  () => {},
);

type Props = {
  children: ReactNode;
};

export const Store: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, getLocalStorege);
  const { todos } = state;

  useEffect(() => {
    if (todos) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <TodosContext.Provider value={state}>{children}</TodosContext.Provider>
    </DispatchContext.Provider>
  );
};
