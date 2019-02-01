import React, { Component } from "react";
import httpService from './services/httpService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from './config.json';
import "./App.css";

class App extends Component {
  state = {
    posts: []
  };

    // get request to end point
    async componentDidMount() {
        // get data from endpoint
        const { data: posts} = await httpService.get(config.apiEndpoint);
        // fills tables with data
        this.setState({posts});
    }

    handleAdd = async () => {
      const obj = { title: 'a', body: 'b' };
      const { data: post } = await httpService.post(config.apiEndpoint, obj);

        // create new post table with added post
        const posts = [post, ...this.state.posts];
        // update posts table with new data
        this.setState({posts});
    };

    handleUpdate = async post => {
        post.title = 'UPDATE';
        await httpService.put(config.apiEndpoint + '/' + post.id, post);

        const posts = [...this.state.posts];
        const index = posts.indexOf(post);
        posts[index] = { ...post };
        this.setState({ posts });
    };

    // Deleting a post
    handleDelete = async post => {
        // set it to original state in case of error
        const originalPost = this.state.posts;

        // set it to new state in case of success
        const posts = this.state.posts.filter(p => p.id !== post.id);
        this.setState({ posts });

        try {
            // update endpoint
            await httpService.delete(config.apiEndpoint + '/' + post.id);
            // trow error test
            // throw new Error('');
        } catch (error) {
            // Expected error
            if(error.response && error)
            // Expected error (e.g. 404 NOT FOUND...)
            if(error.response && error.response.status === 404)
                alert('Post already been deleted');
            // unexpected error (e.g server error, bug...) axios.interceptors from httpService

            // set UI to original state in case of error
            this.setState({ posts: originalPost });
        }
    };

    render() {
    return (
      <React.Fragment>
        <ToastContainer/>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
