import React from 'react';
import { unixTimeToString } from '../util';
import { getCommentData, likeFeedComment, unlikeFeedComment } from '../server';
import {Link} from 'react-router';

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    // The FeedItem's initial state is what the Feed passed to us.
    this.state = this.props.data;
  }

  handleLikeClick(clickEvent, sender) {
    clickEvent.preventDefault();

    if(clickEvent.button === 0){
      var cb = (updatedLikeCounter) =>
      {
        sender.setState({likeCounter: updatedLikeCounter});
        sender.refresh();
      };

      if (this.didUserLike()) {
        unlikeFeedComment(sender.state.feedItemId, sender.state.key, 4, cb);
      }
      else {
        likeFeedComment(sender.state.feedItemId, sender.state.key, 4, cb);
      }

  }
}

refresh() {
  getCommentData(this.props.owner, this.props.author._id, this.state.feedItemId, (feedData) => {
    this.setState({'comment': feedData});
  });
}

/**
* Returns 'true' if the user liked the item.
* Returns 'false' if the user has not liked the item.
*/
didUserLike() {
  var likeCounter = this.state.comment.likeCounter;
  var liked = false;
  // Look for a likeCounter entry with userId 4 -- which is the
  // current user.
  for (var i = 0; i < likeCounter.length; i++) {
    if (likeCounter[i]._id === 4) {
      liked = true;
      break;
    }
  }
  return liked;

}

  render() {

    var likeButtonText = "Like";

    if (this.didUserLike()) {
      likeButtonText = "Unlike" ;
    }

    return (
      <div>
      <div className="media-left media-top">
      PIC
      </div>
      <div className="media-body">
      <Link to={"/profile/" + this.props.author._id}>{this.props.author.fullName}</Link> {this.props.children}
      <br /><a href="#" onClick={(e) => this.handleLikeClick(e, this)}>{likeButtonText}</a> · <a href="#">Reply</a> ·
      {unixTimeToString(this.props.postDate)}
      </div>
      </div>
    )
  }
}
