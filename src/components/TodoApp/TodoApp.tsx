import {
  useContext, useMemo, useState,
} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoList } from '../TodoList';
import { TodosContext } from '../../contexts/TodosProvider';
import { TodoAction } from '../../types/TodoAction';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../ErrorMessage';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { TempTodo } from '../TempTodo';
import { filterTodos } from '../../services/filterTodos';

export const TodoApp = () => {
  const {
    errorMessage: contextErrorMessage,
    filterOptions,
    todos,
    dispatch,
  } = useContext(TodosContext);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState(contextErrorMessage);
  const filteredTodos = useMemo(() => filterTodos(todos, filterOptions),
    [todos, filterOptions]);

  const handleErrorHiding = () => {
    if (errorMessage) {
      if (contextErrorMessage) {
        dispatch({
          type: TodoAction.SetError,
          errorMessage: '',
        });
      }

      setErrorMessage('');
    }
  };

  if (contextErrorMessage && errorMessage !== contextErrorMessage) {
    setErrorMessage(contextErrorMessage);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          setErrorMessage={setErrorMessage}
        />

        <TodoList todos={filteredTodos} />

        <TransitionGroup>
          {!!tempTodo
            && (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
              >

                <TempTodo todo={tempTodo} />
              </CSSTransition>
            )}
        </TransitionGroup>

        {!!todos.length
          && (
            <Footer />
          )}
      </div>

      <ErrorMessage
        isErrorShown={!!errorMessage}
        errorMessage={errorMessage}
        onErrorHiding={handleErrorHiding}
      />
    </div>
  );
};
