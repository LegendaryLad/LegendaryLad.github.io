var r = confirm("Confirm that you have free will.");
if (r == true) {
    x = "Good.";
} else {
    x = "Better.";
}
document.getElementById("demo").innerHTML = x;