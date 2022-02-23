import React from 'react'
import {Link} from "react-router-dom";


const ToDoListItem = ({item, deleteFunction}) => {
    return (
        <tr>
            <td>{item.id}</td>
            <td>{item.text}</td>
            <td>{item.create}</td>
            <td>{item.project}</td>
            <td>{item.creator}</td>
            <td>{item.isActive ? 'active' : 'closed'}</td>
            <td><button onClick={()=>deleteFunction(item.id)} type='button'>Delete</button></td>
        </tr>
    )
}

const ToDoList = ({items, deleteFunction}) => {
    //console.log(users)
    return (
        <div>
            <table className="table">
                <tr>
                    <th>Id</th>
                    <th>Text</th>
                    <th>Create</th>
                    <th>Project</th>
                    <th>Creator</th>
                    <th>Is Active</th>
                    <th></th>
                </tr>
                {items.map((item) => <ToDoListItem item={item} deleteFunction={deleteFunction}/>)}
            </table>
            <Link to='/todo/create'>Create</Link>
        </div>

    )
}

export default ToDoList
