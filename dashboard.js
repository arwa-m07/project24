// dashboard.js

document.addEventListener("DOMContentLoaded", function () {
    // Check for form submission success message in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('success');

    if (successMessage === 'true') {
        alert('Form submitted successfully!');
    }

    // Add any additional logic for the dashboard page here
});
