import React, { useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TypeOfFiltering } from '../../types/TypeOfFiltering';
import './TodoList.scss';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  filterType: TypeOfFiltering;
  onDelete: (id: number) => void;
  activeLoader: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  filterType,
  onDelete: deleteTodo,
  activeLoader,
}) => {
  const visibleTodos = useMemo<Todo[]>(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case TypeOfFiltering.Active:
          return !todo.completed;

        case TypeOfFiltering.Comleted:
          return todo.completed;

        case TypeOfFiltering.All:
        default:
          return todo;
      }
    });
  }, [todos, filterType]);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div
              key={todo.id}
              className={
                classNames('todo', {
                  completed: todo.completed,
                })
              }
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  name="complete"
                  id={todo.id.toString()}
                />
              </label>

              <span className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => {
                  return deleteTodo(todo.id);
                }}
              >
                x
              </button>

              <div className={
                classNames(
                  'modal',
                  'overlay',
                  {
                    'is-active': activeLoader.find(id => id === todo.id),
                  },
                )
              }
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div
              className={
                classNames('todo')
              }
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  name="complete"
                  id="0"
                />
              </label>

              <span className="todo__title">
                {tempTodo.title}
              </span>

              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>

    </section>
  );
};
