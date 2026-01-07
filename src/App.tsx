import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { NewTodo } from './types/NewTodo';
import { Todo } from './types/Todo';
import { TodoErrors, TodosFilter } from './types/enums';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodosFilter>(TodosFilter.All);
  const [error, setError] = useState<TodoErrors | null>(null);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const displayError = (displayedError: TodoErrors) => {
    setError(displayedError);
    setIsErrorShown(true);
    setTimeout(() => setIsErrorShown(false), 3000);
  };

  useEffect(() => {
    getTodos()
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        displayError(TodoErrors.FetchError);
      });
  }, []);

  const changeFilter = (newFilter: TodosFilter) => {
    setFilter(newFilter);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addNewTodo = () => {
    const usedTitle = titleInputRef.current?.value.trim() ?? '';

    if (usedTitle === '') {
      displayError(TodoErrors.EmptyTitleError);

      return;
    }

    setIsUpdating(true);

    const newTodo: NewTodo = {
      userId: USER_ID,
      title: usedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addTodo(newTodo)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        titleInputRef.current!.value = '';
      })
      .catch(() => {
        displayError(TodoErrors.AddError);
      })
      .finally(() => {
        setTempTodo(null);
        setIsUpdating(false);
        titleInputRef.current?.focus();
      });
  };

  const removeTodo = (id: number) => {
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        displayError(TodoErrors.DeleteError);
      })
      .finally(() => {
        titleInputRef.current?.focus();
      });
  };

  const clearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        removeTodo(todo.id);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          titleInputRef={titleInputRef}
          isUpdating={isUpdating}
          isToggleAllActive={todos.every(todo => todo.completed)}
          onSubmit={addNewTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              handleDelete={removeTodo}
              tempTodo={tempTodo}
            />

            <Footer
              todos={todos}
              currentFilter={filter}
              handleFilterChange={changeFilter}
              handleClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        visible={isErrorShown}
        handleCloseError={() => setIsErrorShown(false)}
      />
    </div>
  );
};
