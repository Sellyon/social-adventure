import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080/",
  responseType: "json"
});

/*export default axios.create({
  baseURL: "http://social-adventure.herokuapp.com/",
  responseType: "json"
});*/