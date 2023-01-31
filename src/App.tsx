/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotifiaction/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleClickCloseError = () => {
    setIsError(false);
  };

  const handleFilterStatusChange = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const showError = (message: string) => {
    setIsError(true);
    setErrorMessage(message);

    setTimeout(() => setIsError(false), 3000);
  };

  const onAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      showError('Title is empty!');
      setNewTodoTitle('');

      return;
    }

    if (user) {
      setTempTodo({
        id: 0,
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      });

      setIsAdding(true);

      addTodo(user.id, newTodoTitle)
        .then(addedTodo => {
          setTodos((prevTodos) => {
            return [...prevTodos,
              {
                id: addedTodo.id,
                userId: addedTodo.userId,
                title: addedTodo.title,
                completed: addedTodo.completed,
              },
            ];
          });
          setNewTodoTitle('');
        })
        .catch(() => showError('Unable to add todo'))
        .finally(() => {
          setIsAdding(false);
          setTempTodo(null);
        });
    }
  };

  const handleDeleteTodoClick = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => (
        setTodos(prevTodos => prevTodos.filter(
          todo => todo.id !== todoId,
        ))
      ))
      .catch(() => {
        showError('Unable to delete a todo');
      });
  };

  const handleClickClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodoClick(todo.id);
      }
    });
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          showError('Unable to load todos');
        });
    }
  }, [user]);

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filterStatus) {
        case 'Active':
          return !todo.completed;

        case 'Completed':
          return todo.completed;

        default:
          return true;
      }
    })
  ), [todos, filterStatus]);

  const todosToCompleteCounter = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={onAddTodo}
          todoTItle={newTodoTitle}
          setTodoTitle={setNewTodoTitle}
          isAdding={isAdding}
        />
        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              onRemove={handleDeleteTodoClick}
            />

            <Footer
              filterStatus={filterStatus}
              todosLeft={todosToCompleteCounter}
              AllTodosLength={todos.length}
              onFilterSelect={handleFilterStatusChange}
              onClearCompleted={handleClickClearCompleted}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          onClose={handleClickCloseError}
          isError={isError}
        />
      )}
    </div>
  );
};
