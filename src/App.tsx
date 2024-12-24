import React, { useEffect, useState, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { getTodos, addTodos, deleteTodos, USER_ID } from './api/todos';
import { TodoItem } from './components/TodoItem';
import { Errors } from './components/Errors';
import { Footer } from './components/Footer';
import { filterTodos } from './utils/FilterTodo';
import { FilterBy } from './types/FilterBy';
import { ErrorMessage } from './types/ErrorMassage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [currentFilter, setCurrentFilter] = useState<FilterBy>(FilterBy.All);
  const [currentTodoIds, setCurrentTodoIds] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const filtered = useMemo(
    () => filterTodos(todos, currentFilter),
    [todos, currentFilter],
  );

  const handleNewTodo = (newTodo: Todo) => {
    const newTodoWithStatus = { ...newTodo, isPending: true };
    const newTodosList = [...todos, newTodoWithStatus];

    setIsInputDisabled(true);
    setCurrentTodoIds([...currentTodoIds, newTodo.id]);
    setTodos(newTodosList);

    addTodos(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === newTodo.id
              ? { ...todo, id: todoFromServer.id, isPending: false }
              : todo,
          ),
        );
        setQuery('');
      })
      .catch(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== newTodo.id),
        );
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setCurrentTodoIds([]);
        setIsInputDisabled(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setCurrentTodoIds([...currentTodoIds, todoId]);
    deleteTodos(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setError(ErrorMessage.Delete))
      .finally(() => setCurrentTodoIds([]));
  };

  useEffect(() => {
    if (inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
  }, [isInputDisabled, inputRef, todos]);

  const activeTodos = todos.filter(todo => !todo.completed && !todo.isPending);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const failedDeletions: Todo[] = [];

    Promise.all(
      completedTodos.map(todo =>
        deleteTodos(todo.id).catch(() => {
          failedDeletions.push(todo);
        }),
      ),
    ).finally(() => {
      if (failedDeletions.length) {
        setError(ErrorMessage.Delete);
      }

      const newTodos = todos.filter(
        todo =>
          !todo.completed ||
          failedDeletions.some(failed => failed.id === todo.id),
      );

      setTodos(newTodos); // Оновлюємо список todos
    });
  };

  const toggleTodoStatus = (updatedTodo: Todo) => {
    setCurrentTodoIds([...currentTodoIds, updatedTodo.id]);
    setTodos(prevTodos => {
      const copyTodos = [...prevTodos];

      for (let i = 0; i < copyTodos.length; ++i) {
        if (copyTodos[i].id === updatedTodo.id) {
          copyTodos[i] = updatedTodo;
          break;
        }
      }

      return copyTodos;
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodo={handleNewTodo}
          onError={setError}
          isInputDisabled={isInputDisabled}
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleStatus={toggleTodoStatus}
              handleDeleteTodo={handleDeleteTodo}
              isLoading={currentTodoIds.includes(todo.id)}
            />
          ))}
        </section>

        {todos.length !== 0 && (
          <Footer
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
            activeTodos={activeTodos}
          />
        )}
      </div>

      <Errors error={error} onClearError={setError} />
    </div>
  );
};
