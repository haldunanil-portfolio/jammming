import React from "react";
import ReactDrawer from "react-drawer";
import { Container, Row, Col } from "react-grid-system";
import Slider from "react-rangeslider";
import { IoPlus } from "react-icons/lib/io";
import { MdSkipNext, MdSkipPrevious, MdClose } from "react-icons/lib/md";
import { FaPlay, FaPause } from "react-icons/lib/fa";
import SpotifyWebAPI from "../../util/Spotify";

import "react-drawer/lib/react-drawer.css";
import "./Player.css";

// eslint-disable-next-line
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

class Player extends React.Component {
  render() {
    // make sure to grab an access token within this component
    SpotifyWebAPI.getAccessToken();

    return (
      <ReactDrawer
        open={this.props.options.open}
        position={this.props.options.position}
        onClose={this.props.onPlayerClose}
        noOverlay={this.props.options.noOverlay}
      >
        <Container style={{ marginTop: 10 }} fluid>
          <Row>
            <Col lg={3}>
              <img
                src={this.props.currentTrack.albumArt}
                alt={this.props.currentTrack.album}
                width={120}
                height={120}
                style={{ position: "absolute", right: 0, margin: 10 }}
              />
            </Col>
            <Col lg={6}>
              <p style={{ marginTop: 10, marginBottom: 10 }}>
                {this.props.currentTrack.name}
              </p>
              <Row style={{ fontSize: "15px", fontWeight: 100 }}>
                <Col lg={5}>
                  <p
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                      color: "rgba(256, 256, 256, 0.8)"
                    }}
                  >
                    {this.props.currentTrack.artist}
                  </p>
                  <p
                    style={{
                      fontStyle: "italic",
                      marginTop: 10,
                      marginBottom: 10,
                      color: "rgba(256, 256, 256, 0.8)"
                    }}
                  >
                    {this.props.currentTrack.album}
                  </p>
                </Col>
                <Col lg={7}>
                  <Row style={{ textAlign: "center" }}>
                    <Col>
                      <IoPlus size={30} className={"icon"} onClick={this.props.handlers.addTrack} />
                    </Col>
                    <Col>
                      <MdSkipPrevious size={30} className={"icon"} onClick={this.props.handlers.previousTrack} />
                    </Col>
                    <Col>
                      {this.props.isPlaying ? (
                        <FaPause size={30} className={"icon"} onClick={this.props.handlers.pause} />
                      ) : (
                        <FaPlay size={30} className={"icon"} onClick={this.props.handlers.play} />
                      )}
                    </Col>
                    <Col>
                      <MdSkipNext size={30} className={"icon"} onClick={this.props.handlers.nextTrack} />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={2}>
                      <p>
                        {Math.floor(
                          this.props.currentTrack.progressMs / 60000
                        ) +
                          ":" +
                          Math.ceil(
                            (this.props.currentTrack.progressMs -
                              Math.floor(
                                this.props.currentTrack.progressMs / 60000
                              ) *
                                60000) /
                              1000
                          ).pad()}
                      </p>
                    </Col>
                    <Col lg={8}>
                      <Slider
                        min={0}
                        max={this.props.currentTrack.length / 1000}
                        step={1}
                        value={this.props.currentTrack.progressMs / 1000}
                        onChangeStart={this.props.handlers.pause}
                        onChange={this.props.handlers.seek}
                        onChangeComplete={this.props.handlers.handleSeekCall}
                      />
                    </Col>
                    <Col lg={2}>
                      <p style={{ textAlign: "right" }}>
                        {Math.floor(this.props.currentTrack.length / 60000) +
                          ":" +
                          Math.ceil(
                            (this.props.currentTrack.length -
                              Math.floor(
                                this.props.currentTrack.length / 60000
                              ) *
                                60000) /
                              1000
                          ).pad()}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col lg={3}>
              <a
                style={{ position: "absolute", right: 0, marginRight: 10 }}
                onClick={this.props.close}
              >
                <MdClose size={36} className={"icon"} />
              </a>
            </Col>
          </Row>
        </Container>
      </ReactDrawer>
    );
  }
}

export default Player;
