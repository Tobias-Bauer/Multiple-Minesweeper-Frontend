import React from 'react';
import './Game.scss'
import { withRouter } from 'react-router-dom';


class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = { n_cols: 0, n_rows: 0, mines: 0, flagged: 0, lost: false}
        this.field = [];
        this.connection = new WebSocket(this.props.wsdomain + '/game/' + this.props.match.params.code)
    }
    check_el(el) {
        var doc = document.getElementById(el.col + "-" + el.row)
        var child = doc.getElementsByTagName("p")[0]
        if (!el.opened) {
            doc.style.setProperty("background-color", "lightgray")
        } else if (el.mine) {
            child.innerHTML = "💣";
        } else if (el.n_mines === 0) {
            //Do nothing
        } else {
            child.innerHTML = el.n_mines;
        }
        if (el.opened) {
            doc.style.setProperty("background-color", "gray")
        }
        if (el.n_mines === 1) {
            child.style.setProperty("color", "blue")
        } else if (el.n_mines === 2) {
            child.style.setProperty("color", "green")
        } else if (el.n_mines === 3) {
            child.style.setProperty("color", "red")
        } else if (el.n_mines === 4) {
            child.style.setProperty("color", "darkblue")
        } else if (el.n_mines === 5) {
            child.style.setProperty("color", "darkred")
        } else if (el.n_mines === 6) {
            child.style.setProperty("color", "turquoise")
        } else if (el.n_mines === 8) {
            child.style.setProperty("color", "lightgray")
        }
        if (el.flagged) {
            child.innerHTML = "🔴";
        }
    }
    lost_animation() {
        var t = [];
        for(var [index, el] of this.field.entries()) {
            if(el.flagged){
                //Do nothing
            }else if (el.mine) {
                t[index] = setTimeout((function(el){
                    return function(){
                    console.log(el)
                    document.getElementById(el.col + "-" + el.row).getElementsByTagName("p")[0].innerHTML = "💣";
                }})(el),10*index)
            }
        }
        alert("You lost the game")
    }
    componentDidMount() {
        this.connection.onmessage = evt => {
            console.log(evt)
            let data = JSON.parse(evt.data)
            if(data.opened && data.opened.n_mines){
                this.setState({n_mines: data.opened.n_mines})
            }
            if (data.error) {
                alert(data.error)
                if (data.error === "The Game you requested does not exist") {
                    window.open('/home', '_self', 'noopener,noreferrer')
                }
            } else if (data.opened && data.opened.game_status === "lost") {
                this.lost_animation();
                this.setState({lost: true})
            } else if (data.opened && data.opened.status === "You Won!") {
                alert("You won the game!")
            } else if (data.field) {
                this.field = data.field;
                this.setState({ n_cols: data.n_cols, n_rows: data.n_rows })
                var mines = 0;
                var flagged = 0;
                for (var el of data.field) {
                    this.check_el(el)
                    if(el.mine){
                        mines++;
                    }
                    if(el.flagged){
                        flagged++;
                    }
                }
                this.setState({mines, flagged})
            } else if (data.n_cols && data.n_rows) {
                this.setState({ n_cols: data.n_cols, n_rows: data.n_rows })
            } else if (data.flagged) {
                if (data.flagged.remove) {
                    document.getElementById(data.flagged.col + "-" + data.flagged.row).getElementsByTagName("p")[0].innerHTML = "";
                    this.setState({flagged: this.state.flagged-1})
                } else if (data.flagged.success) {
                    document.getElementById(data.flagged.col + "-" + data.flagged.row).getElementsByTagName("p")[0].innerHTML = "🔴";
                    this.setState({flagged: this.state.flagged+1})
                } else {
                    alert(data.flagged.status)
                }
            } else {
                if (!data.mine) {
                    console.log(data.opened)
                    for (var element of data.opened) {
                        console.log(element)
                        this.check_el(element)
                    }
                }
            }
        }
    }
    handleClick(e) {
        if (e.nativeEvent.which === 1) {
            this.connection.send(JSON.stringify({ col: e.currentTarget.getAttribute('col'), row: e.currentTarget.getAttribute('row'), intent: "open" }))
        } else if (e.nativeEvent.which === 3) {
            this.connection.send(JSON.stringify({ col: e.currentTarget.getAttribute('col'), row: e.currentTarget.getAttribute('row'), intent: "flag" }))
            e.preventDefault()
        }
    }
    render() {
        var rows = [];
        for (var i = 0; i < this.state.n_rows; i++) {
            var row_objects = [];
            for (var j = 0; j < this.state.n_cols; j++) {
                row_objects.push(
                    <div col={j} row={i} key={j} id={j + "-" + i} className="row_element" onClick={(e) => this.handleClick(e, this.key)} onContextMenu={(e) => this.handleClick(e)}>
                        <p></p>
                    </div>);
            }
            rows.push(<div key={i} className="row">{row_objects}</div>);
        }
        return (
            <div className="gameField">
                {rows}
                <button onClick={() => this.connection.send(JSON.stringify({ intent: "restart" }))}>Restart</button>
                {this.state.lost?null:<p>{this.state.mines-this.state.flagged} 🔴</p>}
            </div>
        )
    }
}
export default withRouter(Game);