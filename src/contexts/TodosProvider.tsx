import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoAction } from '../types/TodoAction';
import { FilterOptions } from '../types/FilterOptions';
import * as api from '../api/todos';
import { USER_ID } from '../constants/USER_ID';

interface Props {
  children: React.ReactNode,
}

type Action = {
  type: TodoAction.SetFilterOptions,
  filterOptions: FilterOptions,
} | {
  type: TodoAction.SetError,
  errorMessage: string,
} | {
  type: TodoAction.SetOperatingTodos,
  todos: Todo[],
};

interface State {
  filterOptions: FilterOptions,
  errorMessage: string,
  operatingTodos: Todo[],
}

function reducer(
  state: State,
  action: Action,
): State {
  switch (action.type) {
    // case TodoAction.Add: {
    //   return {
    //     ...state,
    //     todos: [...state.todos, action.todo],
    //   };
    // }

    // case TodoAction.Delete: {
    //   const newTodos = state.todos.filter(currentTodo => ((
    //     currentTodo.id !== action.todo.id)));

    //   return {
    //     ...state,
    //     todos: newTodos,
    //   };
    // }

    // case TodoAction.Update: {
    //   const todoCopy = [...state.todos];
    //   const editedTodoIndex
    //     = todoCopy.findIndex(currentTodo => (
    //       currentTodo.id === action.todo.id));

    //   todoCopy[editedTodoIndex] = action.todo;

    //   return {
    //     ...state,
    //     todos: todoCopy,
    //   };
    // }

    // case TodoAction.ClearCompleted: {
    //   const completedTodos = state.todos.filter(({ completed }) => completed);

    //   Promise.all(completedTodos.map(({ id }) => deleteTodo(id)))
    //     .then(() => {
    //       return {
    //         ...state,
    //         operatingTodos: [],
    //       };
    //     })
    //     .catch(() => {
    //       return {
    //         ...state,
    //         errorMessage: 'Unable to delete todo',
    //       };
    //     })
    //     .finally(() => {
    //       getTodos().then(todos => {

    //       })
    //     });

    //   break;
    // }

    // case TodoAction.SetTodos: {
    //   return {
    //     ...state,
    //     todos: action.todos,
    //   };
    // }

    case TodoAction.SetFilterOptions: {
      return {
        ...state,
        filterOptions: action.filterOptions,
      };
    }

    case TodoAction.SetError: {
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    }

    case TodoAction.SetOperatingTodos: {
      return {
        ...state,
        operatingTodos: action.todos,
      };
    }

    default:
      break;
  }

  return state;
}

export const TodosUpdateContext = React.createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearCompleted: (_completedTodos: Todo[]) => { },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addTodo: (_todo: Todo, _onSuccess = () => {}, _onFinally = () => {}) => { },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteTodo: (_todoId: number, _onError = () => {}) => { },
});

export const TodosContext = React.createContext({
  errorMessage: '',
  todos: [] as Todo[],
  filterOptions: FilterOptions.All,
  operatingTodos: [] as Todo[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch: (_action: Action) => { },
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    filterOptions: FilterOptions.All,
    errorMessage: '',
    operatingTodos: [],
  });

  function loadTodos() {
    api.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        dispatch({
          type: TodoAction.SetError,
          errorMessage: 'Unable to load todos',
        });
      });
  }

  useEffect(() => {
    loadTodos();
  }, []);

  function addTodo(
    todo: Todo,
    onSuccess = () => {},
    onFinally = () => {},
  ) {
    return api.addTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        onSuccess();
      })
      .catch(() => {
        dispatch({
          type: TodoAction.SetError,
          errorMessage: 'Unable to add a todo',
        });
      })
      .finally(() => onFinally());
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function deleteTodo(id: number, onError = () => {}) {
    return api.deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        onError();
      })
      .finally(() => {
        dispatch({
          type: TodoAction.SetOperatingTodos,
          todos: state.operatingTodos
            .filter(operatingTodo => operatingTodo.id !== id),
        });
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function clearCompleted(completedTodos: Todo[]) {
    return Promise.all(completedTodos.map(({ id }) => deleteTodo(id)))
      .catch(() => {
        dispatch({
          type: TodoAction.SetError,
          errorMessage: 'Unable to delete todo',
        });
      })
      .finally(() => {
        dispatch({
          type: TodoAction.SetOperatingTodos,
          todos: [],
        });

        loadTodos();
      });
  }

  // function updateTodo(todoId: number, updatedFields: Partial<Todo>) {

  // }

  const todosContextValue = useMemo(() => {
    return {
      todos,
      filterOptions: state.filterOptions,
      errorMessage: state.errorMessage,
      operatingTodos: state.operatingTodos,
      dispatch,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, todos]);

  const methods = useMemo(() => ({
    clearCompleted,
    addTodo,
    deleteTodo,
  }), [deleteTodo, clearCompleted]);

  return (
    <TodosUpdateContext.Provider value={methods}>
      <TodosContext.Provider value={todosContextValue}>
        {children}
      </TodosContext.Provider>
    </TodosUpdateContext.Provider>
  );
};
