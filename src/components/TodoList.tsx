import { useState } from 'react';
import TodoItem from './TodoItem';
import { getTodos } from '../api/todos';
import { useEffect } from 'react';
import CreateTodo from './CreateTodo';
import { createTodo } from '../api/todos';
import { USER_ID } from '../api/todos';
import { ErrorMessagesNotification } from '../api/todos';
import { ErrorMessagesProps } from '../components/ErrorMessages';
import Footer from './Footer';
import { Filter } from './Footer';
import { useRef } from 'react';

export interface Todo {
  id: string | number;
  title: string;
  completed: boolean;
  userId: number;
  loading?: boolean;
}

const TodoList: React.FC<ErrorMessagesProps> = ({ setError }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessagesNotification.EMPTY_TITLE);

      return;
    }

    const temp: Todo = {
      id: 'temp-' + Date.now(),
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      loading: true,
    };

    setTempTodo(temp);

    try {
      const savedTodo = (await createTodo({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      })) as Todo;

      setTodos(prev => [...prev, savedTodo]);
      setTempTodo(null);
    } catch {
      setTempTodo(null);
      setError(ErrorMessagesNotification.ADD);
      throw new Error(ErrorMessagesNotification.ADD);
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
        setError(null);
      } catch (err) {
        setError(ErrorMessagesNotification.LOAD);
      }
    };

    loadTodos();
  }, [setError]);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <>
      <CreateTodo
        onAdd={handleAddTodo}
        allCompleted={allCompleted}
        setError={setError}
        inputRef={inputRef}
      />
      <section className="todoapp__main" data-cy="TodoList">
        {visibleTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            setTodos={setTodos}
            inputRef={inputRef}
            setError={setError}
          />
        ))}

        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            setTodos={setTodos}
            inputRef={inputRef}
            setError={setError}
          />
        )}
      </section>
      <Footer
        todos={todos}
        filter={filter}
        setFilter={setFilter}
        setTodos={setTodos}
        inputRef={inputRef}
        setError={setError}
      />
    </>
  );
};

export default TodoList;
