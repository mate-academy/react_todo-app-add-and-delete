import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FilterType } from '../../types/filterType';
import { AuthContext } from '../Auth/AuthContext';
import { User } from '../../types/User';
import { Errors } from '../../types/Errors';
import { deleteTodo } from '../../api/todos';

interface TodoListProps {
  todos: Todo[];
  title: string;
  filterBy: FilterType,
  selectedTodosId: number[];
  isAdding: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
  setSelectedTodosId: React.Dispatch<React.SetStateAction<number[]>>;
  loadingTodosFromServer: () => Promise<void>;
}

export const TodoList: FunctionComponent<TodoListProps> = ({
  todos,
  title,
  filterBy,
  selectedTodosId,
  isAdding,
  setErrorMessage,
  setSelectedTodosId,
  loadingTodosFromServer,
}) => {
  const user = useContext<User | null>(AuthContext);

  const filteredTodos = useMemo((): Todo[] => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterBy]);

  const removeTodoHandler = useCallback(async (todoId: number) => {
    setErrorMessage(Errors.None);
    setSelectedTodosId(prevId => [...prevId, todoId]);
    try {
      await deleteTodo(todoId);
      await loadingTodosFromServer();
    } catch {
      setErrorMessage(Errors.Deleting);
    } finally {
      setSelectedTodosId([]);
    }
  }, []);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodoHandler={removeTodoHandler}
          onLoading={selectedTodosId.includes(todo.id)}
        />
      ))}

      {(user && isAdding) && (
        <TodoItem
          todo={{
            id: 0,
            userId: user.id,
            title,
            completed: false,
          }}
          removeTodoHandler={removeTodoHandler}
          onLoading
        />
      )}
    </section>
  );
};
