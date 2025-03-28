/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { addTodo, getTodos, deleteTodo, USER_ID } from './api/todos';
import { Errors } from './types/Errors';
import { Footer } from './components/Footer';
import { ErrorModal } from './components/ErrorModal';
import { FilterBy } from './types/FilterBy';

const filter = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case FilterBy.All:
      return todos;
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(Errors.DEFAULT);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTodoIds, setLoadedTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Errors.LOAD);
      });
  }, []);

  const handleCreateTodo = (title: string) => {
    if (!title.trim()) {
      setErrorMessage(Errors.EMPTY);

      return;
    }

    setIsLoading(true);

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    return addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.ADD);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadedTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.DELETE);
      })
      .finally(() => {
        setLoadedTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const filteredTodos = filter(todos, filterBy);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          createTodo={handleCreateTodo}
          isLoading={isLoading}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          loadedTodoIds={loadedTodoIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      <ErrorModal
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage(Errors.DEFAULT)}
      />
    </div>
  );
};
