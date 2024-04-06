import { FC } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTodos } from '../lib/TodosContext';
import { Status } from '../types/Status';
import type { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export const TodoList: FC = () => {
  const { todos, query, isLoading, tempTodo } = useTodos();

  const filteredTodos = todos.filter(todo => {
    switch (query) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map((todo: Todo) => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}

        {isLoading && tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
