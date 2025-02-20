// Add dropdown functionality to footer sections
document.addEventListener('DOMContentLoaded', function() {
    const footerCols = document.querySelectorAll('.footer-col');
    
    footerCols.forEach(col => {
        const heading = col.querySelector('h4');
        heading.addEventListener('click', function() {
            // Close all other dropdowns
            footerCols.forEach(otherCol => {
                if (otherCol !== col) {
                    otherCol.classList.remove('active');
                }
            });
            // Toggle current dropdown
            col.classList.toggle('active');
        });
    });
});



// Initialize Firebase if not already initialized
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {

    const firebaseConfig = {
        apiKey: "AIzaSyDJrjwbe1PWahx6z0bUgV-M-K-pA5Ey-r4",
        authDomain: "zentronn-f5696.firebaseapp.com",
        projectId: "zentronn-f5696",
        storageBucket: "zentronn-f5696.firebasestorage.app",
        messagingSenderId: "218333581910",
        appId: "1:218333581910:web:070212f563d95bafc961f7",
        measurementId: "G-GC8V4LBKTY"
    };
    firebase.initializeApp(firebaseConfig);
}

// Get Firebase services
const auth = firebase.auth();
const db = firebase.database();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();


// Handle Google Sign-In
function signInWithGoogle() {
    auth.signInWithPopup(googleProvider)

        .then((result) => {
            const user = result.user;
            console.log('Google sign-in successful:', user);
            alert('Google sign-in successful: Logging you in..');
            // Wait 3 seconds then redirect to index.html
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        })

        .catch((error) => {
            console.error('Google sign-in error:', error);
            alert('Google sign-in failed: ' + error.message);
        });
}

// Handle GitHub Sign-In
function signInWithGitHub() {
    auth.signInWithPopup(githubProvider)
        .then((result) => {
            const user = result.user;
            console.log('GitHub sign-in successful:', user);
            // Wait 3 seconds then redirect to index.html
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        })
        .catch((error) => {
            console.error('GitHub sign-in error:', error);
            alert('GitHub sign-in failed: ' + error.message);
        });
}

// Add sign-in click handlers
document.addEventListener('DOMContentLoaded', function() {
    // Handle Google icons
    const googleIcons = document.querySelectorAll('.bxl-google');
    googleIcons.forEach(icon => {
        icon.closest('a').addEventListener('click', function(e) {
            e.preventDefault();
            signInWithGoogle();
        });
    });

    // Handle GitHub icons
    const githubIcons = document.querySelectorAll('.bxl-github');
    githubIcons.forEach(icon => {
        icon.closest('a').addEventListener('click', function(e) {
            e.preventDefault();
            signInWithGitHub();
        });
    });
});




// DOM elements
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signInButton = document.getElementById('signInButton');

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle registration form submission
document.querySelector('.sign-up form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    // Validate inputs
    if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }

    console.log('Attempting to register user:', {email, name});
    
    // Create user with Firebase Auth
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('User created successfully:', userCredential.user);
        alert('User created successfully:', userCredential.user);

        
        // Store user data in Realtime Database
        const user = userCredential.user;
        db.ref('users/' + user.uid).set({
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        })
        .then(() => {
            console.log('User data saved to database');
            alert('Registration successful! Please sign in.');
            container.classList.remove("active");
        })
        .catch((error) => {
            console.error('Error saving user data:', error);
            alert('Registration successful, but failed to save additional data.');
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration failed:', errorCode, errorMessage);
        alert(`Registration failed: ${errorMessage}`);
      });
});


// Password validation
const passwordInput = document.getElementById('passwordInput');
const passwordToggle = document.querySelector('.password-toggle');

if (passwordToggle) {
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length === 0) {
            passwordToggle.style.color = '#b4b4b4'; // Default color
        } else if (passwordInput.value.length < 6) {
            passwordToggle.style.color = '#de0611'; // Red for invalid
        } else {
            passwordToggle.style.color = '#4bb543'; // Green for valid
        }
    });

    passwordToggle.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.classList.replace('uil-eye-slash', 'uil-eye');
        } else {
            passwordInput.type = 'password';
            passwordToggle.classList.replace('uil-eye', 'uil-eye-slash');
        }
    });
}

// Handle authentication state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User signed in:', user);
        // Update UI for signed-in user
    } else {
        console.log('User signed out');
        // Update UI for signed-out user
    }
});

// Other event listeners
registerBtn.addEventListener('click', () => {

    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
