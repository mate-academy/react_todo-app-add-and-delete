import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import './TodoList.scss';

type Props = {
  todos: Todo[],
  onError: (isError: Error) => void,
  removeTodo: (todoId: number) => void,
  tempTodo: Todo | null;
  todoIdUpdate: number[];
  handleChange: (todoId: Todo) => Promise<void>
};

export const TodoList: React.FC<Props> = ({
  todos, onError, removeTodo, tempTodo, todoIdUpdate, handleChange,
}) => {
  return (
    <ul className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              onError={() => onError}
              removeTodo={removeTodo}
              todoIdUpdate={todoIdUpdate}
              handleChange={handleChange}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              onError={() => onError}
              removeTodo={removeTodo}
              todoIdUpdate={todoIdUpdate}
              handleChange={handleChange}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
