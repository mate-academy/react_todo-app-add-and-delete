import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import * as todoService from '../../api/todos';
import { useFilteredTodos } from '../hooks/useFilteredTodos';

import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { Notification } from '../Notification';

import { Todo } from '../../types/Todo';
import { ShowError } from '../../types/ShowErrors';
import { USER_ID } from '../../types/constants';
import { TodosFilters } from '../../types/TodosFilters';

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<TodosFilters>(
    TodosFilters.All,
  );
  const [title, setTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setError(null);

    todoService.getTodos()
      .then(newTodos => setTodos(newTodos))
      .catch(() => setError(ShowError.fetchTodos));
  }, []);

  const handleSelectedTodos = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      switch (event.currentTarget.textContent) {
        case TodosFilters.Active:
          setSelectedTodos(TodosFilters.Active);
          break;

        case TodosFilters.Completed:
          setSelectedTodos(TodosFilters.Completed);
          break;

        default:
          setSelectedTodos(TodosFilters.All);
          break;
      }
    }, [],
  );

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const addTodoTitle = event.target.value;

    setTitle(addTodoTitle);
  };

  const handleSubmitCreateTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setError(ShowError.createTodo);

      return;
    }

    const trimed = title.trim();

    if (trimed === '') {
      setError(ShowError.createTodo);

      return;
    }

    setIsLoading(true);

    setTempTodo({
      id: 0, title: trimed, userId: USER_ID, completed: false,
    });

    todoService.createTodo({ title: trimed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle(null);
      })
      .catch(() => setError(ShowError.addTodo))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
    // }
  };

  const deleteTodo = (todoID: number) => {
    setTempTodo({
      id: 0, title: '', userId: USER_ID, completed: false,
    });

    todoService.deleteTodo(todoID)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoID)))
      .catch(() => setError(ShowError.deleteTodo))
      .finally(() => setTempTodo(null));
  };

  const removeComplitedTodos = () => {
    Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo => todoService.deleteTodo(todo.id)),
    )
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => !todo.completed)));
  };

  const isEmptyTodos = useMemo(() => {
    return todos.length === 0;
  }, [todos]);

  const filteredTodos = useFilteredTodos(todos, selectedTodos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          isLoading={isLoading}
          handleChangeTitle={handleChangeTitle}
          handleSubmitCreateTodo={handleSubmitCreateTodo}
        />

        {!isEmptyTodos && (
          <>
            <TodoList
              // title={title}
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
