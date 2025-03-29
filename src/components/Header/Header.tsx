import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ERROR } from '../../types/enums';
import { addTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setErrorMessage: (value: ERROR) => void;
  setTodosLoading: (id: number[]) => void;
  setTodos: (callback: (prev: Todo[]) => Todo[]) => void;
  todosLoading: number[];
};

const HeaderComponent: React.FC<Props> = ({
  setErrorMessage,
  setTodosLoading,
  setTodos,
  todosLoading,
}) => {
  const [loading, setLoading] = useState(false);
  const inputField = useRef<HTMLInputElement>(null);
  // console.log('render header')

  useEffect(() => {
    if (todosLoading?.length < 0) {
      return;
    }

    inputField.current?.focus();
  }, [loading, todosLoading]);

  const addItem = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputField.current) {
        const value = inputField.current.value;
        let id = 0;

        try {
          if (value.trim() === '') {
            throw new Error(ERROR.title);
          }

          const todo: Omit<Todo, 'id'> = {
            title: value.trim(),
            userId: USER_ID,
            completed: false,
          };

          setLoading(true);
          setTodosLoading([id]);

          setTodos(prev => {
            id =
              prev.length > 0
                ? Math.max(...prev.map((item: Todo) => item.id)) + 1
                : 1;

            setTodosLoading([id]);

            return [...prev, { ...todo, id }];
          });

          const res = await addTodo(todo);

          setTodos(prev => {
            return prev.map(item => {
              if (item.id === id) {
                return res as Todo;
              }

              return item;
            });
          });

          inputField.current.focus();
          inputField.current.value = '';
        } catch (err) {
          setTodos(prev => prev.filter(item => id !== item.id));
          setErrorMessage(err.message || ERROR.add);
        } finally {
          setLoading(false);
          setTodosLoading([]);
        }
      }
    },
    [],
  );

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={addItem}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          disabled={loading}
        />
      </form>
    </header>
  );
};

export const Header = React.memo(HeaderComponent);
