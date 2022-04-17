import React from 'react';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import './App.css';
import axios from "axios";
import Navbar from "./components/Menu";
import Footer from "./components/Footer";
import UserList from "./components/User";
import ToDoList from "./components/ToDo";
import {ProjectDetail, ProjectList} from "./components/Project";
import LoginForm from "./components/Auth";
import Cookies from 'universal-cookie';
import ProjectForm from "./components/ProjectForm";
import ToDoForm from "./components/ToDoForm";


const DOMAIN = 'http://127.0.0.1:8000'
const get_url = (url) => `${DOMAIN}${url}`


class App extends React.Component {

   constructor(props) {
       super(props)
       this.state = {
           navbarItems: [
                {name: 'Users', href: '/'},
                {name: 'Projects', href: '/projects'},
                {name: 'TODOs', href: '/todos'},
            ],
           users: [],
           projects: [],
           project: {},
           todos: [],
           token: ''
       }
   }

   set_token(token) {
       const cookies = new Cookies()
       cookies.set('token', token)
       this.setState({'token': token})
   }

   is_authenticated() {
       return this.state.token != ''
   }

   logout() {
       this.set_token('')
   }

   get_token_from_storage() {
       const cookies = new Cookies()
       const token = cookies.get('token')
       this.setState({'token': token})
   }

   get_token(username, password) {
       axios.post('http://127.0.0.1:8000/api-token-auth/', {username: username, password: password})
           .then(response => {
               this.set_token(response.data['token'])
           }).catch(error => alert('Неверный логин или пароль'))
   }

   deleteProject(id) {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }
        axios.delete(get_url(`/api/projects/${id}`), {headers, headers})
        .then(response => {
            this.setState({projects: this.state.projects.filter((item)=>item.id != id)})
        }).catch(error => console.log(error))
   }

   deleteToDo(id) {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }
        axios.delete(get_url(`/api/todos/${id}`), {headers, headers})
        .then(response => {
            let todos = [...this.state.todos]
            const todo_index = todos.findIndex((item) => item.id == id)
            let todo = todos[todo_index]
            todo.isActive = false
            this.setState({todos: todos})
        }).catch(error => console.log(error))
    }

   createProject(name, repository) {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        const data = {name: name, repository: repository}
        const options = {headers: headers}
        axios.post(get_url('/api/projects/'), data, options)
        .then(response => {
            this.setState({projects: [...this.state.projects, response.data]})
        }).catch(error => console.log(error))
   }

   createToDo(project, text) {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        const data = {text: text, project: project}
        const options = {headers: headers}
        console.log(data)
        axios.post(get_url('/api/todos/'), data, options)
        .then(response => {
            this.setState({todos: [...this.state.todos, response.data]})
        }).catch(error => console.log(error))
   }

   componentDidMount() {
       this.get_token_from_storage()
        axios.get(get_url('/api/users/'))
        .then(response => {
            //console.log(response.data)
            this.setState({users: response.data.results})
        }).catch(error => console.log(error))

        axios.get(get_url('/api/projects/'))
        .then(response => {
            //console.log(response.data)
            this.setState({projects: response.data.results})
        }).catch(error => console.log(error))

        axios.get(get_url('/api/todos/'))
        .then(response => {
            //console.log(response.data)
            this.setState({todos: response.data.results})
        }).catch(error => console.log(error))
    }

   render () {
       return (
           <BrowserRouter>
                  <header>
                      <Navbar navbarItems={this.state.navbarItems} />
                      <ul>
                          <li>{this.is_authenticated() ? <button onClick={()=>this.logout()}>Logout</button> :
                              <Link to='/login'>Login</Link>}</li>
                      </ul>
                  </header>
                  <main>
                      <div>
                        <Routes>
                            <Route path='/' element={<UserList users={this.state.users} />} />

                            <Route path='/projects' element={<ProjectList items={this.state.projects}
                                   deleteFunction={(id) => this.deleteProject(id)}/>} />

                            <Route path='/project/create'
                                   element={<ProjectForm save={(name, repository) =>
                                       this.createProject(name, repository)}/>} />

                            <Route path='/todos' element={<ToDoList items={this.state.todos} />}
                                   deleteFunction={(id) => this.deleteToDo(id)} />

                            <Route path='/todo/create'
                                   element={<ToDoForm save={(project, text) => this.createToDo(project, text)}
                                                      projects={this.state.projects} />} />

                            <Route path='/login' element={<LoginForm get_token={(username, password) =>
                                this.get_token(username, password)} />} />
                        </Routes>
                      </div>
                  </main>
              <Footer />
            </BrowserRouter>
       )
   }
}

export default App;
