import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID, postTodo } from '../../api/todos';
import { errorNotification } from '../../utils/errorFunction';
import classNames from 'classnames';

interface TodoappHeaderProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  setErrorNotification: (msg: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoappHeader: React.FC<TodoappHeaderProps> = ({
  setTodos,
  todos,
  setErrorNotification,
  inputRef,
}) => {
  const [newTodo, setNewTodo] = useState<string>('');
  const [activeTodo, setActiveTodo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const everyActive = todos.length > 0 && todos.every(todo => todo.completed);

    setActiveTodo(everyActive);
  }, [todos]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, inputRef]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTodo.trim() === '') {
      errorNotification('Title should not be empty', setErrorNotification);

      return;
    }

    setIsLoading(true);

    const lastTodoId = Date.now();

    const newTodos = {
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    };

    setTodos([...todos, { ...newTodos, id: lastTodoId, isLoaded: false }]);

    try {
      const createdTodo = await postTodo(newTodos);

      setTodos(prev =>
        prev.map(todo =>
          todo.id === lastTodoId ? { ...createdTodo, isLoaded: true } : todo,
        ),
      );
      setNewTodo('');
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      setIsLoading(false);
      errorNotification('Unable to add a todo', setErrorNotification);
      setTodos(prev => prev.filter(todo => todo.id !== lastTodoId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAllActive = () => {
    const toggledCompleted = !activeTodo;

    setTodos(prev =>
      prev.map(todo => ({
        ...todo,
        isLoaded: false,
      })),
    );

    setTimeout(() => {
      setTodos(prev =>
        prev.map(todo => ({
          ...todo,
          completed: toggledCompleted,
          isLoaded: true,
        })),
      );
    }, 500);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: activeTodo })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllActive}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
