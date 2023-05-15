

type User = {
    id: Number,
    name: String,
    password: String,
    img: Number
}

let pictures = [
    "https://st2.depositphotos.com/5934840/44231/v/600/depositphotos_442314078-stock-illustration-young-afro-teenager-boy-kid.jpg",
    "https://st2.depositphotos.com/5934840/44231/v/600/depositphotos_442315370-stock-illustration-young-teenager-boy-kid-head.jpg",
    "https://st5.depositphotos.com/13803186/64986/v/600/depositphotos_649866560-stock-illustration-head-boy-smiling-friendly-greeting.jpg"
]

localStorage.setItem('img', JSON.stringify(pictures))

const loginBtn = document.getElementById('submit-login');
const registerBtn = document.getElementById('submit-register');
const usernameRegister = document.getElementById('username-register') as HTMLInputElement;
const passwordRegister = document.getElementById('password-register') as HTMLInputElement;

const usernameLogin = document.getElementById('username') as HTMLInputElement;
const passwordLogin = document.getElementById('password') as HTMLInputElement;


registerBtn?.addEventListener('click', () => {
    fetch('https://social-media-bebf1-default-rtdb.europe-west1.firebasedatabase.app/users.json')
        .then((res) => res.json())
        .then((data: User[]) => {
            const isUserExit = data ? Object.values(data).some((el) => el.name === usernameRegister.value) : null; // kontrollera om användare finns i databasen
            const img = document.querySelector('input[name="bild"]:checked')! as HTMLSelectElement;
            if (isUserExit) return alert('User already exists');
            if (!img) return alert('Please choose a picture');

            let dataObj = {
                name: usernameRegister.value,
                password: passwordRegister.value,
                img: img.value,
                id: Date.now()
            }

            fetch('https://social-media-bebf1-default-rtdb.europe-west1.firebasedatabase.app/users.json', {  // skicka en POST-förfrågan för att lägga till data i Firebase
                method: "POST",
                body: JSON.stringify(dataObj),
            });

            localStorage.setItem('myProfile', JSON.stringify(dataObj));
            setTimeout(() => {
                window.location.href = './modules/dashboard.html'
            }, 1000)
        });

})



loginBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('https://social-media-bebf1-default-rtdb.europe-west1.firebasedatabase.app/users.json') // skicka en GET-förfrågan för att hämta data från Firebase
        .then((res) => res.json())
        .then((data: User[]) => {
            
            // kontrollera om användarens lösenord och användarnamn matchar i databasen 
            const user = data ? Object.values((data)).filter((user) => user.name === usernameLogin.value && user.password === passwordLogin.value) : [];
            if (user.length > 0) { // om det matchar får användaren är loggad in
                localStorage.setItem('myProfile', JSON.stringify(user[0]));
                setTimeout(() => {
                    window.location.href = './modules/dashboard.html'
                }, 1000)
            } else {
                alert('User or password not correct!')
            }
        });
})