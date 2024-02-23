import { useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Context } from '../constext';
import { getTodos } from '../../api/todos';
import { filteredTodos } from '../../utils/filteredTodos';

export const TodoList: React.FC = () => {
  const { todos, tempTodo, setTodos, notifyError, filter } =
    useContext(Context);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        notifyError('Unable to load todos');
      });
  });

  const visibleTodos = filteredTodos(todos, filter);

  if (!visibleTodos) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} key={todo.id} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
