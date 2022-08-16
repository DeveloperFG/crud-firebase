import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'
import firebase from '../src/firebaseConnection'
import React, { useEffect, useState } from 'react'
import './style.css'

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('');
  const [cpf, setCpf] = useState('');
  const [posts, setPosts] = useState([]);

  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');

  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  // checando se tem usuário logado
  useEffect(() => {
    async function checkLogin() {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // usuario logado entra aqui
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email
          })

        } else {
          // se não entra aqui
          setUser(false);
          setUserLogged({})
        }
      })
    }

    checkLogin();

  }, [])



  async function handleAdd() {

    if (cpf, titulo, autor === "") {
      toast.error('Preencha os campos')
    }

    await firebase.firestore().collection('post')
      .doc(cpf)
      .set({
        cpf: cpf,
        titulo: titulo,
        autor: autor

      })

      .then(() => {
        console.log('dados cadastrados com sucesso!!!');
        toast.success('Cadastrado com sucesso!!!')
        setCpf('')
        setTitulo('')
        setAutor('')

      })
      .catch((error) => {
        console.log('gerou algum erro:' + error)
      })
  }

  // buscando apenas um item por vez

  async function buscarCpf() {

    await firebase.firestore().collection('post')
      .doc(cpf)
      .get()
      .then((snapshot) => {

        setTitulo(snapshot.data().titulo);
        setAutor(snapshot.data().autor);
      })

  }

  // buscando os item usando uma lista de array

  async function ListaBanco() {

    await firebase.firestore().collection('post')
      .get()
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            cpf: doc.data().cpf,
            autor: doc.data().autor,
            titulo: doc.data().titulo,

          })
        })

        setPosts(lista)

      })
      .catch(() => {
        toast.error('Erro ao buscar no Banco!!!')
        console.log('DEU ALGUM ERRO ')
      })

  }

  // Atualizando dados do cliente na lista

  async function Atualiar() {

    await firebase.firestore().collection('post')
      .doc(cpf)
      .set({
        cpf: cpf,
        titulo: titulo,
        autor: autor

      })

      .then(() => {
        toast.success('Dados atualizados!!!')
        setCpf('')
        setTitulo('')
        setAutor('')

      })
      .catch((error) => {
        toast.error('Erro ao atualizar!!!')
        console.log('gerou algum erro:' + error)
      })
  }

  // Excluindo cliente da lista

  async function Excluir(cpf) {

    await firebase.firestore().collection('post').doc(cpf)
      .delete()
      .then(() => {
        toast.success('Exluido com sucesso!!!')

      })
      .catch((error) => {
        toast.error('Erro ao excluir!!!')
        console.log('gerou algum erro:' + error)
      })
  }


  async function NovoUser() {
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then((value) => {
        toast.success('Novo usuario cadastrado!')
        setEmail('')
        setSenha('')
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          toast.error('Senha muito fraca..')
        } else if (error.code === 'auth/email-already-in-use') {
          toast.error('Esse email ja existe!');
        }
      })
  }


  // Saindo da aplicação
  async function Logout() {
    await firebase.auth().signOut();
  }


  // Logando na aplicação

  async function FazerLogin() {
    await firebase.auth().signInWithEmailAndPassword(email, senha)
      .then(() => {
        toast.success('Logado com sucesso!')
      })
      .catch((error) => {
        toast.error('Erro ao logar!!!')
        console.log('gerou algum erro:' + error)
      })
  }

  return (

    <div className='body'>

      <ToastContainer />

      <div className="container">

        <h1> Login </h1>
        <label>Email</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />

        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} /> <br />

        <div>
          <button onClick={NovoUser}>Cadastrar</button>
          <button className='btnFunc' onClick={FazerLogin}>Fazer Login</button>
          <button onClick={Logout}>Sair</button>
        </div>


      </div>

      <br />

      <div className='container'>

        <header>
          <h1> Customer Registration </h1>
        </header>

        <br />

        {user && (
          <div>
            <strong> Seja bem vindo! (Você está logado!) </strong>  <br />
            <strong> id: <small> {userLogged.uid} </small> </strong>  <br />
            <strong> Email: <small> {userLogged.email}</small>  </strong>  <br />
            <br />
          </div>

        )}

        <div className='dados'>
          <label className='label'> Cpf: </label>
          <input className='inputCpf' placeholder='insira o cpf' type='text' value={cpf} onChange={(e) => setCpf(e.target.value)} />
        </div>

        <div className='dados'>
          <label className='label'> Nome: </label>
          <input className='inputNome' placeholder='insira o nome' type='text' value={autor} onChange={(e) => setAutor(e.target.value)} />
        </div>

        <div className='dados'>
          <label className='label'> Obs: </label>
          <textarea className='inputObs' placeholder='Insira uma observação' type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>


        <div className='divButtons' >
          <button className='btn' onClick={handleAdd}> Cadastrar Cliente </button>
          <button className='btn' onClick={buscarCpf}> Buscar por CPF </button> <br />
          <button className='btn' onClick={Atualiar}> Atualizar dados </button> <br />
          <button className='btn' onClick={ListaBanco}> Listar todos os Clientes </button> <br />

        </div>

        <h2>Banco de dados: </h2>

        <ol>
          {posts.map((item) => {
            return (
              <li key={item.id}>
                <span className='itemCpf'> Cpf: {item.cpf} </span> <br />
                <span className='item'> User: {item.autor} </span>  <br />
                <span className='item' > Descrição: {item.titulo} </span> <br />
                <button className='excluir' onClick={() => Excluir(item.cpf)}> Excluir da Lista </button>
                <hr />
              </li>
            )
          })}
        </ol>
      </div>
    </div>



  );
}

export default App;