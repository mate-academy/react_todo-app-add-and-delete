import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { TodoContext } from '../contexts/TodoContext';
import { TempTodo } from './TempTodo';

export const TodoList: React.FC = () => {
  const { filteredTodos, tempTodo } = useContext(TodoContext);

  return (
    <ul className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TempTodo />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
