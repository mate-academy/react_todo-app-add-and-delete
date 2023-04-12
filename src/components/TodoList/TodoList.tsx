import { FC, useContext } from 'react';
import { AppTodoContext } from '../AppTodoContext/AppTodoContext';
import { deleteTodo, getTodos } from '../../api/todos';
import { USER_ID } from '../../react-app-env';
import { ErrorType } from '../Error/Error.types';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: FC = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    tempTodo,
    setDeletingTodoIDs,
  } = useContext(AppTodoContext);

  const handleRemoveButton = async (todoId: number) => {
    setDeletingTodoIDs(prevDelTodoIDs => [...prevDelTodoIDs, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(await getTodos(USER_ID));
    } catch {
      setErrorMessage(ErrorType.DeleteTodoError);
    } finally {
      setDeletingTodoIDs(
        prevDelTodoIDs => prevDelTodoIDs.filter(delID => delID !== todoId),
      );
    }
  };

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleRemoveButton}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isItTempTodo
        />
      )}
    </section>
  );
};
