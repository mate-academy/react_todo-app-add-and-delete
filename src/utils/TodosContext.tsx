import {
  FormEvent,
  ReactNode,
  createContext, useCallback, useContext, useEffect, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { client } from './fetchClient';

interface TodosContextInterface {
  todos: Todo[];
  setTodos(todos: Todo[]): void;
  error: boolean;
  setError(err: boolean): void;
  createNewTodo(event: FormEvent): void;
  messageError: string;
  setMessageError(message: string): void;
  value: string;
  setValue(text: string): void;
  tempTodo: Todo | null;
  handleToggleComplete(): void;
  loading: boolean;
  handleDeleteTodo(todo: Todo): void;
  handleDeleteCompleted(): void;
  handleClickCheck(todo: Todo): void
}

export const TodosContext = createContext<TodosContextInterface>(
  {
    todos: [],
    setTodos: () => { },
    error: false,
    setError: () => { },
    createNewTodo: () => { },
    messageError: '',
    setMessageError: () => { },
    value: '',
    setValue: () => { },
    tempTodo: null,
    handleToggleComplete: () => { },
    loading: false,
    handleDeleteTodo: () => { },
    handleDeleteCompleted: () => { },
    handleClickCheck: () => { },
  },
);

export const TodosConstextProvider = (
  { children }: {
    children: ReactNode
  },
) => {
  const [error, setError] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);

  const USER_ID = 10529;
  const url = `/todos?userId=${USER_ID}`;

  if (error) {
    setTimeout(() => setError(false), 3000);
  }

  useEffect(() => {
    client.get<Todo[]>(url).then(response => {
      return setTodos(response);
    }).catch(() => setError(true));
  }, [tempTodo, todos]);

  const createNewTodo = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!value) {
      setError(true);
      setMessageError('Title can\'t be empty');
    } else {
      const newTodo: Todo = {
        id: 0,
        title: value,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(newTodo);

      client.post(url, newTodo).then(() => {
        setValue('');
        setTempTodo(null);
        setMessageError('');
        setError(false);
      }).catch(() => {
        setMessageError('Unable to add a todo');
        setError(true);
      });
    }
  }, [value]);

  const handleToggleComplete = useCallback(() => {
    setLoading(true);
    const newTodos = todos.map(async todo => {
      let newTodo: Todo;
      const {
        id, title, userId,
      } = todo;

      if (todos.find(tod => tod.completed === false)) {
        newTodo = {
          id,
          title,
          userId,
          completed: true,
        };
      } else {
        newTodo = {
          id,
          title,
          userId,
          completed: false,
        };
      }

      const data = {
        completed: newTodo.completed,
      };
      const urlId = `/todos/${newTodo.id}?userId=${USER_ID}`;

      const patchedTodo = await client.patch(urlId, data)
        .catch(() => setMessageError('Unable to update a todo'));

      return patchedTodo;
    });

    setLoading(false);

    return newTodos;
  }, [todos]);

  const handleDeleteCompleted = useCallback(() => {
    const filterdTodos = todos
      .map(todo => {
        if (todo.completed) {
          const uniqUrl = `/todos/${todo.id}?userId=${USER_ID}`;

          return client.delete(uniqUrl)
            .catch(() => setMessageError('Unable to delete a todo'));
        }

        return todo;
      });

    return filterdTodos;
  }, [todos]);

  const handleDeleteTodo = useCallback(async (todo: Todo) => {
    const urlId = `/todos/${todo.id}?userId=${USER_ID}`;

    try {
      return await client.delete(urlId);
    } catch {
      return setMessageError('Unable to delete a todo');
    }
  }, [todos]);

  const handleClickCheck = useCallback(async (todo: Todo) => {
    setLoading(true);
    const urlId = `/todos/${todo.id}?userId=${USER_ID}`;
    let data;

    if (!todo.completed) {
      data = { completed: true };
    } else {
      data = { completed: false };
    }

    setLoading(false);

    try {
      return await client.patch(urlId, data);
    } catch {
      return setMessageError('Unable to update a todo');
    }
  }, [todos]);

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      error,
      setError,
      createNewTodo,
      value,
      setValue,
      messageError,
      setMessageError,
      tempTodo,
      handleToggleComplete,
      loading,
      handleDeleteTodo,
      handleDeleteCompleted,
      handleClickCheck,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosContext = () => useContext(TodosContext);
