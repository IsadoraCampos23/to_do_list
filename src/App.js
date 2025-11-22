import './App.css';
import { useEffect, useState } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs';

const API = 'http://localhost:3001';

function App() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar tarefas ao abrir a página
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch(API + "/todos");
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Criar nova tarefa
  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      title,
      time,
      done: false,
    };

    try {
      const res = await fetch(API + "/todos", {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const savedTodo = await res.json(); // pega o objeto salvo com ID correto
      setTodos((prevTodos) => [...prevTodos, savedTodo]);

      setTitle("");
      setTime("");
    } catch (err) {
      console.error(err);
    }
  };

  // Deletar tarefa
  const handDelete = async (id) => {
    try {
      await fetch(API + "/todos/" + id, {
        method: "DELETE",
      });

      setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Editar tarefa (marcar como feita/não feita)
  const handEdit = async (todo) => {
    const updatedTodo = { ...todo, done: !todo.done };

    try {
      const res = await fetch(API + "/todos/" + todo.id, {
        method: "PUT",
        body: JSON.stringify(updatedTodo),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const newTodoFromServer = await res.json();

      setTodos((prevState) =>
        prevState.map((t) => (t.id === newTodoFromServer.id ? newTodoFromServer : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>React Todo</h1>
      </div>

      <div className='form-todo'>
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input  
              type="number"
              name="time"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time}
              required
            />
          </div>

          <input type="submit" value="Criar tarefa" />
        </form>
      </div>

      <div className='list-todo'>
        <h2>Lista de tarefas:</h2>
        {loading && <p>Carregando...</p>}
        {todos.length === 0 && !loading && <p>Você não tem tarefas cadastradas.</p>}

        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time} horas</p>
            <div className="actions">
              <span onClick={() => handEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;