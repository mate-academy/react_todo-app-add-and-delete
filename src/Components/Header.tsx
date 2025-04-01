import React, { RefObject } from 'react';
import { Todo, TodoInput } from '../types/Todo';
import { dataTodos, USER_ID } from '../api/todos';

interface HeaderProps {
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  setErrorMessage: (value: string) => void;
  loadingTodoIds: number[] | null;
  setLoadingTodoIds: (value: number[] | null) => void;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  inputRef: RefObject<HTMLInputElement>;
  todoTitle: string;
  setTodoTitle: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  setTodos,
  setErrorMessage,
  loadingTodoIds,
  setLoadingTodoIds,
  updateTodo,
  inputRef,
  todoTitle,
  setTodoTitle,
}) => {
  function addTodo({ title, completed, userId }: TodoInput): Promise<Todo> {
    setErrorMessage('');
    setLoadingTodoIds([-1]);

    const newTodoOverlay = {
      id: -1,
      userId,
      title,
      completed,
    };

    setTodos([...todos, newTodoOverlay]);

    return dataTodos
      .createTodos({ title, completed, userId })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTodoTitle('');

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);

        return newTodo;
      })
      .catch(error => {
        setTodos(todos.filter(todo => todo.id !== -1));
        setErrorMessage('Unable to add a todo');

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);

        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(null);
      });
  }

  function handleChangeAllTodosCompleted() {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed === areAllCompleted,
    );
    const updatedTodos = todos.map(todo =>
      todosToUpdate.includes(todo)
        ? { ...todo, completed: !areAllCompleted }
        : todo,
    );

    setTodos(updatedTodos);

    Promise.all(
      todosToUpdate.map(todo =>
        updateTodo({ ...todo, completed: !areAllCompleted }),
      ),
    ).catch(() => {
      setErrorMessage('Unable to update some todos');
    });
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={() => {
            handleChangeAllTodosCompleted();
          }}
        />
      )}

      <form
        onSubmit={event => {
          event.preventDefault();

          if (!todoTitle.trim()) {
            setErrorMessage('Title should not be empty');
          }

          if (todoTitle.trim()) {
            addTodo({
              title: todoTitle.trim(),
              completed: false,
              userId: USER_ID,
            });
          }
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={loadingTodoIds !== null}
          autoFocus
        />
      </form>
    </header>
  );
};
