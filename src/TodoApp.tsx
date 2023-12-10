import { useEffect, useState } from 'react';
import { ErrorNotification } from './ErrorNotification';
import { Footer } from './Footer';
import { Header } from './Header';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { TodoList } from './TodoList';
import { getTodos } from './api/todos';

type Props = {
  userId: number;
};

export const TodoApp: React.FC<Props> = ({ userId }) => {
  const [filter, setFilter] = useState(Filter.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearCompleted, setClearCompleted] = useState(false);

  useEffect(() => {
    setErrorMessage('');
    getTodos(userId)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, [userId]);

  const getFilteredTodos = () => {
    switch (filter) {
      case Filter.active:
        return todos.filter((todo) => !todo.completed);
      case Filter.completed:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          userId={userId}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          todos={todos}
          temp={tempTodo}
        />
        <TodoList
          filteredTodos={getFilteredTodos}
          todos={todos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          userId={userId}
          setErrorMessage={setErrorMessage}
          clearCompleted={clearCompleted}
        />
        {!!todos.length && (
          <Footer
            setFilter={setFilter}
            todos={todos}
            filter={filter}
            userId={userId}
            setErrorMessage={setErrorMessage}
            setTodos={setTodos}
            clearCompleted={clearCompleted}
            setClearCompleted={setClearCompleted}
          />
        )}
      </div>
      {errorMessage && (
        <ErrorNotification
          setErrorMessages={setErrorMessage}
          errorMessages={errorMessage}
        />
      )}
    </div>
  );
};
