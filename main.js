// EventListener for number of coins input field
let form = document.getElementById('form');
let inputNumEntries = document.getElementById("num-coins");
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let table = document.querySelector('table');
    table.innerHTML = `
    <thead>
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
        </thead>
        <tbody id="tbody">

        </tbody>
    `;
    let numOfEntries = inputNumEntries.value;
    getData(numOfEntries);

    callSort();
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
    let tbody = document.getElementById('tbody');
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
            td.textContent = (data.Data[i].RAW.USD.PRICE).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + '$';
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

        // create the 24 volume
        td = document.createElement('td');
        if (data.Data[i].RAW === undefined) {
            td.textContent = 'N/A';
        } else {
            td.textContent = data.Data[i].RAW.USD.VOLUME24HOURTO.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + '$';
        }
        tr.appendChild(td);

        // create the market cap cell
        td = document.createElement('td');
        if (data.Data[i].RAW === undefined) {
            td.textContent = 'N/A';
        } else {
            td.textContent = (data.Data[i].RAW.USD.MKTCAP).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + '$ ';
        }
        tr.appendChild(td);
    }
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
            // if (txtValue.toUpperCase().indexOf(filter) > -1) 
            if (txtValue.toUpperCase().includes(filter)) {
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


/**
 * Sorts a HTML table.
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
function callSort() {

    function sortTableByColumn(table, column, asc = true) {
        const dirModifier = asc ? 1 : -1;
        const tBody = table.tBodies[0];
        const rows = Array.from(tBody.querySelectorAll("tr"));
        // console.log(column);

        // Sort each row
        const sortedRows = rows.sort((a, b) => {

            let aColText = parseInt(a.querySelector(`td:nth-child(${column + 1})`).textContent.trim().replace(/[,.$%]/g, ""));
            let bColText = parseInt(b.querySelector(`td:nth-child(${column + 1})`).textContent.trim().replace(/[,.$%]/g, ""));
            // console.log(aColText, bColText);
            if (column === 2 || column === 3) {
                aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
                bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            }
            return (aColText > bColText ? 1 : -1) * dirModifier;

        });

        // Remove all existing TRs from the table
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild);
        }

        // Re-add the newly sorted rows
        tBody.append(...sortedRows);

        // Remember how the column is currently sorted
        table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
        table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
        table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
    }

    document.querySelectorAll(".table-sortable th").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
            const tableElement = headerCell.parentElement.parentElement.parentElement;
            const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
            const currentIsAscending = headerCell.classList.contains("th-sort-asc");

            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    });
}

callSort();