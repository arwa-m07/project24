// client.js
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const registerNumber = document.getElementById('registerNumber').value;
    const dob = document.getElementById('dob').value;

    fetch('/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registerNumber, dob }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            console.error(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
