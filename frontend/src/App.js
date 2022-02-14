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

                            <Route path='/projects' element={<ProjectList items={this.state.projects} />} />

                            <Route path='/todos' element={<ToDoList items={this.state.todos} />} />

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
