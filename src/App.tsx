import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';

import { Todo } from './types/Todo';
import { Filters } from './types/Filters';

import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todoList, setTodolist] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filters>(Filters.All);
  const [showError, setShowError] = useState<Errors>(Errors.None);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [targetTodoId, setTargetTodoId] = useState<number>(0);
  const [completedDelete, setCompletedDelete] = useState<boolean>(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const countActivaTodos = todosFromServer.filter(
    todo => !todo.completed,
  ).length;

  const completedTodo = todoList.filter(todo => todo.completed);

  const removeAllState = () => {
    setIsAdding(false);
    setInputValue('');
    setTargetTodoId(0);
    setCompletedDelete(false);
  };

  async function loadingTodos() {
    if (!user) {
      return;
    }

    const todos = await getTodos(user.id);

    removeAllState();
    setTodosFromServer(todos);
    setTodolist(todos);
  }

  async function addNewTodo() {
    if (!user) {
      setShowError(Errors.Add);
      removeAllState();

      return;
    }

    if (!inputValue.trim()) {
      setShowError(Errors.Empty);
      removeAllState();

      return;
    }

    setIsAdding(true);

    const newTodo: Todo = {
      id: 0,
      userId: user.id,
      title: inputValue.trim(),
      completed: false,
    };

    try {
      await postTodo(newTodo);
      loadingTodos();
    } catch (error) {
      setShowError(Errors.Add);
      removeAllState();
    }
  }

  async function removeTodo() {
    if (!targetTodoId) {
      return;
    }

    try {
      await deleteTodo(targetTodoId);
      loadingTodos();
    } catch {
      setShowError(Errors.Delete);
      removeAllState();
    }
  }

  async function removeCompleted() {
    setCompletedDelete(true);

    try {
      await Promise.allSettled(
        completedTodo.map(todo => deleteTodo(todo.id)),
      );

      loadingTodos();
    } catch {
      setShowError(Errors.Delete);
      removeAllState();
    }
  }

  useEffect(() => {
    removeTodo();
  }, [targetTodoId]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadingTodos();
  }, []);

  useEffect(() => {
    switch (filterBy) {
      case Filters.Completed:
      case Filters.Active:
        setTodolist([...todosFromServer].filter(
          todo => {
            return filterBy === 'completed'
              ? todo.completed
              : !todo.completed;
          },
        ));

        break;

      default:
        setTodolist(todosFromServer);
    }
  }, [filterBy]);

  useEffect(() => {
    setTimeout(() => {
      setShowError(Errors.None);
    }, 3000);
  }, [showError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          addNewTodo={() => addNewTodo()}
          isAdding={isAdding}
          inputValue={inputValue}
          setInputValue={setInputValue}
          addButton={todoList.length > 0}
        />

        {todosFromServer && (
          <>
            <TodoList
              todoList={todoList}
              setShowError={setShowError}
              inputValue={inputValue}
              isAdding={isAdding}
              targetTodoId={targetTodoId}
              setTargetTodoId={setTargetTodoId}
              completedDelete={completedDelete}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${countActivaTodos} items left`}
              </span>

              <Filter
                filterBy={filterBy}
                setFilterBy={setFilterBy}
              />

              {
                completedTodo.length > 0
                  ? (
                    <button
                      data-cy="ClearCompletedButton"
                      type="button"
                      className="todoapp__clear-completed"
                      onClick={removeCompleted}
                    >
                      Clear completed
                    </button>
                  ) : (
                    <div
                      className="todoapp__clear-completed"
                      style={
                        { opacity: 0, cursor: 'default' }
                      }
                    >
                      Clear completed
                    </div>
                  )
              }
            </footer>
          </>
        )}
      </div>

      {showError !== Errors.None && (
        <ErrorNotification
          text={showError}
          setShowError={setShowError}
        />
      )}
    </div>
  );
};
