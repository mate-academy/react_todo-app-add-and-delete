/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos, patchTodos } from '../../api/todos';

interface Props {
  changeTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  todos: Todo[];
  todo: Todo;
}

const onEscape = (ref: React.RefObject<HTMLInputElement>): void => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && ref.current) {
      event.stopPropagation();
      ref.current.blur();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
};

export const TodoComponent: React.FC<Props> = ({
  changeTodos,
  setErrorMesage,
  todos,
  todo,
}) => {
  const [isChange, setIsChange] = useState(false);
  const [isApdate, setIsApdate] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const descRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const cleanup = onEscape(descRef);

    return cleanup;
  }, []);

  function setChanges(newTodo: Todo) {
    patchTodos(newTodo)
      .catch(error => {
        setTodoTitle(todo.title);
        setErrorMesage('Unable to update a todo');
        throw error;
      })
      .then(() =>
        changeTodos([
          ...todos.filter(toDo => toDo.id < newTodo.id),
          newTodo,
          ...todos.filter(toDo => toDo.id > newTodo.id),
        ]),
      )
      .finally(() => setIsApdate(false));
  }

  function todoDelete(todoID: number) {
    setIsApdate(true);
    deleteTodos(todoID)
      .then(() => changeTodos(todos.filter(toDo => toDo.id !== todoID)))
      .catch(error => {
        setErrorMesage('Unable to delete a todo');
        throw error;
      })
      .finally(() => setIsApdate(false));
  }

  function setComplited() {
    const newTodo: Todo = { ...todo };

    setIsApdate(true);

    newTodo.completed = !newTodo.completed;

    setChanges(newTodo);
  }

  function changeTitle() {
    setIsApdate(true);

    const newTodo: Todo = { ...todo };

    if (!todoTitle) {
      todoDelete(todo.id);

      return;
    }

    newTodo.title = todoTitle;

    setChanges(newTodo);
    setIsChange(!isChange);
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="Todo"
        className={`todo ${todo.completed ? 'completed' : null}`}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={() => setComplited()}
          />
        </label>

        {!isChange ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsChange(!isChange)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => todoDelete(todo.id)}
            >
              ×
            </button>
          </>
        ) : (
          <form onSubmit={changeTitle}>
            <input
              ref={descRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              autoFocus
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={e => {
                e.preventDefault();
                setTodoTitle(e.target.value);
              }}
              onBlur={() => {
                setIsChange(!isChange);
                changeTitle();
              }}
            />
          </form>
        )}

        <div
          data-cy="TodoLoader"
          className={`modal overlay ${isApdate ? 'is-active' : null}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
