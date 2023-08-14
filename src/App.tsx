/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { Error, Filter } from './utils/Enum';
import * as todoService from './api/todos';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentError, setCurrentError] = useState(Error.NOTHING);
  const [filterTodo, setFilterTodo] = useState(Filter.ALL);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  const filteredTodos = useMemo(() => {
    switch (filterTodo) {
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);

      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, [filterTodo, todos]);

  const removeLoading = useCallback((todoId: number) => {
    const tempLoadingTodoIds = [...loadingTodoIds]
      .filter((id) => id !== todoId);

    setLoadingTodoIds(tempLoadingTodoIds);
  }, [loadingTodoIds]);

  const deleteTodo = useCallback((todoId: number) => {
    setLoadingTodoIds(ids => [...ids, todoId]);

    todoService.deleteTodo(todoId)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch(() => setCurrentError(Error.DELETE))
      .finally(() => removeLoading(todoId));
  }, [loadingTodoIds]);

  useEffect(() => {
    if (tempTodo) {
      setLoadingTodoIds(ids => [...ids, 0]);
    } else {
      removeLoading(0);
    }
  }, [tempTodo]);

  useEffect(() => {
    todoService.getTodos(todoService.USER_ID)
      .then((data) => setTodos(data))
      .catch(() => setCurrentError(Error.FETCH));
  }, []);

  useEffect(() => {
    setIsActive(!!(!todos.find(todo => !todo.completed) && todos.length));

    if (todos.find(todo => todo.completed)) {
      setIsCompleted(true);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeButton={isActive}
          setNewTodo={setTempTodo}
          setCurrentError={setCurrentError}
          setTodos={setTodos}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onDelete={deleteTodo}
          loadingTodoIds={loadingTodoIds}
          newTodo={tempTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filterTodos={filterTodo}
            setFilterTodos={setFilterTodo}
            clearButton={isCompleted}
            onDelete={deleteTodo}
          />
        )}

        {currentError !== Error.NOTHING && (
          <TodoError
            currentError={currentError}
            setCurrentError={setCurrentError}
          />
        )}

      </div>
    </div>
  );
};
