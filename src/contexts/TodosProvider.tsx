import React, {
  useEffect, useMemo, useReducer, useState,
} from 'react';
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
  type: TodoAction.SetOperatingTodoIds,
  todoIds: number[],
} | {
  type: TodoAction.AddOperatingTodoId | TodoAction.DeleteOperatingTodoId,
  todoId: number,
};

interface State {
  filterOptions: FilterOptions,
  errorMessage: string,
  operatingTodoIds: number[],
}

function reducer(
  state: State,
  action: Action,
): State {
  switch (action.type) {
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

    case TodoAction.SetOperatingTodoIds: {
      return {
        ...state,
        operatingTodoIds: action.todoIds,
      };
    }

    case TodoAction.AddOperatingTodoId: {
      return {
        ...state,
        operatingTodoIds: [...state.operatingTodoIds, action.todoId],
      };
    }

    case TodoAction.DeleteOperatingTodoId: {
      return {
        ...state,
        operatingTodoIds: state.operatingTodoIds
          .filter(id => id !== action.todoId),
      };
    }

    default:
      break;
  }

  return state;
}

export const TodosUpdateContext = React.createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleAll: (_isAllCompleted: boolean) => { },
  updateTodo: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _todoId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _updatedFields: Partial<Todo>,
  ) => (Promise.prototype),
  clearCompleted: () => { },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addTodo: (_todo: Todo) => (Promise.prototype),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteTodo: (_todoId: number) => (Promise.prototype),
});

export const TodosContext = React.createContext({
  errorMessage: '',
  todos: [] as Todo[],
  filterOptions: FilterOptions.All,
  operatingTodoIds: [] as number[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch: (_action: Action) => { },
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    filterOptions: FilterOptions.All,
    errorMessage: '',
    operatingTodoIds: [],
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
  ) {
    return api.addTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        dispatch({
          type: TodoAction.SetError,
          errorMessage: 'Unable to add a todo',
        });
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function deleteTodo(todoId: number): Promise<void> {
    dispatch({
      type: TodoAction.AddOperatingTodoId,
      todoId,
    });

    return api.deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        dispatch({
          type: TodoAction.SetError,
          errorMessage: 'Unable to delete a todo',
        });

        throw new Error();
      })
      .finally(() => {
        dispatch({
          type: TodoAction.DeleteOperatingTodoId,
          todoId,
        });
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function updateTodo(
    todoId: number,
    updatedFields: Partial<Todo>,
  ): Promise<void> {
    dispatch({
      type: TodoAction.AddOperatingTodoId,
      todoId,
    });

    return api.updateTodo(todoId, updatedFields)
      .then((updatedTodo) => {
        const updatedTodoIndex = todos.findIndex(todo => todo.id === todoId);

        setTodos(currentTodos => ([
          ...currentTodos.slice(0, updatedTodoIndex),
          updatedTodo,
          ...currentTodos.slice(updatedTodoIndex + 1),
        ]));
      })
      .catch(() => {
        dispatch({
          type: TodoAction.SetError,
          errorMessage: 'Unable to update a todo',
        });

        throw new Error();
      })
      .finally(() => {
        dispatch({
          type: TodoAction.DeleteOperatingTodoId,
          todoId,
        });
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function clearCompleted() {
    const completedTodos = todos.filter(({ completed }) => completed);
    const completedTodoIds = completedTodos.map(({ id }) => id);

    dispatch({
      type: TodoAction.SetOperatingTodoIds,
      todoIds: [...state.operatingTodoIds, ...completedTodoIds],
    });

    const deletedTodoIds: number[] = [];

    return Promise.allSettled(completedTodos.map(({ id }) => (
      api.deleteTodo(id)
        .then(() => deletedTodoIds.push(id)))))
      .then((results) => {
        if (results.some(result => result.status === 'rejected')) {
          dispatch({
            type: TodoAction.SetError,
            errorMessage: 'Unable to delete a todo',
          });
        }
      })
      .finally(() => {
        setTodos(todos.filter(todo => !deletedTodoIds.includes(todo.id)));

        dispatch({
          type: TodoAction.SetOperatingTodoIds,
          todoIds: state
            .operatingTodoIds.filter((id) => !completedTodoIds.includes(id)),
        });
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function toggleAll(isAllCompleted: boolean) {
    if (isAllCompleted) {
      dispatch({
        type: TodoAction.SetOperatingTodoIds,
        todoIds: [...state.operatingTodoIds, ...todos.map(({ id }) => id)],
      });

      const updatedTodoIds: number[] = [];

      return Promise.allSettled(
        todos.map(todo => api.updateTodo(todo.id, { completed: false })
          .then(() => updatedTodoIds.push(todo.id))),
      )
        .then((results) => {
          if (results.some(result => result.status === 'rejected')) {
            dispatch({
              type: TodoAction.SetError,
              errorMessage: 'Unable to update a todo',
            });
          }
        })
        .finally(() => {
          setTodos(todos.map(todo => (
            { ...todo, completed: !updatedTodoIds.includes(todo.id) })));

          dispatch({
            type: TodoAction.SetOperatingTodoIds,
            todoIds: [],
          });
        });
    }

    const uncompletedTodos = todos.filter(({ completed }) => !completed);
    const uncompletedTodoIds = uncompletedTodos.map(({ id }) => id);

    dispatch({
      type: TodoAction.SetOperatingTodoIds,
      todoIds: uncompletedTodoIds,
    });

    const updatedTodoIds: number[] = [];

    return Promise.allSettled(
      uncompletedTodos.map(todo => api.updateTodo(todo.id, { completed: true })
        .then(() => updatedTodoIds.push(todo.id))),
    )
      .then((results) => {
        if (results.some(result => result.status === 'rejected')) {
          dispatch({
            type: TodoAction.SetError,
            errorMessage: 'Unable to update a todo',
          });
        }
      })
      .finally(() => {
        setTodos(
          todos.map(todo => (uncompletedTodoIds.includes(todo.id)
            ? ({ ...todo, completed: updatedTodoIds.includes(todo.id) })
            : todo)),
        );

        dispatch({
          type: TodoAction.SetOperatingTodoIds,
          todoIds: state.operatingTodoIds
            .filter((id) => !uncompletedTodoIds.includes(id)),
        });
      });
  }

  const todosContextValue = useMemo(() => {
    return {
      todos,
      filterOptions: state.filterOptions,
      errorMessage: state.errorMessage,
      operatingTodoIds: state.operatingTodoIds,
      dispatch,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, todos]);

  const methods = useMemo(() => ({
    toggleAll,
    updateTodo,
    clearCompleted,
    addTodo,
    deleteTodo,
  }), [toggleAll, updateTodo, clearCompleted, deleteTodo]);

  return (
    <TodosUpdateContext.Provider value={methods}>
      <TodosContext.Provider value={todosContextValue}>
        {children}
      </TodosContext.Provider>
    </TodosUpdateContext.Provider>
  );
};
