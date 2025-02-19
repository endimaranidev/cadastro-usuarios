import { useEffect, useState, useRef } from 'react'
import { Trash2Icon } from 'lucide-react'
import './style.css'
import api from '../../services/api'

function Home() {

  const [users, setUsers] = useState([])

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    try{
      const usersFromApi = await api.get('/users')
      setUsers(usersFromApi.data)
    } catch (error) {
      console.error("Erro ao obter usuário", error)
    }
  }

  const [loading, setLoading] = useState(false);
  
  async function createUsers() {
    setLoading(true)
    try {
      await api.post('/users', {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      })
  
      inputName.current.value = "";
      inputAge.current.value = "";
      inputEmail.current.value = "";
      
      getUsers()
    } catch (error) {
      console.error("Erro ao criar usuário", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteUsers(id) {
    try {
      await api.delete(`/users/${id}`)
  
      getUsers()
    } catch(error) {
      console.error("Erro ao deletar usuário", error)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Usuários</h1>

        <input type="text" name='name' placeholder='Nome' ref={inputName}/>
        <input type="number" name='age' placeholder='Idade' ref={inputAge}/>
        <input type="email" name='email' placeholder='E-mail' ref={inputEmail}/>

        <button type='button' onClick={createUsers} disabled = {loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      {users.map(user => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>E-mail: <span>{user.email}</span></p>
          </div>
          <button className='trash-icon' onClick={() => deleteUsers(user.id)}>
            <Trash2Icon />
          </button>
        </div>
      ))}


    </div>
  )
}

export default Home
