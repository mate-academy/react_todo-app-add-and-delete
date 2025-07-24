import React, { useEffect } from 'react';
import classNames from 'classnames';
import { USER_ID } from '.././api/todos';
import * as todosApi from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  headerInputRef: React.RefObject<HTMLInputElement>;
  setTempTodo: (todo: Omit<Todo, 'id'> | null) => void;
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
  currentCreatedTodo: string;
  setCurrentCreatedTodo: (value: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: (error: string) => void;
  todos: Todo[];
  allCompleted: boolean;
  setAllCompleted: (value: boolean) => void;
  setTodoStatus: (status: boolean) => void;
};

export const Header: React.FC<Props> = ({
  headerInputRef,
  setTempTodo,
  isCreating,
  setIsCreating,
  currentCreatedTodo,
  setCurrentCreatedTodo,
  setTodos,
  setError,
  todos,
  allCompleted,
  setAllCompleted,
  setTodoStatus,
}) => {
  const reset = () => {
    setCurrentCreatedTodo('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCreatedTodo(e.currentTarget.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedValue = e.currentTarget.value.trim();

    if (e.key === 'Enter' && trimmedValue) {
      const newTodo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: trimmedValue,
        completed: false,
      };

      setIsCreating(true);
      setTempTodo({ ...newTodo });

      todosApi
        .addTodo(newTodo)
        .then(addedTodo => {
          setTodos((prevTodos: Todo[]) => [...prevTodos, addedTodo]);
          reset();
          setTempTodo(null);
          setIsCreating(false);
        })
        .catch(() => {
          setError('Unable to add a todo');
          setTimeout(() => {
            setError('');
            setIsCreating(false);
          }, 3000);
          setTimeout(() => {
            setTempTodo(null);
          }, 300);
          setCurrentCreatedTodo(currentCreatedTodo);
        });
    } else if (e.key === 'Enter') {
      setError('Title should not be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  useEffect(() => {
    if (!isCreating && headerInputRef.current) {
      headerInputRef.current.focus();
    }
  }, [isCreating, headerInputRef]);

  useEffect(() => {
    if (headerInputRef.current) {
      headerInputRef.current.focus();
    }
  }, [todos.length, headerInputRef]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
            hidden: todos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            setTodoStatus(true);
            const newCompleted = !allCompleted;

            const todosToUpdate = todos.filter(
              todo => todo.completed !== newCompleted,
            );

            const updatedTodos = todos.map(todo =>
              todosToUpdate.some(t => t.id === todo.id)
                ? { ...todo, completed: newCompleted }
                : todo,
            );

            setTodos(updatedTodos);
            setAllCompleted(newCompleted);

            if (todosToUpdate.length === 0) {
              setTodoStatus(false);

              return;
            }

            const updatePromises = todosToUpdate.map(item =>
              todosApi.updateTodo(item.id, newCompleted, item.title),
            );

            Promise.all(updatePromises)
              .then(() => {
                setTodoStatus(false);
              })
              .catch(() => {
                setError('Unable to update a todo');
                setTimeout(() => {
                  setTodoStatus(false);
                }, 3000);
              });
          }}
        />
      )}

      <form onSubmit={e => e.preventDefault()}>
        <input
          ref={headerInputRef}
          autoFocus
          disabled={isCreating}
          data-cy="NewTodoField"
          type="text"
          value={currentCreatedTodo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </form>
    </header>
  );
};
