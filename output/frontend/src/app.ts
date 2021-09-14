import axios from "axios";

const main = () => {
  const messageElement = document.getElementById("message");

  const url = ""; // Please set backend url. (perhaps api-gateway's url)

  axios
    .get<{ message: string }>(`${url}/hello`)
    .then(async (result) => {
      const { message } = result.data;
      messageElement.innerText = message;
    })
    .catch((error) => {
      console.log(error);
    });
};

main();
