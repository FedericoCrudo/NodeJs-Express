import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//con le function declaration node puo fornire il nome in caso di errore
function getMessage(req, res) {
  // res.sendFile(path.join(__dirname, "..", "public", "img", "crwn-512x512.png"));
  // return res.send("<ul><li>Ciao</li></ul>");
  res.render("messages", {
    title: "Messages to my friend",
    friend: "Federico",
  });
}
function postMessage(req, res) {
  console.log("Updating messages....");
}
export { getMessage, postMessage };
