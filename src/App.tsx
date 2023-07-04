import React, {
  useEffect,
  useCallback,
  useState,
  FormEvent,
} from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { Footer } from './components/todoFooter';
import { Message } from './components/ErrorMessege';
import { Todo } from './types/Todo';
import { getTodos, addTodos, deleteTodo } from './api/todos';
import { client } from './utils/fetchClient';
import { TodoStatus } from './types/TodoStatus';
import { FilterTodos } from './utils/todoFilter';

export const USER_ID = 10883;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState<TodoStatus>(TodoStatus.All);
  const [visibleError, setVisibleError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setVisibleError('Unable to load todos');
      });
  }, []);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    setTempTodo({
      id: 0,
      title: inputValue,
      completed: false,
      userId: USER_ID,
    });

    if (!inputValue.trim()) {
      setVisibleError('Title can`t be empty');
      setIsLoading(false);
      setTempTodo(null);

      return;
    }

    addTodos(USER_ID, {
      title: inputValue,
      userId: USER_ID,
      completed: false,
    })
      .then((result) => {
        setTodos(prevTodos => {
          return [...prevTodos, result];
        });
      })
      .catch(() => {
        setVisibleError('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setInputValue('');
      });
  }, [inputValue, todos]);

  const removeTodo = (todoId: number) => {
    setDeletedTodoId((prevState) => [...prevState, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(
          todos.filter(todo => (
            todo.id !== todoId
          )),
        );
      })
      .catch(() => {
        setVisibleError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletedTodoId([0]);
      });
  };

  const removeCompletedTodos = useCallback(() => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(
      completedTodoIds.map(id => (
        client.delete(`/todos/${id}`)
          .catch(() => {
            setVisibleError(`Unable to delete todo with ID ${id}`);
          }))),
    )
      .then(() => {
        const filteredTodos = todos.filter(todo => !todo.completed);

        setTodos(filteredTodos);
      })
      .catch(() => {
        setVisibleError('Unable to delete completed todos');
      });
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        todos={todos}
        handleSubmit={handleSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
      />

      <div className="todoapp__content">

        <TodoList
          tempTodo={tempTodo}
          todos={FilterTodos(todos, todoFilter)}
          removeTodo={removeTodo}
          deletedTodoId={deletedTodoId}
        />

        {todos.length > 0 && (
          <Footer
            setTodoFilter={setTodoFilter}
            todoFilter={todoFilter}
            todos={todos}
            removeCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>

      <Message
        visibleError={visibleError}
        setVisibleError={setVisibleError}
      />
    </div>
  );
};
