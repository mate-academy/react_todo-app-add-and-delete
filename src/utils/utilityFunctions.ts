import React from 'react';
import { deleteTodo, addTodo, updateTodo } from '../api/todos';
import { IsActiveError } from '../types/types';
import { Todo } from '../types/Todo';

interface FunctionParams {
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsError: React.Dispatch<React.SetStateAction<IsActiveError>>;
  setIsClearing: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleDeleteAll(args: FunctionParams) {
  args.event.preventDefault();

  args.setIsClearing(true);

  const arrayOfDeletedTodos: number[] = [];
  const completedTodos = args.todos.filter(todo => todo.completed);

  Promise.all(
    completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => {
          arrayOfDeletedTodos.push(todo.id);
        })
        .catch(() => {
          args.setIsError(IsActiveError.Delete);
        });
    }),
  ).finally(() => {
    args.setIsClearing(false);
    args.setTodos(
      args.todos.filter(item => !arrayOfDeletedTodos.includes(item.id)),
    );
  });
}

interface AddTodoParams {
  event: React.FormEvent<HTMLFormElement>;
  query: string;
  todos: Todo[];
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsError: React.Dispatch<React.SetStateAction<IsActiveError>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export function handleAddTodo(args: AddTodoParams) {
  args.event.preventDefault();

  if (args.query) {
    args.setIsDisabled(true);
    args.setTempTodo({
      id: 0,
      title: args.query.trim(),
      completed: false,
      userId: 833,
    });

    addTodo({ userId: 833, title: args.query.trim(), completed: false })
      .then(response => {
        args.setTodos([...args.todos, response]);
        args.setQuery('');
      })
      .catch(() => {
        args.setIsError(IsActiveError.Add);
      })
      .finally(() => {
        args.setTempTodo(null);
        args.setIsDisabled(false);
      });
  } else {
    args.setIsError(IsActiveError.Empty);
  }
}

export type ActionEvents =
  | React.FocusEvent<HTMLFormElement, Element>
  | React.MouseEvent<HTMLInputElement, MouseEvent>
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | React.FormEvent<HTMLFormElement>;

interface DeleteTodoParams {
  event: ActionEvents;
  id: number;
  newList: Todo[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsError: React.Dispatch<React.SetStateAction<IsActiveError>>;
}

export function handleDeleteTodo(args: DeleteTodoParams) {
  args.event.preventDefault();

  args.setIsLoading(true);

  deleteTodo(args.id)
    .then(() => {
      args.setTodos(args.newList);
    })
    .catch(() => {
      args.setIsError(IsActiveError.Delete);
    })
    .finally(() => {
      args.setIsLoading(false);
    });
}

interface UpdatedTodoParams {
  event: ActionEvents;
  query: string;
  id: number;
  newData: string | boolean;
  title: string;
  completed: boolean;
  todo: Todo;
  todos: Todo[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsError: React.Dispatch<React.SetStateAction<IsActiveError>>;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleUpdateTodo(args: UpdatedTodoParams) {
  const {
    event,
    query,
    id,
    newData,
    title,
    completed,
    todo,
    todos,
    setIsError,
    setIsLoading,
    setTodos,
    setIsFocused,
  } = args;

  event.preventDefault();

  const preparedTodos = (updatedTodo: Todo) => {
    return todos.map(item => {
      return item.id === updatedTodo.id ? updatedTodo : item;
    });
  };

  setIsLoading(true);

  switch (newData) {
    case completed:
      updateTodo(id, {
        ...todo,
        completed: !completed ? true : false,
      })
        .then(res => {
          setTodos(preparedTodos(res));
        })
        .catch(() => {
          setIsError(IsActiveError.Update);
        })
        .finally(() => {
          setIsLoading(false);
        });
      break;
    case title:
      updateTodo(id, {
        ...todo,
        title: query,
      })
        .then(res => {
          setTodos(preparedTodos(res));
          setIsFocused(false);
        })
        .catch(() => {
          setIsError(IsActiveError.Update);
        })
        .finally(() => {
          setIsLoading(false);
        });
      break;
  }
}

interface ToggleAllParams {
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  todos: Todo[];
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsError: React.Dispatch<React.SetStateAction<IsActiveError>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export function handleToggleAll(args: ToggleAllParams) {
  args.event.preventDefault();

  args.setIsUpdating(true);

  const updatedTodos: number[] = [];
  const isAllCompleted = args.todos.every(todo => todo.completed);
  const activeTodos = args.todos.filter(todo => !todo.completed);

  const newList = (a: boolean) => {
    return args.todos.map(todo => {
      return updatedTodos.includes(todo.id) ? { ...todo, completed: a } : todo;
    });
  };

  const arrayOfPromises = (list: Todo[], isDone: boolean) => {
    return list.map(todo => {
      return updateTodo(todo.id, { ...todo, completed: isDone })
        .then(res => {
          updatedTodos.push(res.id);
        })
        .catch(() => {
          args.setIsError(IsActiveError.Update);
        });
    });
  };

  async function toggleAll() {
    await Promise.all(arrayOfPromises(activeTodos, true)).finally(() => {
      args.setIsUpdating(false);
      args.setTodos(newList(true));
    });
  }

  async function untoggleAll() {
    await Promise.all(arrayOfPromises(args.todos, false)).finally(() => {
      args.setIsUpdating(false);
      args.setTodos(newList(false));
    });
  }

  return isAllCompleted ? untoggleAll() : toggleAll();
}
