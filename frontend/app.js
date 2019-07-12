function btnCall(chamada) {
    document.getElementById('status').innerText = "PROCESSANDO...";
    axios.get('http://localhost:3000/' + chamada)
        .then(response => {
            document.getElementById('status').innerText = response.data
            return console.log(response.data)
        })
        .catch(error => console.log(error))
}
