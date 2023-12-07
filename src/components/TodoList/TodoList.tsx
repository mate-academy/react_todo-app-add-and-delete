import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { useAppState } from '../AppState/AppState';
import { deleteTodo } from '../../api/todos';
import { handleErrorMessage } from '../function/handleErrorMessage ';

export const TodoList: React.FC = () => {
  const {
    todosFilter,
    tempTodo,
    loading,
    setTodosFilter,
    setLoading,
    setErrorNotification,
    deleteLoadingMap,
    setDeleteLoadingMap,
  } = useAppState();

  const handleDeleteClick = async (id: number) => {
    if (!todosFilter) {
      setErrorNotification('Unable to delete a todo');

      return;
    }

    setDeleteLoadingMap(
      (prevLoadingMap) => ({ ...prevLoadingMap, [id]: true }),
    );

    try {
      await deleteTodo(id);
    } catch (error) {
      handleErrorMessage(error, setErrorNotification);
      const errorNotificationTimeout = setTimeout(() => {
        setErrorNotification(null);
      }, 3000);

      clearTimeout(errorNotificationTimeout);
    } finally {
      const remainder = todosFilter.filter((e) => e.id !== id);

      setTodosFilter(remainder);

      setDeleteLoadingMap(
        (prevLoadingMap) => ({ ...prevLoadingMap, [id]: false }),
      );
      setLoading(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosFilter && todosFilter.map(
        (todo: Todo) => {
          const { id } = todo;

          if (id) {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                loading={deleteLoadingMap[id] || false}
                onDeleteClick={() => handleDeleteClick(id)}
              />
            );
          }

          return null;
        },
      )}
      {tempTodo && (
        <>
          <TodoItem key={tempTodo.id} todo={tempTodo} loading={loading} />
        </>
      )}
    </section>
  );
};
