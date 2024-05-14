/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
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
  const [todoId, setTodoId] = useState(Infinity);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTitle, setTempTitle] = useState('');

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

  function handleChangeCompleted(todoSelect: Todo) {
    setError('');
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
      .catch(() => setError('Unable to update a todo'));
  }

  function handleDeleteTodo(id: number) {
    setLoading(true);
    setError('');
    setTodoId(id);
    deleteTodo(id)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setTodoId(Infinity);
        setLoading(false);
      });
  }

  function handleUpdateTitleTodo(todoSelect: Todo) {
    setError('');

    setTodos(
      [...todos].map(todo => {
        if (todo.id === todoId) {
          return { ...todo, title: todoTitle };
        }

        return todo;
      }),
    );
    if (tempTitle !== todoTitle) {
      updateTodo({
        id: todoSelect.id,
        userId: USER_ID,
        title: todoTitle,
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
          setTodoId(Infinity);
        })
        .catch(() => {
          setError('Unable to update a todo');
          setFormActive(true);
          setTodoId(todoSelect.id);
        });
    } else {
      setTodoId(Infinity);
    }
  }

  function handleBlur(todoSelect: Todo) {
    setFormActive(false);
    handleUpdateTitleTodo(todoSelect);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) {
    if (event.key === 'Enter') {
      event.preventDefault();
      setFormActive(false);
      handleUpdateTitleTodo(todo);
    }
  }

  return (
    <>
      {todoList.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : ''} ${todo.id === Infinity ? 'temp' : ''}`}
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

          {!formActive && (
            <div
              data-cy="TodoLoader"
              className={`modal overlay ${todo.id === Infinity || todo.id === todoId ? 'is-active' : ''}`}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
    </>
  );
};
