
type msgType = {
    msg: String,
    name: String,
    img: Number,
    createdAt: Date,
}

const idParams = new URLSearchParams(location.search);
const id = idParams.toString().split('=')[1]; // Ta ut den id parameter på URL för att sedan hämtar information från databasen


const nameTextContainer = document.querySelector('.name') as HTMLElement;

const imgContainer = document.querySelector('.img');
const imgs = localStorage.getItem('img');
const parsedImgs = imgs ? JSON.parse(imgs) : null;

const postsContainer = document.querySelector('.posts');


async function showUser() { // Lista ut användaren baserat på parameteravärdet
    const res = await fetch(`https://social-media-bebf1-default-rtdb.europe-west1.firebasedatabase.app/users/${id.split('&')[0]}.json`);
    const user = await res.json();

    nameTextContainer.textContent = "Name: " + user.name;
    let img = document.createElement('img');
    img.src = parsedImgs[Number(user.img)];
    img.style.width = "60px"
    imgContainer?.append(img);
}


async function showPosts() {
    const res = await fetch(`https://social-media-bebf1-default-rtdb.europe-west1.firebasedatabase.app/posts.json`);
    const posts = await res.json();


    let convertedData: msgType[] = Object.values(posts);

    let newData = convertedData.sort((a, b) => { // visa det senaste meddelandet.
        const bDate = new Date(b.createdAt);
        const aDate = new Date(a.createdAt);
        return bDate.getTime() - aDate.getTime();
    });

    newData.map((post) => {
        if (post.name === idParams.toString().split('=')[2]) { // Kontrollera om användaren matchar med parametervärdet-url för att få den användare vi har klickat på
            let el = `
                <p>${post.msg}</p>
            `
            postsContainer!.innerHTML += el;
        }
    })
}

 
showPosts()
showUser()