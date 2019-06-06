import React, { Component } from 'react';
import Message from './Message.jsx';

class MessageList extends Component {

    render() {
        const eachMessage = this.props.messages.map((message) => {
            console.log(message);
            if (message.type === "incomingMessage") {
                return <Message
                    username={message.data.username}
                    content={message.data.content}
                    key={message.data.id} />
            } else {
                return (
                    <div className="message system">{message.data.content}</div>
                )
            }
        })


        return (
            <main className="messages">
                {eachMessage}

            </main>

        )
    }
}
export default MessageList;