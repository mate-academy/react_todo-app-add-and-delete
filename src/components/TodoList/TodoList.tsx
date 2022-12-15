import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  isAdding: boolean;
  modifyingTodosId: number[];
  newTodoTitle: string;
  onTodoDelete: (todoId: number[]) => void;
}

export const TodoList: React.FC<Props> = React.memo((props) => {
  const {
    todos,
    isAdding,
    modifyingTodosId,
    newTodoTitle,
    onTodoDelete,
  } = props;

  const tempTodo: Todo = {
    id: 0,
    title: newTodoTitle,
    userId: 0,
    completed: false,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              isModifying={modifyingTodosId.includes(todo.id)}
              onTodoDelete={onTodoDelete}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              isModifying
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
