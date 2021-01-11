import React from 'react';
import './Home.scss'

export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = { name: "", exists: null, id: null, messages: [], n_cols: "", n_rows: "", code: "", n_mines: "", solvable: false }
    }
    create_new_game() {
        fetch(this.props.domain + '/create', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ n_cols: this.state.n_cols, n_rows: this.state.n_rows, n_mines: this.state.n_mines, code: this.state.code, solvable: this.state.solvable }) // body data type must match "Content-Type" header
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    if (result.error) {
                        alert(result.error)
                    }
                    if (result.success === "Game successfully created") {
                        if (this.state.name !== "") {
                            window.open('/game/' + this.state.code+'/'+this.state.name, '_self', 'noopener,noreferrer')
                        }else{
                            alert("Please enter a name!")
                        }
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error)
                }
            )
    }
    join_game() {
        fetch(this.props.domain + '/join', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ code: this.state.code }) // body data type must match "Content-Type" header
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    if (result.error) {
                        alert(result.error)
                    }
                    if (result.exists) {
                        if (this.state.name !== "") {
                            window.open('/game/' + this.state.code+'/'+this.state.name, '_self', 'noopener,noreferrer')
                        }else{
                            alert("Please enter a name!")
                        }
                    } else {
                        alert("Game doesn't exist!")
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error)
                }
            )
    }
    componentWillMount() {
        this.timer = null;
    }
    handleChange(e) {
        clearTimeout(this.timer);
        this.setState({ code: e.target.value })
        this.timer = setTimeout(() => this.triggerAvailable(this.props.domain), 1000);
    }
    handleKeyDown(e) {
        if (e.keyCode === 13) {
            this.triggerChange();
        }
    }
    triggerAvailable(domain) {
        fetch(domain + '/join', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ code: this.state.code }) // body data type must match "Content-Type" header
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    if (result.error) {
                        alert(result.error)
                    }
                    this.setState({ exists: result.exists })
                },
                (error) => {
                    console.log(error)
                }
            )
    }
    render() {
        return (
            <div>
                <h1>Welcome to our multiplayer minesweeper game!</h1>
                <p>Create a new game</p>
                <input className="size" value={this.state.n_cols} onChange={(e) => this.setState({ n_cols: e.target.value })} type="number" placeholder="Size between 5 and 60" />
                <input className="size" value={this.state.n_rows} onChange={(e) => this.setState({ n_rows: e.target.value })} type="number" placeholder="Size between 5 and 60" />
                <input className="size" value={this.state.n_mines} onChange={(e) => this.setState({ n_mines: e.target.value })} type="number" placeholder="Mines about 1/6 to 1/4 of the field size" />
                <input value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} placeholder="Set your name" />
                <input type="checkbox" id="check3" value={this.state.solvable} onChange={(e) => this.setState({ solvable: e.target.value })} />
                <label htmlFor="check3">solvable</label>
                <input value={this.state.code} onChange={(e) => this.handleChange(e)} type="number" placeholder="Code to join" />
                <button onClick={() => this.create_new_game()}>Create</button>
                {this.state.exists !== null ? <p>{this.state.exists ? "🔴" : "🟢"}</p> : null}
                <p>Join an existing game</p>
                <input value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} placeholder="Set your name" />
                <input value={this.state.code} onChange={(e) => this.handleChange(e)} type="number" placeholder="Code to join" />
                {this.state.exists !== null ? <p>{this.state.exists ? "🟢" : "🔴"}</p> : null}
                <button onClick={() => this.join_game()}>Join</button>
                {this.state.messages}
            </div>
        )
    }
}