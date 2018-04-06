import React from "react";
import "./TrackList.css";
import Track from "../Track/Track";

class TrackList extends React.Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks.map(track => {
          return (
            <Track
              track={track}
              onAdd={this.props.onAdd}
              onRemove={this.props.onRemove}
              key={"track_" + track.id}
              onClick={this.props.onClick}
              currentTrack={this.props.currentTrack}
              fromPlaylist={this.props.fromPlaylist}
            />
          );
        })}
      </div>
    );
  }
}

export default TrackList;
