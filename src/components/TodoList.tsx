import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodoContext } from '../providers/TodosProvider';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(TempTodoContext);

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
              todo={todo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
