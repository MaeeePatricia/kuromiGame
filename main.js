function displaySummary() {
    var summaryTableBody = document.getElementById("summaryBody");
    summaryTableBody.innerHTML = "";

    var productDropdowns = document.querySelectorAll('[id^="product"]');
    var quantityDropdowns = document.querySelectorAll('[id^="quantity"]');
    var amountInputs = document.querySelectorAll('[id^="amount"]');

    var totalAmount = 0;

    for (var i = 0; i < productDropdowns.length; i++) {
        var productSelect = productDropdowns[i];
        var quantitySelect = quantityDropdowns[i];
        var amountInput = amountInputs[i];
        var selectedProduct = productSelect.options[productSelect.selectedIndex].text;
        var selectedQuantity = parseInt(quantitySelect.value);
        var amount = parseFloat(amountInput.value);

        if (selectedQuantity > 0) {
            var newRow = summaryTableBody.insertRow();
            newRow.insertCell().textContent = selectedProduct;
            newRow.insertCell().textContent = selectedQuantity;
            newRow.insertCell().textContent = "$" + amount.toFixed(2); // Add dollar sign to amount
            totalAmount += amount; // Add to total amount
        }

        // Disable the dropdowns
        productSelect.disabled = true;
        quantitySelect.disabled = true;
    }

    // Add row for total amount
    var totalRow = summaryTableBody.insertRow();
    totalRow.insertCell().textContent = "Total";
    totalRow.insertCell().textContent = ""; // Empty cell for quantity
    totalRow.insertCell().textContent = "$" + totalAmount.toFixed(2); // Add dollar sign to total amount

    document.getElementById("summaryContainer").style.display = "block";
    document.getElementById("doneButton").disabled = true;
}

function generateOrderRow(id) {
    var row = "<tr>";
    row += "<th>Dish " + id + "</th>";
    row += "<th>No.</th>";
    row += "<th>Remarks</th>";
    row += "<th>Amount</th>";
    row += "</tr>";
    row += "<tr>";
    row += "<td><select id='product" + id + "' onchange='showImage(" + id + ")'>" +
        "<option value='0'></option>" +
        "<option value='8'>Linguine</option>" +
        "<option value='7'>Braising Pork</option>" +
        "<option value='6'>Stir-Fried Flat Nooedles</option>" +
        "<option value='5'>Ribeye Steaks</option>" +
        "</select></td>";
    row += "<td><select id='quantity" + id + "' onchange='showImage(" + id + ")'>" +
        "<option value='0'>0</option>" +
        "<option value='1'>1</option>" +
        "<option value='2'>2</option>" +
        "<option value='3'>3</option>" +
        "</select></td>";
    row += "<td><span id='remarks" + id + "'></span></td>";
    row += "<td><input type='text' class='amount' id='amount" + id + "' readonly value='0' size='10'></td>";
    row += "<td><img id='image" + id + "' src='' alt='' style='display:none;'></td>";
    row += "</tr>";
    return row;
}

function showImage(id) {
    var productSelect = document.getElementById("product" + id);
    var quantitySelect = document.getElementById("quantity" + id);
    var image = document.getElementById("image" + id);
    var selectedProduct = productSelect.options[productSelect.selectedIndex].text;
    var selectedQuantity = quantitySelect.options[quantitySelect.selectedIndex].text;

    if (selectedProduct === "Linguine") {
        image.src = "images/item1.png";
    } else if (selectedProduct === "Braising Pork") {
        image.src = "images/item2.png";
    } else if (selectedProduct === "Stir-Fried Flat Nooedles") {
        image.src = "images/item3.png";
    } else if (selectedProduct === "Ribeye Steaks") {
        image.src = "images/item4.png";
    }

    // Display the image if a product is selected
    if (selectedProduct !== "" && selectedQuantity !== "0") {
        image.style.display = "inline-block";
    } else {
        image.style.display = "none";
    }
}


function compute(product, quantity, remarks, amount) {
    var nPrice = parseFloat(product.value);
    var nQty = parseInt(quantity.value);
    var cProduct = product.options[product.selectedIndex].text;
    remarks.innerHTML = nQty + " X " + cProduct + " $" + nPrice;
    amount.value = (nPrice * nQty) + "";
}

function compTotal() {
    var totalAmount = 0;
    var amounts = document.querySelectorAll(".amount");
    amounts.forEach(function (amount) {
        totalAmount += parseFloat(amount.value);
    });
    return totalAmount;
}

function compChange() {
    var totalAmount = compTotal();
    var amountPaid = parseFloat(document.querySelector("#amountPaid").value);
    var change = amountPaid - totalAmount;
    if (change >= 0) {
        document.querySelector("#change").value = "$ " + change.toFixed(2);
    } else {
        alert("Invalid amount paid!");
    }
}

function updateTotal() {
    var totalAmount = compTotal();
    document.querySelector("#totalAmount").value = "$ " + totalAmount.toFixed(2);
}

function disableItem(selectedOption, comboBoxes) {
    for (var i = 0; i < comboBoxes.length; i++) {
        var comboBox = comboBoxes[i];
        for (var j = 0; j < comboBox.options.length; j++) {
            var option = comboBox.options[j];
            if (option.value !== "0" && option.value === selectedOption.value && option !== selectedOption) {
                option.disabled = selectedOption.value !== "0";
            }
        }
    }
}

function attachProductDropdownEvent(productDropdown, quantityDropdown, remarksSpan, amountInput, otherProductDropdowns) {
    productDropdown.addEventListener("change", function () {
        showImage(productDropdown.id.slice(-1)); 
        disableItem(productDropdown, otherProductDropdowns); 
        compute(productDropdown, quantityDropdown, remarksSpan, amountInput); 
        updateTotal();
    });
}

function attachQuantityDropdownEvent(quantityDropdown, productDropdown, remarksSpan, amountInput) {
    quantityDropdown.addEventListener("change", function () {
        compute(productDropdown, quantityDropdown, remarksSpan, amountInput); 
        updateTotal(); 
    });
}

window.onload = function () {
    var orderTable = document.getElementById("orderTable");
    orderTable.innerHTML += generateOrderRow(1);
    orderTable.innerHTML += generateOrderRow(2);
    orderTable.innerHTML += generateOrderRow(3);

    var productDropdowns = document.querySelectorAll('[id^="product"]');
    var quantityDropdowns = document.querySelectorAll('[id^="quantity"]');
    var remarksSpans = document.querySelectorAll('[id^="remarks"]');
    var amountInputs = document.querySelectorAll('[id^="amount"]');

    // Attach event listeners to product and quantity dropdowns
    for (var i = 0; i < productDropdowns.length; i++) {
        var otherProductDropdowns = Array.from(productDropdowns).filter((dropdown) => dropdown !== productDropdowns[i]);
        attachProductDropdownEvent(productDropdowns[i], quantityDropdowns[i], remarksSpans[i], amountInputs[i], otherProductDropdowns);
        attachQuantityDropdownEvent(quantityDropdowns[i], productDropdowns[i], remarksSpans[i], amountInputs[i]);
    }

    // Attach event listener to the amount paid input field
    document.getElementById("amountPaid").addEventListener("input", compChange);

    document.getElementById("doneButton").addEventListener("click", displaySummary);
};

