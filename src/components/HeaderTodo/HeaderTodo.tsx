import { FC, useContext, useState } from 'react';
import classNames from 'classnames';

import { TodoContext, TodoDispatch } from '../../Context/TodoContext';
import { FormHeader } from '../HeaderTodo/FormHeader';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

interface IProps {
  setLoading: (load: boolean) => void;
  setLoadingAdd: (load: boolean) => void;
  showError: (err: string) => void;
  setTempTodo: (todo: Todo | null) => void;
}

export const HeaderTodo: FC<IProps> = ({
  setLoading,
  setLoadingAdd,
  showError,
  setTempTodo,
}) => {
  const [load, setLoad] = useState(false);
  const { todos, allCompleted } = useContext(TodoContext);
  const dispatch = useContext(TodoDispatch);

  const handleToggleAll = async () => {
    setLoading(true);
    setLoad(true);
    try {
      let todosToUpdate;

      if (allCompleted) {
        todosToUpdate = todos.map(todo => ({
          ...todo,
          completed: false,
        }));
      } else {
        todosToUpdate = todos
          .filter(todo => !todo.completed)
          .map(todo => ({
            ...todo,
            completed: true,
          }));
      }

      await Promise.all(
        todosToUpdate.map(todo => {
          return updateTodo({
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
          });
        }),
      );

      dispatch({ type: 'CHECK_ALL_TODO' });
    } catch (error) {
      showError('Unable to update a todo');
      throw new Error('Unable to update a todo');
    } finally {
      setLoading(false);
      setLoad(false);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          disabled={load}
        />
      )}

      <FormHeader
        showError={showError}
        setTempTodo={setTempTodo}
        setLoadingAdd={setLoadingAdd}
      />
    </header>
  );
};
