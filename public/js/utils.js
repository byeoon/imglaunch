
// Basic authentication checker
async function isLoggedIn() {
    try {
      const response = await fetch('https://myshare.haydar.dev/api/email', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem("token")
        }
      });
      if (!response.ok) {
        throw new Error('You are not logged in!');
        document.getElementById("dd-login").style.display = "block";
        document.getElementById("dd-profile").style.display = "none";
        document.getElementById("dd-logout").style.display = "none";
        document.getElementById("dd-dashboard").style.display = "none";
      }
    document.getElementById("dd-login").style.display = "none";
    } catch (error) {
      document.getElementById("dd-login").style.display = "block";
      document.getElementById("dd-profile").style.display = "none";
      document.getElementById("dd-logout").style.display = "none";
      document.getElementById("dd-dashboard").style.display = "none";
    }
  }


// Logs out the user
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "https://myshare.haydar.dev";
}