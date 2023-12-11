import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodosContext } from '../TodosContext/TodosContext';
import { TodoItem } from '../TodoItem';
import { FilterContext } from '../FilterContext/FilterContext';
import { FilterBy } from '../../types/FilterBy';

export const TodoList: React.FC = () => {
  const { todos, tempTodo } = useContext(TodosContext);
  const { filterBy } = useContext(FilterContext);

  const filteredTodos = () => {
    switch (filterBy) {
      case FilterBy.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterBy.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const todosToRender = filteredTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todosToRender.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}

        {(tempTodo) && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
