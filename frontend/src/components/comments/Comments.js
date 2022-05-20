import { useDispatch, useSelector } from "react-redux";
import { getComments } from "./../../redux/actions";
import { useEffect } from "react";
import Comment from "./../comment/Comment";


const Comments = id => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getComments(id));
  }, [dispatch, id]);

  const { comments, loading } = useSelector(state => state.comments);

  return (
    <div className="comments">
      {!loading && (
        comments?.map((comment, i) => (
          <Comment commentData={comment} key={i} />
        ))
      )}
    </div>
  );
};

export default Comments;
