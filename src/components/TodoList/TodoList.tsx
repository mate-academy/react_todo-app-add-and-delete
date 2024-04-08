import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import TodoItem from '../TodoItem/TodoItem';
import { useTodos } from '../Store/Store';

const TodoList: React.FC = () => {
  const { filteredTodos, isLoading, tempTodo } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} claёssNames="item">
            <TodoItem todo={todo} key={todo.id} />
          </CSSTransition>
        ))}

        {isLoading && tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="item">
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

export default TodoList;
