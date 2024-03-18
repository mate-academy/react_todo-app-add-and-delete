import React from 'react';
import { CSSTransition } from 'react-transition-group';

import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodoHandler: (todoId: number) => void;
  addTodoId: number | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodoHandler,
  addTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onDelete={() => deleteTodoHandler(todo.id)}
              addTodoId={addTodoId}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              onDelete={() => deleteTodoHandler(tempTodo.id)}
              addTodoId={addTodoId}
            />
          </CSSTransition>
        )}
      </>
    </section>
  );
};
