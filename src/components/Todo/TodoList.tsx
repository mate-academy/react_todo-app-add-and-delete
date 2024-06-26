import React from 'react';
import { Todo } from '../../types/Todo';
import { useTodoDelete, useTodoFilter, useTodoTodos } from './Context';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const TodoList: React.FC = () => {
  const { todos, tempTodo } = useTodoTodos();
  const idsOfTodosToDelete = useTodoDelete();
  const filter = useTodoFilter();

  let filterCallback;

  switch (filter) {
    case 'All':
      filterCallback = () => true;
      break;
    case 'Active':
      filterCallback = (todo: Todo) => !todo.completed;
      break;
    case 'Completed':
      filterCallback = (todo: Todo) => todo.completed;
      break;
    default:
      throw new Error('Filter option is not valid!!!');
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.filter(filterCallback).map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              isProcessed={idsOfTodosToDelete.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isProcessed />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
