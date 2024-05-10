import { friends } from "../models/friends.model.js";

function getFriends(req, res) {
  res.json(friends);
}
function getFriendById(req, res) {
  const { id } = req.params;
  if (!friends[+id])
    res.status(404).json({
      status: "failed",
      message: "Id doesn't exist",
    });
  res.status(200).json(friends[+id]);
}
function addFriend(req, res) {
  const { name } = req.body;
  if (!name)
    //con return evitiamo di restituire più richieste
    return res.status(400).json({
      status: "failed",
      message: "Please enter a name of friend",
    });
  const newFriend = {
    id: friends.length,
    name,
  };
  friends.push(newFriend);
  res.status(200).json({
    status: "success",
    data: friends,
  });
}
export { getFriends, getFriendById, addFriend };
