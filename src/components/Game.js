import React from 'react';
import './Game.scss'
import { withRouter } from 'react-router-dom';

let n_col = 30;
let n_row = 20;
class Game extends React.Component {
    constructor(props) {
        super(props)
        this.connection = new WebSocket(this.props.domain + '/game/' + this.props.match.params.code)
        this.connection.onmessage = evt => {
            console.log(evt)
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
        for (var i = 0; i < n_row; i++) {
            var row_objects = [];
            for (var j = 0; j < n_col; j++) {
                row_objects.push(<div col={j} row={i} key={j} className="row_element" onClick={(e) => this.handleClick(e, this.key)} onContextMenu={(e) => this.handleClick(e)}></div>);
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