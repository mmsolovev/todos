import React from 'react'


class ToDoForm extends React.Component {
    constructor(props) {
      super(props)
      this.state = {project: 0, text: ''}
    }

    handleChange(event)
    {
        this.setState(
                {
                    [event.target.name]: event.target.value
                }
            );
    }
    handleSubmit(event) {
      this.props.save(this.state.project, this.state.text)
      event.preventDefault()
    }

    render() {
      return (
        <form onSubmit={(event)=> this.handleSubmit(event)}>
            <div className="form-group">
            <label for="project">project</label>
            <select name="project" className='form-control' onChange={(event)=>this.handleChange(event)}>
                {this.props.projects.map((item)=><option value={item.id}>{item.name}</option>)}
            </select>
            </div>

        <div className="form-group">
            <label for="text">text</label>

            <input type="text" className="form-control" name="text" value={this.state.text} onChange={(event)=>this.handleChange(event)} />


          </div>
          <input type="submit" className="btn btn-primary" value="Save" />
        </form>
      );
    }
  }

  export default ToDoForm
