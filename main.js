

const fetchData = (method, data) => {
    const fetchedData = fetch("http://localhost:3000/", {
        method: method,
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => res.json())
    return fetchedData;
}

const awaitData = async() => {
    try {
        const a = await fetchData('GET').then(console.log)
    } catch(err) {
        console.log(err);
    }
}


awaitData();
