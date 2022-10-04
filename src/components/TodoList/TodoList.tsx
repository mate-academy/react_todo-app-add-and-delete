import { Todo } from '../../types/Todo';
import { RemoveTodo } from '../RemoveTodo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  todoId: number;
  setTodoId: (id: number) => void;
  setTodos: (todo: Todo[]) => void;
  setErrorNotification: (value: string) => void;
  isShownTempTodo: boolean;
  previewTitle: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoId,
  setTodos,
  setTodoId,
  setErrorNotification,
  isShownTempTodo,
  previewTitle,
}) => {
  return (
    <>
      { todos.map(({ title, completed, id }) => (
        <RemoveTodo
          title={title}
          completed={completed}
          id={id}
          key={id}
          setErrorNotification={setErrorNotification}
          setTodos={setTodos}
          todos={todos}
          todoId={todoId}
          setTodoId={setTodoId}
        />
      ))}

      {isShownTempTodo
        && (
          <TodoItem
            previewTitle={previewTitle}
          />
        )}
    </>
  );
};
