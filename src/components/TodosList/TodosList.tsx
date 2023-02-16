import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
  todoIdsToDelete: number[];
};
export const TodosList: React.FC<Props> = (
  {
    todos,
    tempTodo,
    handleDeleteTodo,
    todoIdsToDelete,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              todoIdsToDelete={todoIdsToDelete}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={0}
              todo={tempTodo}
              handleDeleteTodo={handleDeleteTodo}
              todoIdsToDelete={[0]}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
