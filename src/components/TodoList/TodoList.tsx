import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number | Pick<Todo, 'id'>) => Promise<void>;
  tempTodo?: Todo | null;
};

export const TodoList: React.FC<Props> = ({ todos, tempTodo, deleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
