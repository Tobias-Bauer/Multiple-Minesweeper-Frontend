import React from 'react';
import './Home.scss'

export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = { id: null, messages: [], n_cols: "", n_rows: "", code: "", n_mines: "", solvable: false }
    }
    create_new_game() {
        const connection = new WebSocket(this.props.domain+'/create')
        connection.onopen = () => {
            connection.send(JSON.stringify({ n_cols: this.state.n_cols, n_rows: this.state.n_rows, n_mines: this.state.n_mines, code: this.state.code, solvable: this.state.solvable }))
            // listen to onmessage event
            connection.onmessage = evt => {
                console.log(evt)
                let data = JSON.parse(evt.data)
                console.log(data)
                if (data.error) {
                    alert(evt.error)
                }
                if (data.succes === "Game succesfully created") {
                    connection.close()
                    window.open('/game/' + this.state.code, '_self', 'noopener,noreferrer')
                }
            };
            // window.open('/game/'+this.state.id, '_self', 'noopener,noreferrer')
        }
    }
    join_game() {
        const connection = new WebSocket(this.props.domain+'/join')
        connection.onopen = () => {
            connection.send(JSON.stringify({code: this.state.code}))
            connection.onmessage = evt => {
                console.log(evt)
                let data = JSON.parse(evt.data)
                console.log(data)
                if (data.error) {
                    alert(evt.error)
                }
                if (data.exists) {
                    connection.close()
                    window.open('/game/' + this.state.code, '_self', 'noopener,noreferrer')
                }
            };
        }
    }
    render() {
        return (
            <div>
                <h1>Welcome to our multiple player minesweeper games!</h1>
                <p>Create a new game</p>
                <input className="size" value={this.state.n_cols} onChange={(e) => this.setState({ n_cols: e.target.value })} type="number" placeholder="Size between 3 and 60" />
                <input className="size" value={this.state.n_rows} onChange={(e) => this.setState({ n_rows: e.target.value })} type="number" placeholder="Size between 3 and 60" />
                <input className="size" value={this.state.n_mines} onChange={(e) => this.setState({ n_mines: e.target.value })} type="number" placeholder="Mines between 1 and 2600" />
                <input type="checkbox" id="check3" value={this.state.solvable} onChange={(e) => this.setState({ solvable: e.target.value })} name="fsa" />
                <label htmlFor="check3">solvable</label>
                <input value={this.state.code} onChange={(e) => this.setState({ code: e.target.value })} type="number" placeholder="Code to join" />
                <button onClick={() => this.create_new_game()}>Create</button>
                <p>Join an existing game</p>
                <input value={this.state.code} onChange={(e) => this.setState({ code: e.target.value })} type="number" placeholder="Code to join" />
                <button onClick={() => this.join_game()}>Join</button>
                {this.state.messages}
            </div>
        )
    }
}