import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { DELETING_ERROR } from '../utils/constants';

interface Props {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  errorHandler: (str: string) => void,
  loadingTodos: Todo[];
  setLoadingTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export const Main: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  setTodos,
  errorHandler,
  loadingTodos,
  setLoadingTodos,
}) => {
  const handleDelete = (id: number) => {
    const todoForDelete = filteredTodos.filter(todo => todo.id === id);

    setLoadingTodos(
      prevLoadingTodos => [...prevLoadingTodos, ...todoForDelete],
    );

    deleteTodo(id)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => errorHandler(DELETING_ERROR))
      .finally(() => {
        setLoadingTodos(prevLoadingTodos => prevLoadingTodos
          .filter(todo => todo.id !== id));
      });
  };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {filteredTodos.map((todo) => {
          const { id, title, completed } = todo;
          const isTodoLoading = loadingTodos.includes(todo);

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <div key={id} className={`todo ${completed ? 'completed' : ''}`}>
                <label className="todo__status-label">
                  <input type="checkbox" className="todo__status" />
                </label>

                <span className="todo__title">{title}</span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => handleDelete(id)}
                >
                  ×
                </button>

                <div className={`modal overlay ${cn({ 'is-active': isTodoLoading })}`}>
                  <div className="modal-background has-background-white-ter" />
                  <div className="todoapp__loading-content">
                    <p className="todoapp__loading-content--caption">
                      Loading...
                    </p>
                    <div className="loader" />
                  </div>
                </div>
              </div>
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>

              <button type="button" className="todo__remove">
                ×
              </button>

              <div className={`modal overlay ${cn({ 'is-active': tempTodo })}`}>
                <div className="modal-background has-background-white-ter" />
                <div className="todoapp__loading-content">
                  <p className="todoapp__loading-content--caption">
                    Loading...
                  </p>
                  <div className="loader" />
                </div>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
