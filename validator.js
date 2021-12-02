"use strict";

let x, y, r;

// Обновляет значение x и r в соответсвии с нажатой кнопкой, добавляет ей эффекты (подсветка и увеличение), убирая их для остальных кнопок группы.
window.onload = function () {

    let buttonsX = document.querySelectorAll("input[name=X-button]");
    buttonsX.forEach(clickX);
    let buttonsR = document.querySelectorAll("input[name=R-button]");
    buttonsR.forEach(clickR);

    function clickX(element) {
        element.onclick = function () {
            x = this.value;
            buttonsX.forEach(function (element) {
                element.style.boxShadow = "";
                element.style.transform = "";
                element.style.background = "ghostwhite";
            });
            this.style.boxShadow = "0 0 0.2px 0.2px #c41c52";
            this.style.transform = "scale(1.05)";
            this.style.background = "#c41c52";
        }
    }

    function clickR(element) {
        element.onclick = function () {
            r = this.value;
            buttonsR.forEach(function (element) {
                element.style.boxShadow = "";
                element.style.transform = "";
                element.style.background = "ghostwhite";
            });
            this.style.boxShadow = "0 0 0.2px 0.2px #c41c52";
            this.style.transform = "scale(1.05)";
            this.style.background = "#c41c52";
        }
    }

};

document.getElementById("checkButton").onclick = function () {
    if (validateX() && validateY() && validateR()) {
        let request = ("?x=" + x + "&y=" + y + "&r=" + r);
        fetch("answer.php" + request).then(response => response.text()).then(function (serverAnswer) {
            setPointer();
            let res = document.querySelector("#outputTable");
            res.innerHTML += serverAnswer;
            let notification = document.querySelector(".notification");
            notification.classList.replace("outputStub", "outputStubInvissible");
            notification.classList.replace("errorStub", "outputStubInvissible");
        }).catch(err => createNotification("Ошибка HTTP. Повторите попытку позже." + err));
    }
};

function setPointer() {
    let pointer = document.getElementById("point");
    pointer.style.visibility = "visible";
    pointer.setAttribute("cx", x / r * 100 + (300 / 2));
    pointer.setAttribute("cy", (300 / 2) - y / r * 100);
}

function createNotification(message) {
    let outputContainer = document.getElementById("outputContainer");
    if (outputContainer.contains(document.querySelector(".notification"))) {
        let stub = document.querySelector(".notification");
        // stub.textContent = message;
        stub.classList.replace("errorStub", "outputStub");
        stub.classList.replace("outputStubInvissible", "outputStub");
        let outputErrorContainer = document.getElementById("outputErrorContainer");
        outputErrorContainer.textContent = "";
    } else {
        let notificationTableRow = document.createElement("h4");
        notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
        outputContainer.prepend(notificationTableRow);
        let span = document.querySelector(".notification");
        span.textContent = message;
    }
}

function createNotificationError(message) {
    let outputErrorContainer = document.getElementById("outputErrorContainer");
    if (outputErrorContainer.contains(document.querySelector(".notification"))) {
        let stub = document.querySelector(".notification");
        stub.textContent = message;
        stub.classList.replace("outputStub", "errorStub");
        stub.classList.replace("outputStubInvissible", "errorStub");
    } else {
        let notificationTableRow = document.createElement("h4");
        notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
        outputErrorContainer.prepend(notificationTableRow);
        let span = document.querySelector(".notification");
        span.textContent = message;
    }
}

function validateX() {
    if (isNumeric(x)) return true;
    else {
        createNotificationError("x не выбран");
        return false;
    }
}

function validateY() {
    y = document.querySelector("input[name=Y-input]").value.replace(",", ".");
    if (y.trim() === "") {
        createNotificationError("Заполните поле ввода y");
        return false;
    } else if (!isNumeric(y)) {
        createNotificationError("y не число");
        return false;
    } else if (!((y > -5) && (y < 5))) {
        createNotificationError("y не входит в одз");
        return false;
    } else {
        return true;
    }
}

function validateR() {
    if (isNumeric(r)) return true;
    else {
        createNotificationError("r не выбран");
        return false;
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}