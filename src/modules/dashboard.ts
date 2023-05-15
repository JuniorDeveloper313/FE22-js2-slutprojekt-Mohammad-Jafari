type User = {
    id: Number,
    name: String,
    password: String,
    img: Number,
}

type msgType = {
    msg: String,
    name: String,
    img: Number,
    createdAt: Date,
}

const submitBtn = document.querySelector('.create-post button');
const message = document.querySelector('.create-post input') as HTMLInputElement;
const user = localStorage.getItem('myProfile')
const parsedUser: User = user ? JSON.parse(user) : null;
const imgs = localStorage.getItem('img');
const parsedImgs = imgs ? JSON.parse(imgs) : null;
const postsContainer = document.querySelector('.posts') as HTMLElement;
const userContainer = document.querySelector('.user') as HTMLElement;
const allUserContainer = document.querySelector('.all-user') as HTMLElement;
let allDataUser;
const deleteBtn = document.querySelector('.delete button') as HTMLElement;


submitBtn?.addEventListener('click', () => {
    let msg = {
        msg: message.value,
        name: parsedUser.name,
        img: parsedUser.img,
        createdAt: new Date().toISOString() // det här används sedan för att sortera det senaste meddelandet
    }

    fetch('https://social-media-bebf1-default-rtdb.europe-west1.firebasedatabase.app/posts.json', {  // skicka en POST-förfrågan för att lägga till meddelande i Firebase
        method: "POST",
        body: JSON.stringify(msg),
    }).then(() => {
        displayMsg()
    });
})

async function displayMsg() {// Hämta en lista med alla meddelanden som finns i Firebase.
    postsContainer.innerHTML = "";

    const res = await fetch('https://social-media-bebf1-default-rtdb.europe-west1.firebasedatabase.app/posts.json');
    const data = await res.json();

    let convertedData: msgType[] = Object.values(data);

    let newData = convertedData.sort((a, b) => {
        const bDate = new Date(b.createdAt);
        const aDate = new Date(a.createdAt);
        return bDate.getTime() - aDate.getTime();
    });

    newData.map((msg) => {
        const checkImg = parsedImgs[Number(msg.img)];

        let el = `
                <div class="post">
                <div class="user-profile">
                <h6>${msg.name}</h6>
                <img src="${checkImg}" style="width: 50px"
                    alt="">
            </div>
            <p>
                 ${msg.msg}
            </p>
                </div>
            `;

        postsContainer.innerHTML += el;
    })
}

function showMyUser() { // Få en lista över min kontoinformation
    const checkImg = parsedImgs[Number(parsedUser.img)];

    let user = `
    <h3>${parsedUser.name}</h3>
                    <img src="${checkImg}" style="width: 40px"
                        alt="">
    `;

    userContainer.innerHTML += user;
}

async function allUsers() { // Lista ut all användaren som finns i databasen
    const res = await fetch('https://social-media-bebf1-default-rtdb.europe-west1.firebasedatabase.app/users.json');
    const data = await res.json();

    allDataUser = data
    let newData: User[] = Object.values(data);

    Object.values(newData).map((user, i) => {
        const checkImg = parsedImgs[Number(user.img)];

        let el = `
            <div class="user" style="border: 1px solid; padding: 1rem">
                <a href="./profile.html?id=${Object.keys(data)[i]}&name=${user.name}" >
                <h6>${user.name}</h6>
                <img src="${checkImg}" style="width:50px"
                    alt="">
                </a>
            </div>
        `
        allUserContainer.innerHTML += el
    })
}


function deleteMyAccount(id) { // ta bort min användare
    fetch(`https://social-media-bebf1-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`, { method: 'DELETE' })
        .then(() => {
           localStorage.removeItem('myProfile'); 
           window.location.assign('../index.html'); 
        })
}


deleteBtn.addEventListener('click', () => {  
    let newData: User[] = Object.values(allDataUser);

    Object.values(newData).map((user, i) => { // Hämta användaren från databasen och jämför användarens namn med vårt kontos användarnamn
        if (user.name === parsedUser.name) {
            deleteMyAccount(Object.keys(allDataUser)[i]); // Baserat på matchat index extraherar vi ID som är kopplat till objectet för att sedan ta bort den användaren. 
        }
    })
})


allUsers()
showMyUser()
displayMsg()