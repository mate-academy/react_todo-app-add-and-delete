/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Header } from './components/Header';
import { TodoStatus } from './types/TodoStatus';
import { Footer } from './components/Footer';
import { TodoItem } from './components/Todo';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState(TodoStatus.All);
  const [clearCompleted, setClearCompleted] = useState(false);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const isListEmpty = useMemo(() => todos.length === 0, [todos]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => setErrorMessage(ErrorMessages.TodosWereNotLoaded));
    }
  }, [user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage(ErrorMessages.TitleIsEmpty);

      return;
    }

    if (user) {
      setIsAdding(true);
      setTempTodo({
        id: 0,
        userId: user.id,
        title,
        completed: false,
      });

      addTodo(title, user?.id)
        .then((newTodo) => {
          setTodos((prevTodos) => ([
            ...prevTodos,
            newTodo,
          ]));

          if (newTodoField.current) {
            newTodoField.current.value = '';
          }
        })
        .catch(() => setErrorMessage(ErrorMessages.TodoIsNotAdded))
        .finally(() => {
          setIsAdding(false);
          setTempTodo(null);
          setTitle('');
        });
    }
  };

  const handleDeleteTodo = (id: number) => {
    return deleteTodo(id)
      .then(() => setTodos((listOfTodos) => (
        listOfTodos.filter(todo => todo.id !== id))))
      .catch(() => setErrorMessage(ErrorMessages.TodoIsNotDeleted));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isAdding={isAdding}
          isListEmpty={isListEmpty}
          onSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          todos={todos}
          onDelete={handleDeleteTodo}
          filterStatus={filterStatus}
          clearCompleted={clearCompleted}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={handleDeleteTodo}
            isAdding={isAdding}
            clearCompleted={clearCompleted}
          />
        )}

        {isListEmpty || (
          <Footer
            onStatusChange={setFilterStatus}
            status={filterStatus}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            onClear={setClearCompleted}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
