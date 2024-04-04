import { useState } from 'react';
import { deleteTodos, updateTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { ErrorTypes } from '../types/enums';
import { handleError } from '../utils/services';

type Props = {
  todos: Todo[];
  isLoading?: boolean;
  loading: number[];
  setLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorTypes) => void;
  tempTodo: Todo[];
  setIsFocused: (isFocused: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  setLoading,
  setTodos,
  setErrorMessage,
  tempTodo,
  setIsFocused,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const onDelete = (id: number) => {
    setLoading(prev => [...prev, id]);

    deleteTodos(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
        setIsFocused(true);
      })
      .catch(() => handleError(ErrorTypes.delErr, setErrorMessage))
      .finally(() => setLoading(prev => prev.filter(item => item !== id)));
  };

  const onPatch = (todo: Todo, event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (todo.title.trim() === '') {
      onDelete(todo.id);

      return;
    }

    setLoading(prev => [...prev, todo.id]);

    updateTodos(todo.id, todo)
      .then((updatedTodo: Todo) =>
        setTodos((currentTodos: Todo[]) =>
          currentTodos.map(item =>
            item.id === updatedTodo.id ? updatedTodo : item,
          ),
        ),
      )
      .catch(() => handleError(ErrorTypes.updErr, setErrorMessage))
      .finally(() => {
        setSelectedTodo(null);
        setLoading(prev => prev.filter(item => item !== todo.id));
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          setSelectedTodo={setSelectedTodo}
          loading={loading}
          selectedTodo={selectedTodo}
          onDelete={onDelete}
          onPatch={onPatch}
        />
      ))}
      {tempTodo.length !== 0 &&
        tempTodo.map(tTodo => (
          <TodoItem
            todo={tTodo}
            key={tTodo.id}
            setSelectedTodo={setSelectedTodo}
            loading={loading}
            selectedTodo={selectedTodo}
            onDelete={onDelete}
            onPatch={onPatch}
          />
        ))}
    </section>
  );
};
