import classNames from 'classnames';
import { useState } from 'react';
import { deleteTodo, updateTodoCheck } from '../api/todos';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/Filter';
import { ErrorType } from '../types/Error';

type Props = {
  todos: Todo[],
  filterType: FilterType,
  setErrorType: (error: ErrorType) => void,
  setTodos: (todos: Todo[]) => void,
};

const filter = (type: FilterType, todos: Todo[]) => {
  if (type === FilterType.ACTIVE) {
    return todos.filter((todo) => !todo.completed);
  }

  if (type === FilterType.COMPLETED) {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
};

export const Todos:React.FC<Props> = ({
  todos, filterType, setErrorType, setTodos,
}) => {
  const [editableTodoId, setEditableTodoId] = useState<number | null>(null);
  const [todoLoadId] = useState<number | null>(null);

  const filteredTodos = filter(filterType, todos);

  return (
    <>
      {filteredTodos.map((todo: Todo) => {
        if (todo.id === editableTodoId) {
          return (
            <>
              <div className="todo" key={todo.id}>
                <label className="todo__status-label">
                  <input
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <form onSubmit={(e) => {
                  e.preventDefault();
                }}
                >
                  <input
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    defaultValue={todo.title}
                    // onChange={(e) => setInputValue(e.target.value)}
                    onBlur={() => setEditableTodoId(null)}
                  />
                </form>

                <div className="modal overlay">
                  <div
                    className="modal-background has-background-white-ter"
                  />
                  <div className="loader" />
                </div>
              </div>
            </>
          );
        }

        if (todoLoadId === todo.id) {
          return (
            <div className="todo" key={todo.id}>
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{todo.title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
                <div
                  className="modal-background has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          );
        }

        return (
          <div
            className={classNames('todo', { completed: todo.completed })}
            key={todo.id}
            onDoubleClick={() => {
              setEditableTodoId(todo.id);
            }}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onClick={() => {
                  updateTodoCheck(todo.id, !todo.completed)
                    .then(() => {
                      setTodos(todos.map((currentTodo) => {
                        if (currentTodo.id === todo.id) {
                          return {
                            ...currentTodo,
                            completed: !todo.completed,
                          };
                        }

                        return currentTodo;
                      }));
                    })
                    .catch(() => {
                      setErrorType(ErrorType.UPDATE);
                    });
                }}
              />
            </label>
            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                deleteTodo(todo.id)
                  .then(() => {
                    setTodos(todos.filter((item) => todo.id !== item.id));
                  })
                  .catch(() => setErrorType(ErrorType.DELETE));
              }}
            >
              ×
            </button>

            <div className="modal overlay">
              <div
                className="modal-background has-background-white-ter"
              />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </>
  );
};
