import React, { Component } from 'react';

class ChatBar extends Component {
    render() {
        return (
            <footer className="chatbar">
                <input className="chatbar-username" defaultValue={this.props.currentUser.name} onKeyDown={this.props.onChangeUser} placeholder="Your Name (Optional)" />
                <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown={this.props.onChange}/>
            </footer>

        )
    }
}
export default ChatBar;