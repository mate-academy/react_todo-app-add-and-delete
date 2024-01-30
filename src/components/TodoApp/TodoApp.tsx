import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  createTodoAPI, deleteTodoAPI, getTodosAPI,
} from '../../api/todos';
import { useTodos } from '../hooks/useTodos';

import { Header } from '../TodoHeader/TodoHeader';
import { TodoList } from '../TodoList';
import { Footer } from '../TodoFooter';
import { Notification } from '../ErrorNotification';

import { Todo } from '../../types/Todo';
import { ShowError } from '../../types/ShowErrors';
import { USER_ID } from '../../types/USER_ID';
import { TodoFilter } from '../../types/TodoFilter';

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<TodoFilter>(
    TodoFilter.All,
  );
  const [title, setTitle] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState<ShowError | null>(null);
  const hideError = useCallback(
    () => setError(null),
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  useEffect(() => {
    getTodosAPI()
      .then(newTodos => setTodos(newTodos))
      .catch(() => setError(ShowError.fetchTodos));
  }, []);

  const handleSelectedTodos = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      switch (event.currentTarget.textContent) {
        case TodoFilter.Active:
          setSelectedTodos(TodoFilter.Active);
          break;

        case TodoFilter.Completed:
          setSelectedTodos(TodoFilter.Completed);
          break;

        default:
          setSelectedTodos(TodoFilter.All);
          break;
      }
    }, [],
  );

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setTitle(newTitle);
  };

  const handleSubmitTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title || !title?.trim()) {
      setError(ShowError.createTodo);

      return;
    }

    if (title) {
      setIsDisabled(true);

      setTempTodo({
        id: 0, title: '', userId: USER_ID, completed: false,
      });

      createTodoAPI(title.trim())
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTitle(null);
        })
        .catch(() => setError(ShowError.addTodo))
        .finally(() => {
          setTempTodo(null);
          setIsDisabled(false);
        });
    }
  };

  const deleteTodo = (todoID: number) => {
    setTempTodo({
      id: 0, title: '', userId: USER_ID, completed: false,
    });

    deleteTodoAPI(todoID)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoID)))
      .catch(() => setError(ShowError.deleteTodo))
      .finally(() => setTempTodo(null));
  };

  const removeComplitedTodos = () => {
    Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo => deleteTodoAPI(todo.id)),
    )
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => !todo.completed)));
  };

  const isEmptyTodos = todos.length === 0;

  const filteredTodos = useTodos(todos, selectedTodos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          isDisabled={isDisabled}
          handleChangeTitle={handleChangeTitle}
          handleCreateTodo={handleSubmitTodo}
        />

        {!isEmptyTodos && (
          <>
            <TodoList
              title={title}
              tempTodo={tempTodo}
              todos={filteredTodos}
              deleteTodo={deleteTodo}
            />

            <Footer
              todos={todos}
              selectedTodos={selectedTodos}
              handleSelectedTodos={handleSelectedTodos}
              removeComplitedTodos={removeComplitedTodos}
            />
          </>
        )}
      </div>

      <Notification error={error} hideError={hideError} />
    </div>
  );
};
