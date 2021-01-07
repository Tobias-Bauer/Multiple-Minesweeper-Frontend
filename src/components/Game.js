import React from 'react';
import './Game.scss'
import { withRouter } from 'react-router-dom';


class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = { n_cols: 0, n_rows: 0 }
        this.connection = new WebSocket(this.props.domain + '/game/' + this.props.match.params.code)
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
        if(el.flagged){
            child.innerHTML = "🔴";
        }
    }
    componentDidMount() {
        this.connection.onmessage = evt => {
            console.log(evt)
            let data = JSON.parse(evt.data)
            if(data.error){
                alert(data.error)
            }else if (data.opened && data.opened.game_status === "lost") {
                alert("You lost the game")
            } else if (data.opened && data.opened.status === "You Won!") {
                alert("You won the game")
            } else if (data.field) {
                for (var el of data.field) {
                    this.setState({ n_cols: data.n_cols, n_rows: data.n_rows })
                    this.check_el(el)
                }
            } else if (data.n_cols && data.n_rows) {
                this.setState({ n_cols: data.n_cols, n_rows: data.n_rows })
            } else if (data.flagged) {
                if (data.flagged.remove) {
                    document.getElementById(data.flagged.col + "-" + data.flagged.row).getElementsByTagName("p")[0].innerHTML = "";
                } else if(data.flagged.success) {
                    document.getElementById(data.flagged.col + "-" + data.flagged.row).getElementsByTagName("p")[0].innerHTML = "🔴";
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
            this.connection.send(JSON.stringify({ col: e.target.getAttribute('col'), row: e.target.getAttribute('row'), intent: "open" }))
        } else if (e.nativeEvent.which === 3) {
            this.connection.send(JSON.stringify({ col: e.target.getAttribute('col'), row: e.target.getAttribute('row'), intent: "flag" }))
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
            </div>
        )
    }
}
export default withRouter(Game);