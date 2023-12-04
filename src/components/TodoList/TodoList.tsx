import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { useAppState } from '../AppState/AppState';
import { deleteTodo } from '../../api/todos';

export const TodoList: React.FC = () => {
  const {
    todosFilter,
    tempTodo,
    loading,
    setLoading,
    setErrorNotification,
  } = useAppState();

  const [
    deleteLoadingMap,
    setDeleteLoadingMap,
  ] = useState<Record<number, boolean>>({});

  const handleDeleteClick = async (id: number) => {
    if (!todosFilter) {
      setErrorNotification('Unable to delete a todo');

      return;
    }

    setDeleteLoadingMap(
      (prevLoadingMap) => ({ ...prevLoadingMap, [id]: true }),
    );

    setLoading(true);
    try {
      await deleteTodo(id);
    } catch (error) {
      setErrorNotification('Failed to delete todo');
    } finally {
      setDeleteLoadingMap(
        (prevLoadingMap) => ({ ...prevLoadingMap, [id]: false }),
      );
      setLoading(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosFilter && todosFilter.map(
        (todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            loading={deleteLoadingMap[todo.id] || false}
            onDeleteClick={() => handleDeleteClick(todo.id)}
          />
        ),
      )}
      {tempTodo && (
        <>
          <TodoItem key={tempTodo.id} todo={tempTodo} loading={loading} />
        </>
      )}
    </section>
  );
};
