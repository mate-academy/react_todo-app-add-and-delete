import
React, {
  ReactNode,
  Dispatch,
  SetStateAction,
  useState,
  FC,
} from 'react';
import { Todo } from '../../types/Todo';

type PropsContext = [Todo[], Dispatch<SetStateAction<Todo[]>>];

export const TodoContext = React.createContext<PropsContext>([[], () => {}]);

type Props = {
  children: ReactNode;
};

export const TodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodoContext.Provider value={[todos, setTodos]}>
      {children}
    </TodoContext.Provider>
  );
};
