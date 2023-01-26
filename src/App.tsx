import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { addTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { filterTodosByCompleted } from './helpers/helpers';
import { FilterStatus } from './types/Filterstatus';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [newTitle, setNewTitle] = useState('');

  const newTodoField = useRef<HTMLInputElement>(null);

  const completedTodos = todos.filter(todo => todo.completed === true);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const uncompletedTodosAmount = useMemo(() => {
    const uncompleted = todos.filter(todo => !todo.completed);

    return uncompleted.length;
  }, [todos]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Unable to load todos'));
    }
  }, [user]);

  const createTodo = () => {
    if (newTitle === '') {
      showError("Title can't be empty");
    }

    if (user) {
      const newTodo = {
        userId: user.id,
        title: newTitle,
        completed: false,
      };

      addTodo(newTodo)
        .then(createdTodo => setTodos(prev => ([
          ...prev,
          createdTodo,
        ])))
        .catch(() => showError('Unable to add a todo`'));
    }
  };

  const visibleTodos = useMemo(() => (
    filterTodosByCompleted(todos, filterStatus)
  ), [filterStatus, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          onAddTodo={createTodo}
          onSetNewTitle={setNewTitle}
          newTitle={newTitle}
        />

        {todos.length !== 0 && (
          <>
            <TodoList todos={visibleTodos} />
            <Footer
              completedTodos={completedTodos}
              uncompletedTodosAmount={uncompletedTodosAmount}
              onStatusChange={setFilterStatus}
              filterStatus={filterStatus}
            />
          </>
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        onCloseErrorButton={() => showError('')}
      />
    </div>
  );
};
