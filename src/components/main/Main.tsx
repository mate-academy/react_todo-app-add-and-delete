import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem/TodoItem';
import { TempTodo } from '../todoItem/TempTodo';
import {
  updateTodoCompleted,
} from '../../api/todos';

interface Props {
  todos: Todo[] | null;
  tempTodo: Todo | null;
  showError: (errText: string) => void;
  handleDeleteTodo: (id: number) => void;
  loading: boolean;
  loadingID: number;
}
export const Main: React.FC<Props> = ({
  todos,
  tempTodo,
  showError,
  handleDeleteTodo,
  loading,
  loadingID,
}) => {
  const handleUpdateTodoIsCompleted = async (
    id: number,
    completedCurrVal: boolean,
  ) => {
    try {
      await updateTodoCompleted(id, {
        completed: !completedCurrVal,
      });
    } catch {
      showError('Unable to update a todo');
    }
  };

  return (
    <section className="todoapp__main">
      {todos && todos.map(({
        title,
        id,
        completed,
      }) => (
        <TodoItem
          loading={loading}
          loadingID={loadingID}
          key={id}
          title={title}
          id={id}
          completed={completed}
          onDelete={handleDeleteTodo}
          onIsCompletedUpdate={handleUpdateTodoIsCompleted}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
