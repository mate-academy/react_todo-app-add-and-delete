/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { useTodosFilter } from './UseHooks/UseTodosFilter';
import { useTodo } from './UseHooks/UseTodos';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const {
    data: todos,
    errorMessage,
    tempTodo,
    isInputDisabled,
    isTodoDeleted,
    hasCompletedTodos,
    setErrorMessage,
    deleteTodo,
    addTodo,
    deleteCompletedTodos,
  } = useTodo();

  const { visibleTodos, filter, setFilter, countOfActiveTodos } =
    useTodosFilter(todos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={addTodo}
          isInputDisabled={isInputDisabled}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          isTodoDeleted={isTodoDeleted}
        />

        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            countOfActiveTodos={countOfActiveTodos}
            deleteCompletedTodos={deleteCompletedTodos}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
