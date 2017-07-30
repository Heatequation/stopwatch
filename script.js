const React = require('react');
const ReactDOM = require('react-dom');

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonRLisOn: false,
      buttonSSisOn: false,
      time: 0,
      start_time: null,
      laps: [],
      last_lap_time: 0
    };
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleLap = this.handleLap.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleStart() {

    const start_time = +new Date();

    this.setState((prev_state, props) => {
      let new_laps2 = prev_state.time === 0 ? [0] : prev_state.laps;

      return {
      buttonRLisOn: true,
      buttonSSisOn: true,
      start_time: start_time,
      laps: new_laps2
    }});
    this.timerID = setInterval(() => {
      let curr_time = +new Date();
      this.setState((prev_state, props) => {

        let new_laps=prev_state.laps.slice();
        const new_time = prev_state.time + curr_time - prev_state.start_time;
        new_laps[0] = new_time - prev_state.last_lap_time;
        return {
        time: new_time,
        start_time: curr_time,
        laps: new_laps
      }});
    }, 10);
  }

  handleStop() {
    clearInterval(this.timerID);

    this.setState({
      buttonRLisOn: false,
      buttonSSisOn: false
    });
  }

  handleLap() {
    let new_laps = this.state.laps.slice();
    new_laps.unshift(this.state.time);
    this.setState((prev_state, props) => ({
      laps: new_laps,
      last_lap_time: prev_state.time
    }));
  }

  handleReset() {
    this.setState({
      buttonRLisOn: false,
      buttonSSisOn: false,
      time: 0,
      start_time: null,
      laps: [],
      last_lap_time: 0
    });
  }

  msecs_to_string(msecs) {
    var dummy_zero_h = "";
    var dummy_zero_m = "";
    var dummy_zero_s = "";
    var dummy_zero_ms = "";

    /* show only first 2 digits of miliseconds */
    let s_msecs = Math.floor((msecs / 10) % 100);
    let secs = Math.floor(msecs / 1000);
    let s_secs = secs % 60;
    let mins = Math.floor(secs / 60);
    let s_mins = mins % 60;
    let hs = Math.floor(mins / 24);
    let s_hs = hs % 24;
    let ds = Math.floor(hs / 365);

    if (s_hs < 10) {
      dummy_zero_h = "0"
    }
    if (s_mins < 10) {
      dummy_zero_m = "0"
    }
    if (s_secs < 10) {
      dummy_zero_s = "0"
    }
    if (s_msecs < 10) {
      dummy_zero_ms = "0"
    }

    return /*dummy_zero_h + s_hs + ":" +*/ dummy_zero_m + s_mins + "'"
        + dummy_zero_s + s_secs + '"' + dummy_zero_ms + s_msecs;
  }

  render() {

    let startButtonStyle = {
      backgroundColor: "darkgreen",
      color: 'limegreen'
    };
    let stopButtonStyle = {
      backgroundColor: "maroon",
      color: 'red'
    };
    let lapButtonStyle = {
      backgroundColor: "gray",
      color: 'white'
    };
    let resetButtonStyle = {
      backgroundColor: "gray",
      color: 'white'
    };

    let divStyle = {
      padding: 10,
      color: "white",
      height: 300,
      width: 200,
      backgroundColor: "black",
      overflowY: "scroll"
    };

    let topLabelStyle = {
      fontSize: 14,
      fontFamily: "Arial",
      margin: 2,
      witdth: 200,
      textAlign: "center"
    };

    let timeLabelStyle = {
      fontSize: 30,
      fontFamily: "Arial",
      margin: 25-0,
      witdth: 200,
      textAlign: "center"
    };

    let buttonDivStyle = {
      margin: 0,
      textAlign: "center"
    }

    let dividerDivStyle = {
      width: 50,
      height: "auto",
      display: "inline-block",
    }

    let listStyle = {
      listStyle: "none",
      fontSize: 14,
      fontFamily: "Arial",
      display: "inline",
      textAlign: "center",
    }

    return (
      <div style={divStyle}>
        <hr />
        <div style={timeLabelStyle}>{this.msecs_to_string(this.state.time)}</div>
        <div style={buttonDivStyle}>
          <hr />
          <ToggleButton
            isOn={this.state.buttonRLisOn}
            isOffText={"Reset"}
            isOnText={"Lap"}
            isOffOnClick={this.handleReset}
            isOnOnClick={this.handleLap}
            offButtonStyle={resetButtonStyle}
            onButtonStyle={lapButtonStyle}
          />
          <div style={dividerDivStyle}/>
          <ToggleButton
            isOn={this.state.buttonSSisOn}
            isOffText={"Start"}
            isOnText={"Stop"}
            isOffOnClick={this.handleStart}
            isOnOnClick={this.handleStop}
            offButtonStyle={startButtonStyle}
            onButtonStyle={stopButtonStyle}
          />
          <hr />
        </div>
        <ul style={listStyle}>
            {this.state.laps.map((item, i, arr) =>
                 <LapItem
                   key = {i}
                   lapNumber = {arr.length - i}
                   isMax = { i > 0 && i === arr.indexOf(Math.max(...(arr.slice(1))))}
                   isMin = { i > 0 && i === arr.indexOf(Math.min(...(arr.slice(1))))}
                   timeString = {this.msecs_to_string(item)}
                 />
             )}
       </ul>
      </div>
    );
  }
}

class LapItem extends React.Component {



  render() {
    let listItemStyle
    let dividerDivStyle = {
      width: 65,
      height: "auto",
      display: "inline-block",
    }
    if (this.props.isMax && !this.props.isMin) {
      listItemStyle = {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        color: 'red'
      }
    }
    else if (!this.props.isMax && this.props.isMin) {
      listItemStyle = {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        color: 'limegreen'
      }
    } else {
      listItemStyle = {
        borderBottomColor: 'white',
        borderBottomWidth: 1
      }
    }

    return (
      <li style={listItemStyle} key={this.props.key}>
        <span>Lap {this.props.lapNumber} </span>
        <div style = {dividerDivStyle}/>
        <span>{this.props.timeString}</span>
        <hr />
      </li>
    );
  }
}


class ToggleButton extends React.Component {
  render() {

    let onButtonStyle = {
      outline: "none",
      fontSize: 14,
      fontFamily: "Arial",
      margin:5,
      borderWidth:0,
      height: 60,
      width: 60,
      borderRadius: 90
    };


    let offButtonStyle = {
      outline: "none",
      fontSize: 14,
      fontFamily: "Arial",
      margin:5,
      borderWidth:0,
      height: 60,
      width: 60,
      borderRadius: 90
    };

    Object.assign(offButtonStyle, this.props.offButtonStyle);
    Object.assign(onButtonStyle, this.props.onButtonStyle);

    const onButton = (
      <button style={onButtonStyle} onClick={this.props.isOnOnClick}>{this.props.isOnText}</button>
    );
    const offButton = (
      <button style={offButtonStyle} onClick={this.props.isOffOnClick}>{this.props.isOffText}</button>
    );

    return this.props.isOn ? onButton : offButton;
  }
}

ReactDOM.render(<Stopwatch />, document.getElementById("content"));
