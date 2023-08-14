let userData = {
    balance: 0,
    outstanding: 0,
    salary: 0,
}

function showPopup() {
    if (userData.outstanding > 0) {
        alert("Please repay your outstanding amount before applying for a new loan.")

        return;
    }

    if (userData.balance == 0) {
        alert("You are broke. Too much risk");
        return;
    }

    let amount = prompt("Please enter loan amount: ");

    if (isNaN(amount) || amount == null || amount == "") {
        alert("Only numbers are accepted. Try again.")
        return;
    }

    if ((amount > userData.balance * 2) && userData.balance != 0) {
        alert("You cannot get loans twice your current funds.")

        return;
    }

    userData.outstanding = amount;
    userData.balance += parseFloat(amount);

    amountText = `${amount} kr.`

    document.getElementById("amount-due").innerHTML = amountText;
    document.getElementById("bank-balance").innerHTML = `${userData.balance} kr.`;

    document.getElementById("repay-btn").style.display = "inline-block";
}

function incrementSalary() {
    userData.salary += 100;

    document.getElementById("salary-balance").innerHTML = `${userData.salary} kr.`
}

function bankSalary() {
    let initialSalary = userData.salary;

    if (userData.outstanding != 0) {
        let debt = initialSalary * .1;
        let remainingSalary = initialSalary - debt;

        userData.outstanding -= debt;

        userData.balance += remainingSalary;
    } else {
        userData.balance += initialSalary;
    }

    userData.salary = 0;

    document.getElementById("salary-balance").innerHTML = `0 kr.`

    document.getElementById("amount-due").innerHTML = `${userData.outstanding} kr.`;

    document.getElementById("bank-balance").innerHTML = `${userData.balance} kr.`
}

function repayLoan() {
    if (userData.balance >= userData.outstanding) {
        userData.balance -= userData.outstanding;
        userData.outstanding = 0;

        document.getElementById("amount-due").innerHTML = `${userData.outstanding} kr.`;

        document.getElementById("bank-balance").innerHTML = `${userData.balance} kr.`;

        document.getElementById("repay-btn").style.display = "none";
    } else {
        let amount = prompt("Enter the amount of debt you will repay: ");

        if (isNaN(amount) || amount == "" || amount == null) {
            alert("Only numbers are accepted. Try again.")
            return;
        }

        userData.outstanding -= parseFloat(amount);
        userData.balance -= parseFloat(amount);

        document.getElementById("amount-due").innerHTML = `${userData.outstanding} kr.`;

        document.getElementById("bank-balance").innerHTML = `${userData.balance} kr.`;
    }
}



const root = "https://hickory-quilled-actress.glitch.me"
const endpoint = "https://hickory-quilled-actress.glitch.me/computers";

async function loadData() {
    const response = await fetch(endpoint);

    const items = await response.json();

    return items;
}

function populate(data) {
    let dropdown = document.getElementById("laptop-items");

    data.forEach((element, index) => {
        let option = document.createElement("option");

        option.appendChild(document.createTextNode(element["title"]));
        option.className = "dropdown-item";
        option.setAttribute("value", `${index + 1}`);

        dropdown.appendChild(option);
    });
}

function featureList(data) {
    let itemContainer = document.getElementById("item-container");
    let dropdown = document.querySelector("#laptop-items");

    let list = document.createElement("ul");

    list.setAttribute("class", "list-group");

    for (element in data[0]["specs"]) {
        let startListElement = document.createElement("li");

        startListElement.appendChild(document.createTextNode(data[0]["specs"][element]));

        startListElement.setAttribute("class", "list-group-item");

        list.appendChild(startListElement);
    }

    itemContainer.appendChild(list);

    document.addEventListener("change", () => {
        let object = data[dropdown.value - 1];

        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }

        for (element in object["specs"]) {
            let listElement = document.createElement("li");

            listElement.appendChild(document.createTextNode(object["specs"][element]));

            listElement.setAttribute("class", "list-group-item");

            list.appendChild(listElement);
        }

        itemContainer.appendChild(list);
    });
}

function updateProductTitle(data) {
    let productTitle = document.getElementById("product-title");
    let dropdown = document.querySelector("#laptop-items");

    productTitle.innerHTML = data[0]["title"];

    document.addEventListener("change", () => {
        let object = data[dropdown.value - 1];

        productTitle.innerHTML = object["title"];
    });
}

function updateProductDescription(data) {
    let productDescription = document.getElementById("product-description");
    let dropdown = document.querySelector("#laptop-items");

    productDescription.innerHTML = data[0]["description"];

    document.addEventListener("change", () => {
        let object = data[dropdown.value - 1];

        productDescription.innerHTML = object["description"];
    });
}

function updateProductImage(data) {
    let productImage = document.getElementById("product-img");
    let dropdown = document.querySelector("#laptop-items");

    productImage.setAttribute("src", `${root}/${data[0]["image"]}`);

    document.addEventListener("change", () => {
        let object = data[dropdown.value - 1];

        let imagePath = `${root}/${object["image"]}`;

        productImage.setAttribute("src", imagePath);
    });
}

function updateProductPrice(data) {
    let productPrice = document.getElementById("product-price");
    let dropdown = document.querySelector("#laptop-items");

    let price = `${data[0]["price"]} kr.`;

    productPrice.innerHTML = price;

    document.addEventListener("change", () => {
        let object = data[dropdown.value - 1];

        price = `${object["price"]} kr.`;

        productPrice.innerHTML = price;
    });
}

function purchase() {
    let productPrice = parseFloat(document.getElementById("product-price").textContent);
    let bankBalance = userData.balance;

    if (productPrice > bankBalance) {
        alert("You do not have sufficient funds on your account.");
        return;
    } else if (userData.outstanding > 0) {
        userData.balance -= productPrice;

        document.getElementById("bank-balance").innerHTML = `${userData.balance} kr.`;
        alert("Congratulations with your new computer. Now pay back your loans. Broke ass ...");
    } else {
        userData.balance -= productPrice;

        document.getElementById("bank-balance").innerHTML = `${userData.balance} kr.`;
        alert("Thank you for your purchase");
    }
}

(async () => {
    let dataJSON = await loadData();
    let selectedIndex = 1;

    populate(dataJSON);

    featureList(dataJSON);

    updateProductTitle(dataJSON);

    updateProductDescription(dataJSON);

    updateProductImage(dataJSON);

    updateProductPrice(dataJSON);
})();
