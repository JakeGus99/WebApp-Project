function loadData() {
    fetch("/teams")
        .then(res => res.json())
        .then(data => displayData(data))
        .catch(err => console.error("Fetch error:", err));
}

function displayData(data) {
    const div = document.getElementById("myData");
    div.innerHTML = "";

    let table = `<table border="1">
        <tr>
            <th>ID</th>
            <th>Team Name</th>
            <th>Abbrev</th>
            <th>Home City</th>
        </tr>`;

    data.forEach(row => {
        table += `
            <tr>
                <td>${row.teamid}</td>
                <td>${row.teamname}</td>
                <td>${row.abbrev}</td>
                <td>${row.homecity}</td>
            </tr>`;
    });

    table += "</table>";
    div.innerHTML = table;
}

function addData() {
    const form = document.getElementById("data_form");
    const formData = new FormData(form);
    const body = Object.fromEntries(formData);

    fetch("/teams", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    })
    .then(res => {
        if (!res.ok) throw new Error("Error creating team");
        return res.text();
    })
    .then(() => loadData())
    .catch(err => alert(err.message));

    return false; // prevent reload
}

// Load table on page load
window.onload = loadData;
