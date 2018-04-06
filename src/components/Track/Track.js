import React from "react";
import "./Track.css";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.openPlayer = this.openPlayer.bind(this);
  }

  renderAction() {
    // display a - anchor tag if the isRemoval property is true
    // and a + anchor tag if the isRemoval property property is false.
    // Set the class name to Track-action

    if (this.props.onAdd) {
      return (
        <a className="Track-action" onClick={this.addTrack}>
          +
        </a>
      );
    } else {
      return (
        <a className="Track-action" onClick={this.removeTrack}>
          -
        </a>
      );
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  openPlayer() {
    // switch the currentTrack to be this track
    this.props.onClick.changeCurrentTrack(
      this.props.track.name,
      this.props.track.artist,
      this.props.track.album,
      this.props.track.albumArt,
      this.props.track.uri,
      this.props.track.length,
      this.props.fromPlaylist
    );

    // open the player drawer
    this.props.onClick.onClick();

    // start playback
    this.props.onClick.startPlayback(this.props.track.uri, this.props.fromPlaylist);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3 className="Track-name" onClick={this.openPlayer}>{this.props.track.name}</h3>
          <p>
            {this.props.track.artist} | {this.props.track.album}
          </p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
