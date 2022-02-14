import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import axios from "axios";
import Navbar from "./components/Menu";
import Footer from "./components/Footer";
import UserList from "./components/User";
import ToDoList from "./components/ToDo";
import {ProjectDetail, ProjectList} from "./components/Project";
import LoginForm from "./components/Auth";


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
           todos: []
       }
   }

   componentDidMount() {
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
                  </header>
                  <main>
                      <div>
                        <Routes>
                            <Route path='/' element={<UserList users={this.state.users} />} />

                            <Route path='/projects' element={<ProjectList items={this.state.projects} />} />

                            <Route path='/todos' element={<ToDoList items={this.state.todos} />} />

                            <Route path='/login' element={<LoginForm />} />
                        </Routes>
                      </div>
                  </main>
              <Footer />
            </BrowserRouter>
       )
   }
}

export default App;
