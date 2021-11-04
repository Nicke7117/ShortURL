const button = document.getElementById("submitButton");

const shortenUrl = (e) => {
  e.preventDefault();
  const url = document.getElementById("url").value;
  axios
    .post("http://localhost:5000/url/shorten", null, {
      params: {
        url,
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
};

button.addEventListener("click", shortenUrl);
