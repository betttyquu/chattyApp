import React, { Component } from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      messages: [] // messages coming from the server will be stored here as they arrive
    };
    this.onInput = this.onInput.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  onInput(event) {
    if (event.key === 'Enter') {
      const message = this.newObj(this.state.currentUser.name, event.target.value)
      this.socket.send(JSON.stringify(message));
      event.target.value = "";
    }
  }

  handleChange(event) {
    this.setState({currentUser: {name: event.target.value}});
  }


  newObj(username, content) {
    let post = {
      username: username,
      content: content
    }
    return {
      type: "post",
      data: post
    }
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.onopen = (event) => {
      console.log('Connected to server');
    }
    this.socket.onmessage = (event) => {
      this.setState({messages:[...this.state.messages, JSON.parse(event.data)]})

    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages = {this.state.messages}/>
        <ChatBar 
          onChangeUser={this.handleChange}
          currentUser={this.state.currentUser}
          value={this.state.input}
          onChange={this.onInput} />
      </div>
    );
  }
}

export default App;
