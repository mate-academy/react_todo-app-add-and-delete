import { useEffect, useState, useMemo, useRef } from 'react';
import { EditableField, Todo } from '../types/Todo';
import { method, USER_ID } from '../api/todos';

export enum Filter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const useHooks = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosApi = await method.get();

        setTodosFromServer(todosApi);
      } catch (e) {
        setError('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.All:
        return todosFromServer;

      case Filter.Active:
        return todosFromServer.filter((todo: Todo) => !todo.completed);

      case Filter.Completed:
        return todosFromServer.filter((todo: Todo) => todo.completed);
    }
  }, [todosFromServer, filter]);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const addTodo = async () => {
    const newTodo = {
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    const validate = newTodo.title;

    if (!validate) {
      setError('Title should not be empty');

      return;
    }

    setDisabled(true);

    const postPromise = method.post(newTodo);

    setTempTodo(newTodo.title);

    try {
      const created = await postPromise;

      setTodosFromServer(prev => [...prev, created]);
      setQuery('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setDisabled(false);
    }
  };

  const deleteTodo = async (id: number) => {
    setLoading(prev => [...prev, id]);

    try {
      await method.delete(id);
      setTodosFromServer(todos => todos.filter(todo => todo.id !== id));
    } catch (e) {
      setError('Unable to delete a todo');
    } finally {
      setLoading(prev => prev.filter(ids => ids !== id));
      inputRef.current?.focus();
    }
  };

  const patchTodo = async (data: EditableField, id: number) => {
    setLoading(prev => [...prev, id]);

    try {
      await method.patch(data, id);
      setTodosFromServer(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, ...data } : todo)),
      );
    } catch (e) {
      setError('Unable to update a todo');
      throw e;
    } finally {
      setLoading(prev => prev.filter(ids => ids !== id));
    }
  };

  const toggleAll = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const selector = todosFromServer.some(todo => !todo.completed)
      ? true
      : false;

    const todosToUpdate = todosFromServer.filter(
      todo => todo.completed !== selector,
    );

    const ids = todosToUpdate.map(todo => todo.id);

    setLoading(ids);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          method.patch({ completed: selector }, todo.id),
        ),
      );

      setTodosFromServer(prev =>
        prev.map(todo =>
          ids.includes(todo.id) ? { ...todo, completed: selector } : todo,
        ),
      );
    } catch {
      setError('Unable to toggle all todos');
    } finally {
      setLoading(prev => prev.filter(id => !ids.includes(id)));
    }
  };

  const clear = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const completed = todosFromServer.filter(todo => todo.completed === true);

    await Promise.all(completed.map(todo => deleteTodo(todo.id)));
  };

  return {
    todosFromServer,
    error,
    setError,
    visibleTodos,
    loading,
    setFilter,
    filter,
    query,
    setQuery,
    tempTodo,
    addTodo,
    deleteTodo,
    disabled,
    inputRef,
    patchTodo,
    toggleAll,
    clear,
  };
};
