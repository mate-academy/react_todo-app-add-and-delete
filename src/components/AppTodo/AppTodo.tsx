import { useContext } from 'react';
import { ContextTodo } from '../ContextTodo';
import { filteredTodos } from '../../utils/filteredTodos';
import { HeaderTodo } from '../HeaderTodo';
import { ListTodo } from '../ListTodo';
import { FooterTodo } from '../FooterTodo';
import { ErrorNotification } from '../ErrorNotification';

export const AppTodo = () => {
  const {
    todos, filterBy, tempTodo, errorMessage,
  } = useContext(ContextTodo);
  const filteredListTodos = filteredTodos(todos, filterBy);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodo />

        {(!!todos.length || !!tempTodo)
          && <ListTodo todos={filteredListTodos} />}

        {!!todos.length
          && <FooterTodo />}

        {!!errorMessage
          && <ErrorNotification />}
      </div>
    </div>
  );
};
