import { useMemo } from 'react';

import { FilterOptions } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  filterOption: FilterOptions;
  isTodoDeleting: boolean;
  isInputProcessing: boolean;
  processingId: number;
  handleDeleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterOption,
  isTodoDeleting,
  isInputProcessing,
  processingId,
  handleDeleteTodo,
}) => {
  const visibleTodos = useMemo(() => {
    return todos.filter((todo: Todo) => {
      switch (filterOption) {
        case FilterOptions.Active:
          return !todo.completed;

        case FilterOptions.Completed:
          return todo.completed;

        case FilterOptions.All:
          return todo;
      }
    });
  }, [filterOption, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map((todo: Todo) => {
          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <div
                data-cy="Todo"
                className={cn('todo', { completed: todo.completed })}
              >
                <label className="todo__status-label" aria-label="true">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
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
                <Loader
                  processingId={processingId}
                  todoId={todo.id}
                  isLoading={isTodoDeleting}
                  isInputProcessing={isInputProcessing}
                />
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
