import React, { useRef, useState, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { addTodo, updateTodoStatus, USER_ID } from '../../api/todos';
import cn from 'classnames';

type Props = {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  errorMessage: string;
  setLoadingTodosId: React.Dispatch<React.SetStateAction<number[]>>;
  loadingTodosId: number[];
  addIdToLoad: (arg: number) => void;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  setTempTodo,
  setTodos,
  todos,
  errorMessage,
  setLoadingTodosId,
  loadingTodosId,
  addIdToLoad,
}) => {
  const [input, setInput] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const hasLoadingTodos = loadingTodosId.length > 0;

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!input.trim()) {
      return setErrorMessage('Title should not be empty');
    }

    const forFetchTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: input.toString().trim(),
      completed: false,
    };

    setTempTodo({
      ...forFetchTodo,
      id: 0,
    });

    addIdToLoad(0);

    try {
      const addedTodo = await addTodo(forFetchTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
      setInput('');
      inputRef.current?.focus();
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setLoadingTodosId([]);
      inputRef.current?.focus();
      setTempTodo(null);
    }
  };

  const handleOnClick = async () => {
    let activeTodosId: number[] = [];

    const activeTodos = todos.filter(todo => !todo.completed);

    try {
      if (activeTodos.length > 0) {
        activeTodosId = activeTodos.map(todo => todo.id);
        setLoadingTodosId(prev => [...prev, ...activeTodosId]);
        await Promise.all(activeTodosId.map(id => updateTodoStatus(id, true)));
      } else {
        activeTodosId = todos
          .filter(todo => todo.completed)
          .map(todo => todo.id);
        setLoadingTodosId(prev => [...prev, ...activeTodosId]);
        await Promise.all(activeTodosId.map(id => updateTodoStatus(id, false)));
      }

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          activeTodosId.includes(todo.id)
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodosId([]);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, errorMessage]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleOnClick}
        />
      )}

      <form onSubmit={handleOnSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={handleOnChange}
          disabled={hasLoadingTodos}
        />
      </form>
    </header>
  );
};
