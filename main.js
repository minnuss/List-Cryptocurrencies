// EventListener for search input field
let form = document.getElementById('form');
let inputNumEntries = document.getElementById("num-coins");
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let table = document.querySelector('table');
    table.innerHTML = `
    <tr>
            <th>#</th>
            <th>Pic</th>
            <th>Coin</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>1h</th>
            <th>24h</th>
            <th>24h Volume</th>
            <th>Market Cap</th>
        </tr>
    `;
    let numOfEntries = inputNumEntries.value;
    getData(numOfEntries);
}
)

// Getting the data from the server
async function getData(numOfEntries = 5) {
    let apiKey = `ffe55b48bfca4e9cbc93587fbfa0a7d718637fc7d4a0219f48238db66cffd642`;

    let url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=${numOfEntries}&tsym=USD&api_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    // console.log(data);
    populateTable(data)
}
getData()

// Creating table and populating it with data
function populateTable(data) {
    // console.log(data);
    let table = document.querySelector('table');
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);

    for (let i = 0; i < data.Data.length; i++) {
        let tr = document.createElement('tr');
        tbody.appendChild(tr);

        // create the number of pulled Data
        let td = document.createElement('td');
        td.textContent = i < 9 ? '0' + (i + 1) : i + 1;
        tr.appendChild(td);

        // create the image for every coin
        let coinImg = document.createElement('img');
        coinImg.src = `https://www.cryptocompare.com${data.Data[i].CoinInfo.ImageUrl}`;
        coinImg.style.maxWidth = '50px';
        tr.appendChild(coinImg);

        // create the name of the coin
        let tdName = document.createElement('td');
        tdName.textContent = data.Data[i].CoinInfo.FullName;
        tr.appendChild(tdName);

        // create the name cell
        td = document.createElement('td');
        td.textContent = data.Data[i].CoinInfo.Name;
        tr.appendChild(td);

        // create the price cell
        td = document.createElement('td');
        if (data.Data[i].RAW === undefined) {
            td.textContent = 'N/A';
        } else {
            td.textContent = '$' + (data.Data[i].RAW.USD.PRICE).toLocaleString();
        }
        tr.appendChild(td);

        // create the 1 hour change cell
        td = document.createElement('td');
        if (data.Data[i].RAW === undefined) {
            td.textContent = 'N/A';
        } else {
            td.textContent = data.Data[i].DISPLAY.USD.CHANGEPCTHOUR + '%';
        }
        tr.appendChild(td);

        // create the 24 hour change cell
        td = document.createElement('td');
        if (data.Data[i].RAW === undefined) {
            td.textContent = 'N/A';
        } else {
            td.textContent = data.Data[i].DISPLAY.USD.CHANGEPCT24HOUR + '%';
        }
        tr.appendChild(td);

        // create the 7 days change cell
        // td = document.createElement('td');
        // td.textContent = data.Data[i].DISPLAY.USD.CHANGEPCT7DAY;
        // tr.appendChild(td);

        // create the 24 volume
        td = document.createElement('td');
        if (data.Data[i].RAW === undefined) {
            td.textContent = 'N/A';
        } else {
            td.textContent = data.Data[i].DISPLAY.USD.VOLUME24HOURTO;
        }
        tr.appendChild(td);

        // create the market cap cell
        td = document.createElement('td');
        if (data.Data[i].RAW === undefined) {
            td.textContent = 'N/A';
        } else {
            td.textContent = '$ ' + (data.Data[i].RAW.USD.MKTCAP).toLocaleString();
        }
        tr.appendChild(td);
    }
}

// Function for sorting table by column 
function sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("table");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            // console.log(x)
            if (x == undefined) {
                x = rows[i].getElementsByTagName("TD")[n - 1];
            }
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (y == undefined) {
                y = rows[i + 1].getElementsByTagName("TD")[n - 1];
            }

            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// Event listener for the table header
let th = document.querySelectorAll('th');
for (let i = 0; i < th.length; i++) {
    th[i].addEventListener('click', function () {
        sortTable(i);
    })
}

// Search function
function searchTable(n) {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[n];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// EventListener for search input field
let inp = document.getElementById("myInput");
inp.addEventListener('keyup', function () {
    searchTable(1);
}
)







