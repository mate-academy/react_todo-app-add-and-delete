import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  processings: number[];
  deleteTodo: (todoId: number) => void;
  updateTodo: (todoId: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  processings,
  deleteTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isProcessed={processings.includes(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
              onUpdate={updateTodo}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
