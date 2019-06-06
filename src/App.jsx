import React, { Component } from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: { name: "Bob" },
      numOfUser: "",
      messages: [] // messages coming from the server will be stored here as they arrive
    };
    this.onInput = this.onInput.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  onInput(event) {
    if (event.key === 'Enter') {
      const message = this.postMessage(this.state.currentUser.name, event.target.value)
      this.socket.send(JSON.stringify(message));
      event.target.value = "";
    }
  }

  handleChange(event) {
    if (event.key === 'Enter') {
      console.log(this.state);
      const username = this.postNotification(this.state.currentUser.name, event.target.value);
      this.socket.send(JSON.stringify(username));
      this.setState({ currentUser: { name: event.target.value } });
    }
  }

  postMessage(username, content) {
    let post = {
      username: username,
      content: content
    }
    return {
      type: "postMessage",
      data: post
    }
  }

  postNotification(oldUser, newUser) {
    let usernameUpdate = {
      content: `${oldUser} has changed their name to ${newUser}`
    }
    return {
      type: "postNotification",
      data: usernameUpdate
    }
  }


  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.onopen = (event) => {
      console.log('Connected to server');
    }
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "incomingMessage":
          this.setState({ messages: [...this.state.messages, JSON.parse(event.data)] });
          break;
        case "incomingNotification":
          this.setState({ messages: [...this.state.messages, JSON.parse(event.data)] })
          break;
        case "userCount":
          this.setState({numOfUser: data.length})
          break;
        default:
          throw new Error("Unknown event type " + data.type);
      }
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <span className="counter">{this.state.numOfUser} users online</span>

        </nav>
        <MessageList messages={this.state.messages} />
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
