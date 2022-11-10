import classNames from 'classnames';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import React, { useContext } from 'react';
import { SortParam } from '../../types/SortParam';
import { Todo } from '../../types/Todo';
import { AppContext } from '../AppContext';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos?: Todo[];
  newTodo: Todo | null;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, newTodo }) => {
    const { sortBy } = useContext(AppContext);

    const getSortedTodos = (sortingBy: SortParam) => {
      switch (sortingBy) {
        case SortParam.Active:
          return todos?.filter(todo => !todo.completed);

        case SortParam.Completed:
          return todos?.filter(todo => todo.completed);

        default:
          return todos;
      }
    };

    const visibleTodos = todos
      ? getSortedTodos(sortBy)
      : undefined;

    return (
      <ul
        className="todoapp__main"
        data-cy="TodoList"
      >
        <TransitionGroup>
          {visibleTodos?.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={500}
              classNames="item"
            >
              <li
                key={todo.id}
                data-cy="Todo"
                className={classNames('todo',
                  {
                    completed: todo.completed,
                  })}
              >
                <TodoInfo todo={todo} />
              </li>
            </CSSTransition>
          ))}
          {newTodo && (
            <CSSTransition
              key={0}
              timeout={500}
              classNames="temp-item"
            >
              <li
                key={0}
                data-cy="Todo"
                className="todo"
              >
                <TodoInfo todo={newTodo} />
              </li>
            </CSSTransition>
          )}
        </TransitionGroup>
      </ul>
    );
  },
);
