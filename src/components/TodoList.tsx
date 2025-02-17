/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID, deleteTodo, updateTodo } from '../api/todos';
import { ErrorMessages } from '../App';

type Props = {
  todoList: Todo[];
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: (error: ErrorMessages) => void;
  setLoading: (loading: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todoList = [],
  todos,
  setTodos,
  setError,
  setLoading,
}) => {
  const [formActive, setFormActive] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoId, setTodoId] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [idsToUptdated, setIdsToUpdated] = useState<number[]>([]);

  useEffect(() => {
    if (formActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [formActive]);

  function handleSetFormActive(title: string, id: number) {
    setFormActive(true);
    setTodoId(id);

    setTodoTitle(title);
    setTempTitle(title);
  }

  const handleChangeCompleted = useCallback(
    (todoSelect: Todo) => {
      setError('');
      setIdsToUpdated(state => [...state, todoSelect.id]);
      updateTodo({
        id: todoSelect.id,
        userId: USER_ID,
        title: todoSelect.title,
        completed: !todoSelect.completed,
      })
        .then(updatedTodo => {
          setTodos(last =>
            [...last].map(todo => {
              if (todo.id === todoSelect.id) {
                return { ...todo, completed: updatedTodo.completed };
              }

              return todo;
            }),
          );
        })
        .catch(() => setError('Unable to update a todo'))
        .finally(() =>
          setIdsToUpdated(state => state.filter(el => el !== todoSelect.id)),
        );
    },
    [setError, setTodos],
  );

  function handleDeleteTodo(id: number) {
    setLoading(true);
    setError('');
    setIdsToUpdated(state => [...state, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(state => state.filter(todo => todo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setIdsToUpdated(state => state.filter(el => el !== id));
        setLoading(false);
      });
  }

  function handleUpdateTitleTodo(todoSelect: Todo) {
    setError('');
    setIdsToUpdated(state => [...state, todoSelect.id]);

    setTodos(
      [...todos].map(todo => {
        if (todo.id === todoId) {
          return { ...todo, title: todoTitle };
        }

        return todo;
      }),
    );

    if (tempTitle !== todoTitle.trim()) {
      if (todoTitle.trim() === '') {
        handleDeleteTodo(todoSelect.id);

        return;
      }

      updateTodo({
        id: todoSelect.id,
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: todoSelect.completed,
      })
        .then(updatedTodo => {
          setTodos(
            [...todos].map(todo => {
              if (todo.id === todoId) {
                return { ...todo, title: updatedTodo.title };
              }

              return todo;
            }),
          );
          setTempTitle('');
          setFormActive(false);
        })
        .catch(() => {
          setError('Unable to update a todo');
          setFormActive(true);
        })
        .finally(() => {
          setIdsToUpdated(state => state.filter(el => el !== todoSelect.id));
        });
    } else {
      setIdsToUpdated(state => state.filter(el => el !== todoSelect.id));
      setFormActive(false);
    }
  }

  function handleBlur(todoSelect: Todo) {
    if (idsToUptdated.length === 0) {
      handleUpdateTitleTodo(todoSelect);

      return;
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) {
    if (event.key === 'Enter') {
      event.preventDefault();

      handleUpdateTitleTodo(todo);

      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setFormActive(false);

      return;
    }
  }

  return (
    <>
      {todoList.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : ''} ${todo.id === 0 ? 'temp' : ''}`}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onChange={() => handleChangeCompleted(todo)}
              checked={todo.completed}
            />
          </label>

          {formActive && todo.id === todoId ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                ref={inputRef}
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={todoTitle}
                onChange={e => setTodoTitle(e.target.value)}
                onBlur={() => handleBlur(todo)}
                onKeyDown={e => handleKeyDown(e, todo)}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleSetFormActive(todo.title, todo.id)}
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${todo.id === 0 || idsToUptdated.includes(todo.id) ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </>
  );
};
