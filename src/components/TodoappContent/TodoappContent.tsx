import { useEffect, useRef, useState } from 'react';
import { TodoappFooter } from '../TodoappFooter';
import { TodoappHeader } from '../TodoappHeader';
import { TodoappMain } from '../TodoappMain';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';
import { deleteTodo, getTodos } from '../../api/todos';
import { errorNotification } from '../../utils/errorFunction';
interface TodoappContentProps {
  setErrorNotification: (msg: string) => void;
}

export const TodoappContent: React.FC<TodoappContentProps> = ({
  setErrorNotification,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStyle, setFilterStyle] = useState<FilterType>(FilterType.All);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(data => {
        const newData = data.map(todo => ({ ...todo, isLoaded: true }));

        setTodos(newData);
      })
      .catch(() => setErrorNotification('Unable to load todos'));
  }, [setErrorNotification]);

  const filteredTodos = todos.filter(todo => {
    switch (filterStyle) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
      default:
        return true;
    }
  });

  const handleClearCompletedButton = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    setTodos(prev =>
      prev.map(todo => (todo.completed ? { ...todo, isLoaded: false } : todo)),
    );

    const failedToDelete: Todo[] = [];

    await Promise.all(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);
        } catch {
          failedToDelete.push({ ...todo, isLoaded: true });
          errorNotification('Unable to delete a todo', setErrorNotification);
        }
      }),
    );
    const updatedTodos = [...uncompletedTodos, ...failedToDelete];

    updatedTodos.sort((a, b) => a.id - b.id);

    setTodos(updatedTodos);
    inputRef.current?.focus();
  };

  return (
    <div className="todoapp__content">
      <TodoappHeader
        setTodos={setTodos}
        todos={todos}
        setErrorNotification={setErrorNotification}
        inputRef={inputRef}
      />

      <TodoappMain
        todos={filteredTodos}
        setTodos={setTodos}
        setErrorNotification={setErrorNotification}
        inputRef={inputRef}
      />

      <TodoappFooter
        todos={todos}
        setFilterStyle={setFilterStyle}
        handleClearCompletedButton={handleClearCompletedButton}
        inputRef={inputRef}
      />
    </div>
  );
};
