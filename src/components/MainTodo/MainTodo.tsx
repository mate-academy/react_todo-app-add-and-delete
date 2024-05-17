/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useContext } from 'react';
import { TodoContext, TodoDispatch } from '../../Context/TodoContext';
import { FilterContext } from '../../Context/FilterContext';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type TProps = {
  loading: boolean;
  loadingAdd: boolean;
  tempTodo: Todo | null;
  showError: (err: string) => void;
  setLoading: (bool: boolean) => void;
};

export const MainTodo: FC<TProps> = ({
  loading,
  loadingAdd,
  showError,
  setLoading,
  tempTodo,
}) => {
  const { filteredTodos } = useContext(FilterContext);
  const { todos } = useContext(TodoContext);
  const dispatch = useContext(TodoDispatch);

  const checkTodo = async (id: string) => {
    setLoading(true);
    try {
      const index = todos.findIndex(todo => todo.id === id);

      const updatedTodo = {
        ...todos[index],
        completed: !todos[index].completed,
      };

      await updateTodo(updatedTodo);

      dispatch({ type: 'CHECK_TODO', payload: id });
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              loading={loading}
              checkTodo={checkTodo}
              showError={showError}
              setLoading={setLoading}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              loading={loadingAdd}
              setLoading={setLoading}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
