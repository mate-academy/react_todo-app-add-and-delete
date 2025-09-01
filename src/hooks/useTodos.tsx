//TODO:
// import { useState } from 'react';
// import { Todo } from '../../types/Todo';
// import { getTodos } from '../api/todos';
// import { ErrorMesagges, FilterOptions } from './types/enums';

// export const useTodos = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [errorMessage, setErrorMessage] = useState<ErrorMesagges>(
//     ErrorMesagges.defaultValue,
//   );
//   const loadTodos = () => {
//     getTodos()
//       .then(data => setTodos(data))
//       .catch(() => {
//         setErrorMessage(ErrorMesagges.UnableLoad);
//       });
//   };

//   return {
//     loadTodos,
//   };
// };
