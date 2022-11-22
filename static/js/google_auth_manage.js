let global_googleuser;
let link_g;
if (data_recieved) {
    document.getElementById('room_input').value = data_recieved;
    document.getElementById('desc').innerText = 'You are joining through the shared link, Just click on SignIn!'

}

function onSignIn(googleuser) {
    console.log("signin clicked")
    global_googleuser = googleuser;
    console.log("user is:", googleuser);
    send_google_data();

}

const signOut = () => {
    console.log("onclick signout")
    gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log("user signed out")
    })
}

//set data to a form then send the data to the server
const send_google_data = () => {
    signOut();
    document.getElementById('name').value = global_googleuser['kv']['Af'];
    document.getElementById('dp').value = global_googleuser['kv']['qO'];
    document.getElementById('gmail').value = global_googleuser['kv']['Wv'];
    const room = document.getElementById('room_input').value;
    if (room != '') {
        document.getElementById('room').value = document.getElementById('room_input').value;

    } else {
        document.getElementById('room').value = '000000';

    }
    document.getElementById('submit').click();
    // console.log(global_googleuser);
}
const join_clicked = () => {
    console.log("join clicked");
    document.getElementById('google_btn').click();
}



const createRoom = () => {
    document.getElementById('copyClicked').innerText = 'Copy'

    document.getElementById('roomIdPop').style.display = 'block';
    document.getElementById('main').style.filter = 'blur(3px)';


    let time = Date.now();
    let arr = (time + "").split("");
    let link = '';
    for (let i = 0; i < arr.length; i++) {
        if (i > 6) {
            link += arr[i];
        }
    }
    link_g = link;
    document.getElementById('room_link').innerText = `https://sunnychatv2.herokuapp.com/room/${link}`;
    document.getElementById('room_link').href = `https://sunnychatv2.herokuapp.com/room/${link}`;

    document.getElementById('room_input').value = link;
    document.getElementById('desc').innerText = 'You created a chat room now, click on Sign In button to go inside';

}

const copyClicked = () => {
    console.log("copy clicked")
    navigator.clipboard.writeText(`https://sunnychatv2.herokuapp.com/room/${link_g}`);
    document.getElementById('copyClicked').innerText = 'Copied'
}

const xPopedClicked = () => {
    document.getElementById('main').style.filter = '';

    document.getElementById('roomIdPop').style.display = 'none';
    console.log("xPopClicked");
}
let navSelected = 'home';
document.getElementById(navSelected).style.backgroundColor = '#035b64';

const navClicked = (e) => {
    if (navSelected == 'home') {
        document.getElementById('main').style.display = 'none';
    } else if (navSelected == 'features') {
        document.getElementById('features_page').style.display = 'none';

    } else if (navSelected == 'about us') {
        document.getElementById('about_page').style.display = 'none';

    } else if (navSelected == 'support') {
        document.getElementById('support_page').style.display = 'none';

    }
    document.getElementById(navSelected).style.backgroundColor = '#007c89';
    console.log(e.target.innerText.toLowerCase());
    navSelected = e.target.innerText.toLowerCase();
    document.getElementById(navSelected).style.backgroundColor = '#035b64';

    if (navSelected == 'home') {
        document.getElementById('main').style.display = 'block';
    } else if (navSelected == 'features') {
        document.getElementById('features_page').style.display = 'block';

    } else if (navSelected == 'about us') {
        document.getElementById('about_page').style.display = 'block';

    } else if (navSelected == 'support') {
        document.getElementById('support_page').style.display = 'block';

    }
}
