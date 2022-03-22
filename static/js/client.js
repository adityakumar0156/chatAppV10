const socket = io('https://sunnychatserverv2.herokuapp.com', { transports: ['websocket'] });

socket.emit('preparing', room_recieved, gmail_recieved);

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');


let users = [];
document.getElementById('microphone').value = 0;

let sendBtn = document.getElementsByClassName('round-btn')[0];
let micBtn = document.getElementsByClassName('round-btn')[1];
let gifBtn = document.getElementsByClassName('round-btn')[2];

sendBtn.disabled = true;
micBtn.disabled = true;
gifBtn.disabled = true;
//******************/
let name, room, dp, socketId, connection, peerId, myStream, peers, peerIdNames;
let clickedPeer, popup, desc;
// let streamingStatus = {};
let microphone_switch = false;
let mic_status_users = {};
let sent_pointer = 0;
let prevMsgLen = 0;
let peer;

room = room_recieved;


let peer_status = false,
    joining_status = false,
    anonymous = false,
    anony_name = "",
    anony_dp = "",
    discon_event_fired = false;


const obj_entryMusic = {
    "Cheems Vidhayak": '/static/media/whatsappweb.mp3',
    "Doge Builder": '/static/media/whatsappweb.mp3',
    "Sameer Suddi": '/static/media/char/charMusic/oyeah.mp3',
    "Nobita": './static/media/whatsappweb.mp3',
    "Munna Tripathi": '/static/media/whatsappweb.mp3',
    "Duryodhan": '/static/media/whatsappweb.mp3',
    "Mitr Karn": '/static/media/whatsappweb.mp3',
    "Suzuka": '/static/media/whatsappweb.mp3',
    "Selmon Bhai": '/static/media/whatsappweb.mp3',
    "MamaShree Sakuni": '/static/media/whatsappweb.mp3',
    "Hindustani Bhau": '/static/media/char/charMusic/jaihind.mp3'
};
peer = new Peer(undefined, {
    path: 'peerjs',
    host: '/', // ye wala host peer create kr k dega...
    port: 443

})


window.addEventListener('load', function() { //jab window load ho jaiga tb ye wala event add kro uspe

    //logic for welcoming..  :)
    document.getElementById('loading_view').style.display = 'none';
    document.getElementById('go_in').style.display = 'block';


    function online(event) {
        console.log('Became online')
        if (discon_event_fired) {
            socket.emit('new-user-joined', name, room, peerId, dp, anonymous, desc, `location`, gmail_recieved, name_recieved);
        }
    }

    function offline(event) {
        console.log('Became offline');
        //logic to stop voice streaming when "this" went offline 
        if (microphone_switch == true) {
            const myTrack = myStream.getAudioTracks()[0];
            if (myTrack.readyState == 'live' && myTrack.kind === 'audio') {
                myTrack.stop();
            }

            console.log('streaming stoped(forcefully)');
        }
    }
    //window add hone k baad ye wala event add krna hai
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
});


let videoGrid = document.getElementById('vids');
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


const userBtn = document.getElementById('users');
userBtn.innerText = "Connecting...🖐";


const go_in_clciked = () => {
    if (!anonymous) {
        name = name_recieved;
        dp = dp_recieved;

        document.getElementById('user_name').innerText = getFstName(name);


        let val = document.getElementById('desc_inp').value
        let val2 = document.getElementById('desc_inp').value
        desc = val2 == '' ? "Hey There..!! I am inside Haveli" : val;
        console.log("before replace all")
        desc=desc.replace(/<|>/gi, "");

        joining_status = true;


        document.getElementById('go_in').style.display = 'none';
        document.getElementById('start').style.display = 'block';
        if (peer_status) {
            socket.emit('new-user-joined', name, room, peerId, dp, anonymous, desc, `location`, gmail_recieved, name_recieved);
            if (anonymous) {
                $.post('/popchar', { room: room, name: name }, (data, status) => {
                    if (data.status == "success") {
                        // console.log("character poped from server");
                    } else {
                        // console.log("faied to pop from the server")
                    }
                })
            }
        }



    } else {

        document.getElementById('show_dp').src = anony_dp;
        name = anony_name;
        dp = anony_dp;
        document.getElementById('user_name').innerText = getFstName(name);

        $.post('/checkchar', { room: room, char: anony_name }, (result, status) => {
            // console.log(result);
            if (result.status == 'available') {
                let val = document.getElementById('desc_inp').value
                let val2 = document.getElementById('desc_inp').value
                desc = val2 == '' ? "Hey There..!! I am inside Haveli" : val;
                console.log("before replace all")
                desc=desc.replace(/<|>/gi, "");
                
                joining_status = true;


                document.getElementById('go_in').style.display = 'none';
                document.getElementById('start').style.display = 'block';
                if (peer_status) {
                    socket.emit('new-user-joined', name, room, peerId, dp, anonymous, desc, `location`, gmail_recieved, name_recieved);
                    if (anonymous) {
                        $.post('/popchar', { room: room, name: name }, (data, status) => {
                            if (data.status == "success") {
                                // console.log("character poped from server");
                            } else {
                                // console.log("faied to pop from the server")
                            }
                        })
                    }
                }

            } else if (result.status == 'not-available') {
                // alert('The character you selected has ALREADY TAKEN by another user')
                dynamicPopup('The character you selected has ALREADY TAKEN by another user', 'You are Late');

            }
        })

    }





    // if (!anonymous) {
    //     name = name_recieved;
    //     dp = dp_recieved;

    //     document.getElementById('user_name').innerText = getFstName(name);

    // } else {
    //     $.post('/checkchar', { room: room, char: anony_name }, (result, status) => {
    //         // console.log(result);
    //         if (result.status == 'available') {

    //         } else if (result.status == 'not-available') {
    //             // alert('The character you selected has ALREADY TAKEN by another user')
    //             dynamicPopup('You are Late', 'The character you selected has ALREADY TAKEN by another user')
    //             flag = true;
    //         }
    //     })
    //     console.log('after returned');
    //     document.getElementById('show_dp').src = anony_dp;
    //     name = anony_name;
    //     dp = anony_dp;
    //     document.getElementById('user_name').innerText = getFstName(name);
    // }



    // let val = document.getElementById('desc_inp').value
    // let val2 = document.getElementById('desc_inp').value
    // desc = val2 == '' ? "Hey There..!! I am inside Haveli" : val;
    // console.log("before replace all")
    // desc = desc.replaceAll("<", " ");
    // desc = desc.replaceAll(">", " ");
    // joining_status = true;


    // document.getElementById('go_in').style.display = 'none';
    // document.getElementById('start').style.display = 'block';
    // if (peer_status) {
    //     socket.emit('new-user-joined', name, room, peerId, dp, anonymous, desc, `location`, gmail_recieved, name_recieved);
    //     if (anonymous) {
    //         $.post('/popchar', { room: room, name: name }, (data, status) => {
    //             if (data.status == "success") {
    //                 // console.log("character poped from server");
    //             } else {
    //                 // console.log("faied to pop from the server")
    //             }
    //         })
    //     }
    // }


}

const go_in_anonymous_clicked = () => {
    document.getElementById('name_while_joining').innerText = 'Checking for avaialble Characters';
    document.getElementById('dp_while_joining').src = 'https://c.tenor.com/hdDC18mel8oAAAAj/loading-buffer.gif';
    document.getElementById('anonymBtn').innerText = "Wait . . .";
    document.getElementById('anonymBtn').disabled = true;
    document.getElementById('join_room').disabled = true;
    if (!anonymous) {

        $.post('/getchar', { room: room }, (data, status) => {
            if (data.status == "success") {
                anonymous = true;
                anony_name = data.name;
                anony_dp = data.dp;
                document.getElementById('name_while_joining').innerText = data.name;
                document.getElementById('dp_while_joining').src = data.dp;
                document.getElementById('anonymBtn').innerText = "Make me Real";

                document.getElementById('anonymBtn').disabled = false;
                document.getElementById('join_room').disabled = false;
                //console.log(data);
            } else {
                document.getElementById('anonymBtn').disabled = false;
                document.getElementById('join_room').disabled = false;

                //console.log("no characters available");
                alert("No characters available.")
            }
        })
    } else {
        document.getElementById('anonymBtn').innerText = "Make me Anonymous";
        document.getElementById('name_while_joining').innerText = name_recieved;
        document.getElementById('dp_while_joining').src = dp_recieved;
        document.getElementById('anonymBtn').disabled = false;
        document.getElementById('join_room').disabled = false;

        anonymous = false;


    }


}

let info;
const getIP = () => {
    //console.log("getIP callled")
    $.get("https://ipinfo.io/json", (data, status) => {
        //console.log("ip data:", data);
        info = data;
        //console.log("get ip:", status);

    })

}
peer.on('open', id => {
    //console.log("peer opened..!!!", id);
    peer_status = true;
    peerId = id;
    // getIP();
    if (joining_status) {
        socket.emit('new-user-joined', name, room, peerId, dp, anonymous, desc, `location`, gmail_recieved, name_recieved);
    }

    //tracing user Locatiion through IP addresses

})


const myInterval = setInterval(myTimer, 800);

function myTimer() {
    const elem = document.getElementById('messageInp');
    const current_len = elem.value;
    if (current_len != prevMsgLen) {
        socket.emit('type', name, room);
        prevMsgLen = current_len;
    }
}


const showRoom = document.getElementById('offcanvasRightLabel');
showRoom.innerHTML += room;


const beep = new Audio('/static/media/whatsapp_incoming.mp3');
const entry = new Audio('/static/media/whatsappweb.mp3');
const left_mp3 = new Audio('/static//media/beep.mp3');
const send_mp3 = new Audio('/static/media/mac_os_morse.mp3');
const keypress = new Audio('/static/media/keypress.mp3');
const confailed = new Audio('/static/media/notification_2.mp3');
const consucceeded = new Audio('/static/media/notification (1).mp3');
const streaming = new Audio('/static/media/voiceStreming2.mp3');
const stopedstreaming = new Audio('/static/media/voiceStreming.mp3');
const clicked_mp3 = new Audio('/static/media/click_sound.mp3');
const support_mp3 = new Audio('/static/media/popcorn.mp3');




const getFstName = (name) => {
    let str = name.trim();
    let arr = str.split(" ");
    str = arr[0];
    return str;
}

function emojisOnly(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    let remainder = string.replace(regex, '');
    let flag = true;
    for (let i = 0; i < remainder.length; i++) {
        if (remainder.charCodeAt(i) < 500) {
            flag = false;
            break;
        }
    }
    return flag;
}


// ########################## Link Scanner #####################
// #############################################################

const lnkify = (str) => {
    //utility functions

    function bblSort(points) {
        //console.log("bubble sort executed");
        for (var i = 0; i < points.length; i++) {

            for (var j = 0; j < (points.length - i - 1); j++) {

                if (points[j].start > points[j + 1].start) {

                    var temp = points[j];
                    points[j] = points[j + 1]
                    points[j + 1] = temp
                }
            }
        }
        //console.log(points);
    }


    const addSpan = (s, e, str, elm) => {
        let elem = document.createElement('span');
        elem.innerText = str.substring(s, e + 1, str);
        elem.classList.add('planeText')
        elm.append(elem);
    }
    const addLink = (s, e, str, elm) => {
        let elem = document.createElement('a');
        elem.href = str.substring(s, e + 1, str);
        elem.innerText = str.substring(s, e + 1, str);
        elem.target = '_blank'
        elem.classList.add('textLink');
        elm.append(elem);
    }

    const addEmail = (s, e, str, elm) => {
        let elem = document.createElement('a');
        elem.href = `mailto: ${str.substring(s, e + 1, str)}`;
        elem.innerText = str.substring(s, e + 1, str);
        elem.target = '_blank'
        elem.classList.add('textEmail');
        elm.append(elem);
    }

    let points = [];

    var regex_url = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;


    while ((match = regex_url.exec(str)) != null) {

        let j = 0;
        while (str.charAt(match.index + j) != ' ') {
            j++;

            if (match.index + j + 1 == str.length) break;
        }
        let link = {
            start: match.index,
            end: match.index + j,
            type: 'url'
        };
        points.push(link);
    }


    let regex_email = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    while ((match = regex_email.exec(str)) != null) {

        //console.log("match found at " + match.index);
        let j = 0;
        while (str.charAt(match.index + j) != ' ') {
            j++;

            if (match.index + j + 1 == str.length) break;
        }
        let link = {
            start: match.index,
            end: match.index + j,
            type: 'email'
        };
        points.push(link);
    }

    bblSort(points);


    //creating modified text message
    let begin = -1;
    let elm = document.createElement('div');
    points.forEach(elem => {
        if (elem.type == 'url') {

            addSpan(begin + 1, elem.start - 1, str, elm)
            addLink(elem.start, elem.end, str, elm);
            begin = elem.end;
        } else if (elem.type == 'email') {
            addSpan(begin + 1, elem.start - 1, str, elm);
            addEmail(elem.start, elem.end, str, elm);
            begin = elem.end;
        }
    })
    addSpan(begin + 1, str.length - 1, str, elm);
    //console.log(elm);

    let div = document.createElement('div');
    div.append(elm)
    return div;
}



// ########################################################
// #######################################################
let msg_No = 1;
const append = (name, message, position, dp, anony, peerid) => {
    //console.log("dp:", dp, peerid);
    const messageElement = document.createElement('div');
    messageElement.setAttribute("id", `msg_${msg_No}_${peerid}`);

    const nameElement = document.createElement('div');
    const timeElement = document.createElement('div');
    const send_sent = document.createElement('div');
    send_sent.innerText = '. . .';


    timeElement.innerText = new Date().toLocaleString().split(",")[1];
    nameElement.innerText = name;
    // messageElement.innerText = message;
    //console.log(lnkify(message));

    messageElement.innerHTML = lnkify(message).innerHTML;

    send_sent.classList.add('sending');
    if (anony) {
        nameElement.classList.add('name_anony');
    } else {
        nameElement.classList.add('name');
    }

    //checking : only emoji or mixture
    if (emojisOnly(message))
        messageElement.classList.add('messageEmojiOnly');
    else
        messageElement.classList.add('message');

    messageElement.classList.add(position);
    timeElement.classList.add('time');

    messageElement.append(timeElement);
    messageElement.append(nameElement);
    if (position == 'right') {
        messageElement.append(send_sent);
    }

    let dpElem;
    if (dp) {
        // nameElement.addEventListener('click', dpClickedInChat, false);
        // nameElement.value = peerid;


        //console.log("if block inside dp is executed");
        dpElem = document.createElement('img');
        dpElem.addEventListener('click', dpClickedInChat, false);
        dpElem.alt = peerid;
        dpElem.src = dp;
        dpElem.classList.add("name_dp");
        nameElement.append(dpElem);
    }

    messageContainer.append(messageElement);
    //scroll to bottom 
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const dpClickedInChat = () => {


    //console.log("dpClickedInChat", event.target.getAttribute("alt"));
    clickedPeer = event.target.getAttribute("alt");
    let present = false;
    for (let p in peers) {
        if (peers[p] == clickedPeer) {
            present = true;
        }
    }
    if (present) {

        popup = document.createElement("div");
        // popup.addEventListener('click', xPopedClicked, false);
        let support = 'Support',
            report = 'Report';

        for (let i = 0; i < supported_users.length; i++) {
            if (supported_users[i] == clickedPeer)
                support = 'Unsupport'
        }

        // if (supported_users.length == 0)

        for (let i = 0; i < reported_users.length; i++) {
            if (reported_users[i] == clickedPeer)
                report = 'Unreport'
        }

        popup.innerHTML =
            `
        <div class="box">
            <img class=""style="width: 38px;position: absolute;left: 15px; top: 15px;    "    src="https://sunnychatv2.herokuapp.com/static/media/love.png" alt="" width="100px">
            <span  style="position: absolute;top: 34px; left: 55px; font-size: 130%;  font-weight: 600; "  id="support">${peerIdNames[clickedPeer].reaction.support}</span>
            <img class="" style=" width: 38px; position: absolute; left: 87px; top: 15px;" src="https://sunnychatv2.herokuapp.com/static/media/angry.png" alt="" width="100px">
            <span style=" position: absolute;top: 33px;left: 126px;font-size: 130%;font-weight: 600;" id="report">${peerIdNames[clickedPeer].reaction.report+peerIdNames[clickedPeer].reaction.warn}</span>
            <br>
            <button class="btn btn-danger cutBtn" onClick="xPopedClicked() ">X</button>
            <img class="dpShow" src="${event.target.getAttribute("src")}" alt="" width="100px">
            <div>
                <div class="name_pop">${peerIdNames[clickedPeer].anony?peerIdNames[clickedPeer].name+" !":peerIdNames[clickedPeer].name}</div>
                <div class="desc">${peerIdNames[clickedPeer].desc}</div>
            </div>
            <div>
                <button class=" mx-1 px-4 my-3 cutBtnR" onClick="support()" ><b><span id="togSupport">${support}</span></b> </button>
                <button class="my-1 px-4 cutBtnR" onClick="report()" ><b><span id="togReport" >${report}</span></b>   </button>
            </div>
        </div>`
        popup.classList.add("popup");
        let body = document.body;
        body.append(popup);

        document.getElementById('container_m').style.filter = 'blur(5px)';
        // document.getElementById('footer').style.filter = 'blur(3px)';
        document.getElementById('send_m').style.filter = 'blur(5px)';
    } else {
        // alert("This user has LEFT the room.");
        let dp = event.target.getAttribute("src")
        dynamicPopup('No information available', 'User has left the Room', dp);
    }
}


const xPopedClicked = () => {
    document.getElementById('container_m').style.filter = ''
    document.getElementById('footer').style.filter = '';
    document.getElementById('send_m').style.filter = '';

    popup.remove();
    // document.getElementById('popup').remove();
    //console.log("xPopClicked ", clickedPeer);

}
let supported_users = [],
    reported_users = [];
const support = () => {
    //console.log("support", clickedPeer);
    let flag = false;
    for (let i = 0; i < supported_users.length; i++) {
        if (supported_users[i] == clickedPeer) {
            //unsupport
            delete supported_users[i];
            socket.emit('support', peerId, clickedPeer, false);
            flag = true;
            document.getElementById('support').innerText = `${peerIdNames[clickedPeer].reaction.support-1}`
            document.getElementById('togSupport').innerText = 'Support'
            break;

        }
    }
    if (!flag) {
        socket.emit('support', peerId, clickedPeer, true);
        supported_users.push(clickedPeer);

        document.getElementById('support').innerText = `${peerIdNames[clickedPeer].reaction.support+1}`
        document.getElementById('togSupport').innerText = 'Unsupport'
    }
    //console.log(supported_users);
}



socket.on('supported', (peerSupported, peerSupporter, bool) => {
    if (bool) {
        peerIdNames[peerSupported].reaction.support += 1;
        //console.log('support increment by one')

    } else {
        peerIdNames[peerSupported].reaction.support -= 1;
        //console.log('support decrement by one')
    }

    if (peerSupported == peerId) {
        document.getElementById(peerSupported).childNodes[9].childNodes[3].innerText = peerIdNames[peerSupported].reaction.support;
        document.getElementById('support_count').innerText = peerIdNames[peerSupported].reaction.support;

    } else
        document.getElementById(peerSupported).childNodes[11].childNodes[3].innerText = peerIdNames[peerSupported].reaction.support;


    if (peerSupported == peerId && bool) {
        append_joined(peerIdNames[peerSupporter].name + " supported you 💖💖");
        support_mp3.play();
    }




})


const report = () => {
    //console.log("report clicked ", clickedPeer);
    let flag = false;
    for (let i = 0; i < reported_users.length; i++) {
        if (reported_users[i] == clickedPeer) {
            //unreport
            delete reported_users[i];
            socket.emit('report', peerId, clickedPeer, false);
            flag = true;
            document.getElementById('report').innerText = `${peerIdNames[clickedPeer].reaction.report-1}`
            document.getElementById('togReport').innerText = 'Report'
            break;
        }
    }

    if (!flag) {
        socket.emit('report', peerId, clickedPeer, true);
        reported_users.push(clickedPeer);

        document.getElementById('report').innerText = `${peerIdNames[clickedPeer].reaction.report+1}`
        document.getElementById('togReport').innerText = 'Unreport'
    }
}

socket.on('reported', (peerReported, peerReporter, bool) => {

    if (bool) {
        peerIdNames[peerReported].reaction.report += 1;
        //console.log('report increment by one');

    } else {
        peerIdNames[peerReported].reaction.report -= 1;
        //console.log('report decrement by one');
    }

    if (peerReported == peerId) {
        document.getElementById(peerReported).childNodes[9].childNodes[7].innerText = peerIdNames[peerReported].reaction.report; //home wala
        document.getElementById('report_count').innerText = peerIdNames[peerReported].reaction.report; //global wala

    } else
        document.getElementById(peerReported).childNodes[11].childNodes[7].innerText = peerIdNames[peerReported].reaction.report;

})





//appending images
const append_img = (name, img, position, dp, anony, peerid, msg_No) => {
        const img_element = document.createElement('img');
        const messageElement = document.createElement('div');
        messageElement.setAttribute("id", `msg_${msg_No}_${peerid}`);

        const send_sent = document.createElement('div');
        send_sent.innerText = '. . .';

        const nameElement = document.createElement('div');
        const timeElement = document.createElement('div');

        timeElement.innerText = new Date().toLocaleString().split(",")[1];
        nameElement.innerText = name;
        img_element.src = img;

        send_sent.classList.add('sending');
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        img_element.classList.add('memes_img');
        timeElement.classList.add('time');

        if (anony) {
            nameElement.classList.add('name_anony');
        } else {
            nameElement.classList.add('name');
        }

        messageElement.append(img_element);
        messageElement.append(timeElement);
        messageElement.append(nameElement);
        if (position == 'right') {
            messageElement.append(send_sent);
        }
        let dpElem;
        if (dp) {
            // nameElement.addEventListener('click', dpClickedInChat, false);
            // nameElement.value = peerid;


            //console.log("if block inside dp is executed");
            dpElem = document.createElement('img');
            dpElem.addEventListener('click', dpClickedInChat, false);
            dpElem.alt = peerid;
            dpElem.src = dp;
            dpElem.classList.add("name_dp");
            nameElement.append(dpElem);
        }
        messageContainer.append(messageElement);


        //scroll to bottom 
        setTimeout(() => {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 300)
    }
    //append img UI


const append_joined = (name) => {

    const messageElement = document.createElement('div');
    const timeElement = document.createElement('div');

    timeElement.innerText = new Date().toLocaleString().split(",")[1];
    messageElement.innerText = name;
    messageElement.classList.add('joined');
    timeElement.classList.add('time');
    messageElement.classList.add('message');
    messageElement.append(timeElement);
    messageContainer.append(messageElement);

    //scroll to bottom 
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const append_top = async(name) => {

    const userBtn = document.getElementById('users');
    userBtn.innerText = `${getFstName(name)} is Typing..✍`;

    await keypress.play();

    setTimeout(() => {
        const userBtn = document.getElementById('users');
        count = 0;
        let str = '';
        users.forEach(element => {
            count = count + 1;
            str = str + element + "\n";
        });
        if (count > 1) {
            userBtn.innerText = "Online Users: " + (count - 1) + "🙋‍♂️";
        } else {
            userBtn.innerText = 'Room is Empty🙁';

        }
    }, 2500);

}

const update_users_modified_fun = (userName, peerIdNames) => {
    //console.log('update_users_modified_fun...fired!!');
    const userList = document.getElementById('userList');
    let str = `<img id="send" width="37px" height="37px" src="./static/media/happy.png" />&nbsp&nbsp <b>Guest List :</b> <br><br>`;
    count = 0;
    userName.forEach(element => {
        count = count + 1;

    });
    document.getElementById('online_users_count').innerText = count - 1;
    //logic of showing users list in appropriate way :)

    let i = 0;
    for (let key in peerIdNames) {

        if (peerIdNames.hasOwnProperty(key)) {

            if (key == peerId) {

                if (mic_status_users[key] == true) {
                    str += `<img id="microphone2" style="border-radius: 30px; /* margin: 3px; */ object-fit: cover; width: 55px; height: 55px;"   value=0 src=${peerIdNames[key].dp} /><img id="microphone2"   width="34px" height="34px" value=0 src="./static/media/microphone.png" />` + peerIdNames[key].name + '<b> (You)</b><br>';
                } else {
                    str += `<img id="microphone2" style="border-radius: 30px;/* margin: 3px; */ object-fit: cover; width: 55px; height: 55px;"  value=0 src=${peerIdNames[key].dp} /><img id="microphone2"   width="34px" height="34px" value=0 src="./static/media/mute.png" />` + peerIdNames[key].name + '<b> (You)</b><br>';
                }
            } else {
                if (mic_status_users[key] == true) {
                    str += `<img id="microphone2" style="border-radius: 30px; /* margin: 3px; */ object-fit: cover; width: 55px; height: 55px;" value=0 src=${peerIdNames[key].dp} /><img id="microphone2"   width="34px" height="34px" value=0 src="./static/media/microphone.png" />` + peerIdNames[key].name + '<br>';
                } else {
                    str += `<img id="microphone2" style="border-radius: 30px;object-fit: cover;width: 55px;  height: 55px;"    value=0 src=${peerIdNames[key].dp} /><img id="microphone2"   width="34px" height="34px" value=0 src="./static/media/mute.png" />` + peerIdNames[key].name + '<br>';
                }
            }
        }
        i++;
    }


    const leave = `
    <a type="button" onClick=click_mp3() class="btn btn-success my-2" href="/" style="font-size:100%;">Leave Room <img width="40px" height="40px" src="./static/media/close.png" alt="" >    </a>
    <div style="margin-top: 10px; padding: 15px; background-color: #314548;font-size: 65%;border-radius: 6px;" >Room Info: <b>https://sunnychatv2.herokuapp.com/room/${room}</b>
    <button style="" id="copyLink" onClick="copyClicked()">Copy Link</button> </div>`;

    const about = `<hr>
    <div style="position: relative;margin: 23px 0px;margin-left: 26px;">
        <img src="https://sunnychatv2.herokuapp.com/static/media/house1.png" alt="" style="  height: 65px; width: 65px; border-radius: 7px;  object-fit: cover; ">
        <div style=" font-size: 129%; position: absolute; left: 80px; top: 16px;   border-left: 4px solid #11acbd;    padding-left: 6px;    margin-left: 12px;    ">Haveli  
                  <div style=" position: absolute; font-size: 46%; width: 89px; color: #b0ade3;  bottom: 11px; left: 92px; font-family: cursive;    ">Say no to Fun</div>
        </div>
        <div style=" position: absolute; left: 115px;font-size: 73%;bottom: -8px;    ">Developed by Aditya</div>
    </div>`;

    userList.innerHTML = str + "<br>" + leave + "<br>" + about;
    const userBtn = document.getElementById('users');
    if (count > 1) {
        userBtn.innerText = "Online Users: " + (count - 1) + "🙋‍♂️";
    } else {
        userBtn.innerText = 'Room is Empty🙁';
    }
}


const copyClicked = () => {
    navigator.clipboard.writeText(`https://sunnychatv2.herokuapp.com/room/${room}`);
}



const update_users = (userName) => {

    const userList = document.getElementById('userList');
    let str = `<img id="send" width="37px" height="37px" src="./static/media/happy.png" />&nbsp&nbsp <b>Guest List:</b> <br><br>`;
    count = 0;
    userName.forEach(element => {
        count = count + 1;

    });
    let flag = 0;
    for (let element in userName) {
        if (userName[element] != name) {
            str = str + userName[element] + "<br>";
        } else if (userName[element] == name) {
            if (flag == 0) {
                str = str + userName[element] + " (<b>You</b>) <br>";
                flag = 1;
            } else {
                str = str + userName[element] + "<br>";
            }
        }
    }
    //console.log(str);
    const leave = `
    <a type="button" onClick=click_mp3() class="btn btn-success my-2" href="/" style="font-size:100%;">Leave Room <img width="40px" height="40px" src="./static/media/close.png" alt="" >    </a>
    <div style="    margin-top: 10px; padding: 15px; background-color:  #314548;   font-size: 65%;    border-radius: 6px;">Room Info: https://sunnychatv2.herokuapp.com/room/${room}
    <button style=" " id="copyLink" onClick="copyClicked()">Copy Link</button>
    </div>  `;
    // const voice_stream = `<a type="button" class="btn btn-success" onClick=voiceStream() id="stream-btn" style="font-size:100%;">Stream Voice<img width="40px" height="40px" src="./static/media/voice-stream.png" alt="" >
    // </a>`;
    const about = `<hr>  <img id="send" width="45px" height="45px" src="./static/media/house.png" />&nbsp&nbsp&nbsp&nbsp<b>Haveli</b><p style="font-size:78%;"> &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbspDeveloped By Aditya</p>`;
    userList.innerHTML = str + "<br>" + leave + "<br>" + about;
    const userBtn = document.getElementById('users');
    if (count > 1) {
        userBtn.innerText = "Online Users: " + (count - 1) + "🙋‍♂️";
    } else {
        userBtn.innerText = 'Room is Empty🙁';
    }
}

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const message = messageInput.value;
    append('You', message, 'right', undefined, undefined, peerId);
    socket.emit('send', message, room, 'text', msg_No);
    msg_No++;
    messageInput.value = '';
    await send_mp3.play();
})

socket.on('user-joined', async(remoteName, userList, socketid, remotePeerId, anony_status, peerNameDp, peersList) => {
    if (microphone_switch) {
        //agar es user ka microphone switch on hai to ye user newly 
        // joined user k pass call kar dega
        const options = { metadata: { "userId": peerId, "name": name } };

        if (peerId != remotePeerId) {
            //room me jo v hai sabke pass call kro ..siwai khud k :))
            peer.call(remotePeerId, myStream, options);

        }

    }
    users = userList;
    peerIdNames = peerNameDp;
    peers = peersList;
    // socketId = socketid;

    sent_pointer++;
    append_joined(`${remoteName} Joined`);
    // update_users(users);
    update_users_modified_fun(users, peerIdNames, ); // Online users show krne wala function

    //customize audio effect for Anonymous users for specific users
    if (anony_status == true) {
        const audio = new Audio(obj_entryMusic[remoteName]);
        await audio.play();
    } else {
        await entry.play();
    }
    // await entry.play();

})

socket.on('recieve', async(data) => {
    //console.log(data);
    if (data.peerId != peerId) {
        if (data.type == 'text') {

            append(data.name, data.message, 'left', data.dp, data.anonymous, data.peerId);
            sent_pointer++;
        } else {
            append_img(data.name, data.message, 'left', data.dp, data.anonymous, data.peerId);
            sent_pointer++;
        }
        await beep.play();
    } else {
        //enhanced logic
        let req_elem = document.getElementById(`msg_${data.msg_No}_${data.peerId}`).lastChild;
        // req_elem.innerText = 'Sent';
        req_elem.innerHTML = `<img src='https://cdn.iconscout.com/icon/premium/png-64-thumb/tick-112-787934.png' style=" width: 15px; position: absolute; top: -43px ;right: -4px; /* background: #ffffff; */ border: none; border-radius: 40px;">`;
        req_elem.classList.remove('sending');
        req_elem.classList.add('sent');
    }
})

socket.on('left', async(name, userList, peerList, peer, peerNamesList) => {
    //console.log('left event recieved!!', userList);

    //delete from home
    document.getElementById(peer).remove();

    delete mic_status_users[peer];
    peerIdNames = peerNamesList
    users = userList;
    peers = peerList;
    sent_pointer++;
    append_joined(`${name} Left`);
    // update_users(users);
    update_users_modified_fun(users, peerIdNames);

    await left_mp3.play();
})

socket.on('typing', (name) => {
    append_top(name);

})

let flag = 0;
socket.on('update-users', async(userList, peersList, peerNameList) => {
    users = userList;
    peers = peersList;
    peerIdNames = peerNameList;
    // usersDP = users_dp;
    // peers.forEach((id) => {
    //     mic_status_users[id] = false;
    // });

    if (connection == 0) {
        connection = 1;
        const userBtn = document.getElementById('users');
        userBtn.innerText = "Connected...😍";
        sendBtn.disabled = false;
        micBtn.disabled = false;
        gifBtn.disabled = false;
        await consucceeded.play()
    }

    if (flag == 0) {
        const userBtn = document.getElementById('users');
        sendBtn.disabled = false;
        micBtn.disabled = false;
        gifBtn.disabled = false;

        userBtn.innerText = "Welcome " + getFstName(name) + "😌!";
        flag = 1;
        setTimeout(() => {
            //console.log('update-users event recieved', userList);
            // update_users(userList);
            update_users_modified_fun(users, peerIdNames);

        }, 3000);
        await consucceeded.play()
    } else {
        //console.log('update-users event recieved', userList);
        // update_users(userList);
        update_users_modified_fun(users, peerIdNames);

    }



    if (microphone_switch == true && discon_event_fired == true) {

        //logict to start voice streaming
        const options = { metadata: { "userId": peerId, "name": name } };
        // var call = peer.call(userId, stream, options); //kis kis user k pas call krna hai

        // peers[peerId] = call;
        getUserMedia({ video: false, audio: true }, stream => {
            myStream = stream;
            //console.log("Calling to all users in room: ", room);
            //mic switch on krne k baad ..room me jitne log hain sabke pass call
            // krne ka progam
            peers.forEach((item, index) => {
                if (item != peerId) {
                    // khud ko chor k sabke pas call kro
                    peer.call(item, stream, options);
                }

            });

        }, err => {
            //console.log('Failed to get local stream', err);
        });
        //console.log('streaming restarted');
    }
    discon_event_fired = false;

    homeMaker(); // Make updated  profile list

})

socket.on('disconnect', async(msg) => {
    discon_event_fired = true;

    sendBtn.disabled = true;
    micBtn.disabled = true;
    gifBtn.disabled = true;
    connection = 0;
    const userList = document.getElementById('userList');
    const leave = `
    <a type="button" class="btn btn-success my-2" href="/" style="font-size:100%;">Leave Room <img width="40px" height="40px" src="./static/media/close.png" alt="" > </a>
    <div style=" margin-top: 10px;padding: 15px; background-color: #314548;    font-size: 65%;    border-radius: 6px;">Room Info: https://sunnychatv2.herokuapp.com/room/${room}
    <button style=" " id="copyLink" onClick="copyClicked()">Copy Link</button>
    </div>`;
    // const voice_stream = `<a type="button" id="stream-btn" class="btn btn-success" onClick=voiceStream() style="font-size:100%;">Stream Voice<img width="40px" height="40px" src="./static/media/voice-stream.png" alt="" >
    // </a>`;
    const about = `<hr>  <img id="send" class="logo_" width="45px" height="45px" src="./static/media/house1.png" />&nbsp&nbsp&nbsp&nbsp<b>Haveli</b><p style="font-size:78%;"> &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbspDeveloped By Aditya</p>`;
    userList.innerHTML = `You are offline 😒` + "<br><br>" + leave + "<br>" + about;
    const userBtn = document.getElementById('users');
    userBtn.innerText = "Reconnecting...";
    //console.log("disconnected", msg);
    //logic to stop voice streaming  
    const myTrack = myStream.getAudioTracks()[0];
    if (myTrack.readyState == 'live' && myTrack.kind === 'audio') {
        myTrack.stop();
    }

    //console.log('streaming stoped');



    await confailed.play();
})
socket.on('printStopsStreaming', async(name, peer) => {
    mic_status_users[peer] = false;
    sent_pointer++;
    append_joined(`${getFstName(name)} Stops Voice Streaming`);
    update_users_modified_fun(users, peerIdNames);
    await stopedstreaming.play();

    //managing home
    document.getElementById(peer).childNodes[3].src = 'https://sunnychatv2.herokuapp.com/static/media/mute.png'
})

const click_mp3 = async() => {
    await clicked_mp3.play();
}

const voiceStream = async() => {

    const streamBtn = document.getElementById('stream-btn2');
    const img_microphone = document.getElementById('microphone');
    if (img_microphone.value == 0) {
        mic_status_users[peerId] = true;
        microphone_switch = true;
        img_microphone.value = 1;
        img_microphone.src = "./static/media/mute.png"


        document.getElementById(peerId).childNodes[3].src = 'https://sunnychatv2.herokuapp.com/static/media/microphone.png'


        //logict to start voice streaming
        const options = { metadata: { "userId": peerId, "name": name } };
        // var call = peer.call(userId, stream, options); //kis kis user k pas call krna hai

        // peers[peerId] = call;
        getUserMedia({ video: false, audio: true }, stream => {
            myStream = stream;
            //console.log("Calling to all users in room: ", room);
            //mic switch on krne k baad ..room me jitne log hain sabke pass call
            // krne ka progam
            peers.forEach((item, index) => {
                if (item != peerId) {
                    // khud ko chor k sabke pas call kro
                    peer.call(item, stream, options);
                    //console.log('called to:', options);
                }

            });

        }, err => {
            //console.log('Failed to get local stream', err);
            //agar this user permission na de mic ka to error ayega usko handle krne ka
            // program

        });
        //console.log('streaming started');
    } else {
        mic_status_users[peerId] = false;
        microphone_switch = false;
        img_microphone.value = 0;
        img_microphone.src = "./static/media/microphone.png"

        document.getElementById(peerId).childNodes[3].src = 'https://sunnychatv2.herokuapp.com/static/media/mute.png'


        //logic to stop voice streaming  
        const myTrack = myStream.getAudioTracks()[0];
        if (myTrack.readyState == 'live' && myTrack.kind === 'audio') {
            socket.emit('stopsStreaming', name, room, peerId);
            myTrack.stop();
        }

        //console.log('streaming stoped');
    }
    update_users_modified_fun(users, peerIdNames);
    await clicked_mp3.play();
}


//answering a call (peer call)
peer.on('call', async(call) => {
    sent_pointer++;

    //console.log("call aya ", call.metadata);
    append_joined(`${getFstName(call.metadata.name)} Starts Voice Streaming🔊`);
    // peers[call.metadata.userId] = call;
    mic_status_users[call.metadata.userId] = true;
    // manage home
    document.getElementById(call.metadata.userId).childNodes[3].src = 'https://sunnychatv2.herokuapp.com/static/media/microphone.png'


    update_users_modified_fun(users, peerIdNames); //user list ready kregaa
    //console.log("Answered the call of..!!", call.metadata.name);
    call.answer(); // Answer the call with an A/V stream.
    call.on('stream', (remoteStream) => {
        // Show stream in some video/canvas element..
        //accept call from others without resistance
        // peers[userId] = call;
        //console.log('stream recived ', remoteStream);
        const video = document.createElement('video');

        video.srcObject = remoteStream;

        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        // videoGrid.append(video);

    });
    call.on('close', () => {
        //console.log('video removed..fired..!');
    })
    await streaming.play();

});


const click_on_meme_btn = () => {
    document.getElementById('hidden_btn_memes').click();
}

const meme_search = (val) => {
    //console.log(val);
    //console.log('ghjhghg');
}

const imgClicked = async(val) => {
    //console.log(val);
    document.getElementById('meme_close_btn').click();
    append_img('You', val.src, 'right', undefined, undefined, peerId, msg_No);
    socket.emit('send', val.src, room, 'image', msg_No);
    msg_No++;
    await send_mp3.play();
}



const stopStreaming = () => {
    const myTrack = myStream.getAudioTracks()[0];
    if (myTrack.readyState == 'live' && myTrack.kind === 'audio') {
        myTrack.stop();
    }

    //console.log('you are offline ...streaming stoped forcefully');
}

const restartStreaming = (peerid) => {

    const options = { metadata: { "peerID": peerId, "name": name } };

    getUserMedia({ video: false, audio: true }, stream => {
        myStream = stream;
        //console.log("Calling to all user: ");
        peer.call(peerid, stream, options);


    }, err => {
        //console.log('Failed to get local stream', err);

    });
    //console.log("dubara call kia..given peer ID pe");
}


// ###############################################################
// ################### Home(Show Profiles) #######################
// ###############################################################

const toogleHomeChat = () => {

    homeMaker()

    //console.log("toogleClicked", event.target.src)
    if (event.target.src == 'https://sunnychatv2.herokuapp.com/static/media/house.png') {
        document.getElementById('main_container').style.display = 'block';
        document.getElementById('container_m').style.display = 'none';
        document.getElementById('parent_container_m').style.display = 'none';
        event.target.src = 'https://sunnychatv2.herokuapp.com/static/media/chat.png'
    } else {
        document.getElementById('main_container').style.display = 'none';
        document.getElementById('container_m').style.display = 'block';
        document.getElementById('parent_container_m').style.display = 'block';

        event.target.src = 'https://sunnychatv2.herokuapp.com/static/media/house.png'

    }
}


const homeMaker = () => {

    let elem2 = document.getElementById('main_container');
    elem2.innerHTML = '';
    for (let key in peerIdNames) {
        if (peerIdNames.hasOwnProperty(key)) {

            const name = peerIdNames[key].name;
            const desc = peerIdNames[key].desc;
            const dp = peerIdNames[key].dp;
            const anony = peerIdNames[key].anony;
            const report = peerIdNames[key].reaction.report;
            const support = peerIdNames[key].reaction.support;
            let mic, report_btn, support_btn;
            let elem = document.createElement('div');
            elem.setAttribute('id', key);
            elem.classList.add('user_profile_parent');

            //mic status
            let mic_flag = false;
            for (let key2 in mic_status_users) {
                if (mic_status_users.hasOwnProperty(key2)) {
                    if (key2 == key && mic_status_users[key2] == true) {
                        mic_flag = true;
                        break;
                    }
                }
            }
            if (mic_flag) {
                mic = `https://sunnychatv2.herokuapp.com/static/media/microphone.png`
            } else {
                mic = `https://sunnychatv2.herokuapp.com/static/media/mute.png`

            }

            //report status
            let report_flag = false;
            reported_users.forEach((elem) => {
                if (elem == key) {
                    report_flag = true;
                    // break;
                }
            })
            if (report_flag) {
                report_btn = `Unreport`
            } else {
                report_btn = `Report`
            }
            //support status
            let support_flag = false;
            supported_users.forEach((elem) => {
                if (elem == key) {
                    support_flag = true;
                }
            })
            if (support_flag) {
                support_btn = `Unsupport`
            } else {
                support_btn = `Support`

            }

            //console.log(key == peerId)
            if (key == peerId) {
                //console.log('target code executed')
                elem.innerHTML = `
                <img src=${dp} alt="" class="user_profile_dp">
                        <img src=${mic} alt="" class="user_profile_mic">
                        <div class="user_profile_name">${anony ? name + " !" : name}</div>
                        <div class="user_profile_desc">${desc}</div>
                        <div class="user_profile_reation_div">
                        <img src="/static/media/love.png" alt="" style="width: 30px;">
                        <span style="font-weight: 600;font-size: 95%;position: absolute;top: 19px;left: 28px;">${support}</span>
                        <img src="/static/media/angry.png" alt="" style=" width: 30px;margin-left: 10px;">
                        <span style="font-weight: 600;font-size: 95%; position: absolute;top: 17px;">${report}</span>
                    </div>        
                        
                    </div>`
                elem2.append(elem);
            } else {
                elem.innerHTML = `
         <img src=${dp} alt="" class="user_profile_dp">
                 <img src=${mic} alt="" class="user_profile_mic">
                 <div class="user_profile_name">${anony ? name + " !" : name}</div>
                 <div class="user_profile_desc">${desc}</div>
                 <div style="text-align: center;">
                     <button class="user_profile_support_btn" onClick="support_profile()">${support_btn}</button>
                     <button value="" id="" class="user_profile_report_btn" onClick="report_profile()">${report_btn}</button>
                 </div>
                 <div class="user_profile_reation_div">
                     <img src="/static/media/love.png" alt="" style="width: 30px;">
                     <span style="font-weight: 600;font-size: 95%;position: absolute;top: 19px;left: 28px;">${support}</span>
                     <img src="/static/media/angry.png" alt="" style=" width: 30px;margin-left: 10px;">
                     <span style="font-weight: 600;font-size: 95%; position: absolute;top: 17px;">${report}</span>
                 </div>
             </div>
         `
                    // elem2.innerHTML = '';
                elem2.append(elem);
            }
        }
    }
}

const report_profile = () => {
    let peerReported = event.target.parentNode.parentNode.id;
    //console.log("report clicked", peerReported);
    //chech report condition
    let report_flag = false;
    reported_users.forEach((elem) => {
        if (elem == peerReported) {
            report_flag = true;
            // break;
        }
    })
    if (event.target.innerText == 'Report')
        event.target.innerText = 'Unreport';
    else
        event.target.innerText = 'Report';

    if (report_flag) {
        socket.emit('report', peerId, peerReported, !report_flag)

        const index = reported_users.indexOf(peerReported);
        if (index > -1) {
            reported_users.splice(index, 1); // 2nd parameter means remove one item only
        }

    } else {
        socket.emit('report', peerId, peerReported, !report_flag)
        reported_users.push(peerReported);
    }
}
const support_profile = () => {
    let peerSupported = event.target.parentNode.parentNode.id;
    //console.log("support clicked", peerSupported);
    //check support condition
    let support_flag = false;
    supported_users.forEach((elem) => {
        if (elem == peerSupported) {
            support_flag = true;
            // break;
        }
    })

    if (event.target.innerText == 'Support')
        event.target.innerText = 'Unsupport';
    else
        event.target.innerText = 'Support';


    if (support_flag) {
        socket.emit('support', peerId, peerSupported, !support_flag);

        const index = supported_users.indexOf(peerSupported);
        if (index > -1) {
            supported_users.splice(index, 1); // 2nd parameter means remove one item only
        }

    } else {
        socket.emit('support', peerId, peerSupported, !support_flag);
        supported_users.push(peerSupported);
    }
}




// ###########   option bar ######################
// ###############################################
const toogleFullScreen = () => {
    if (event.target.innerText == 'Full Screen')
        event.target.innerText = 'Exit FullScreen'
    else
        event.target.innerText = 'Full Screen'

    //logic to toogle full screen    
    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        //logic for full  screen
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        //logic for exiting full screen
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

}

const leaveRoom = () => {
    document.getElementById('go_out').click();
}


//#################### Meme API (Logic) ###################################
//#########################################################################

let prevMsgLen1 = 0;
let tag, gifs, lastTimeTyped, defaultMemes;
let typingStatus = false;
const search_memes = document.getElementById('meme_search');
const container = document.getElementById('container');


defaultMemes = container.innerHTML;

const myInterval11 = setInterval(myTimer11, 100);

function myTimer11() {
    const current_len = search_memes.value.length;
    if (current_len != prevMsgLen1) {
        //console.log('typing status:True')

        typingStatus = true;
        lastTimeTyped = Date.now();
        prevMsgLen1 = current_len;
    }
}

const myInterval22 = setInterval(myTimer22, 100);

function myTimer22() {
    if (typingStatus == true) {
        if (Date.now() - lastTimeTyped >= 700) {
            typingStatus = false;
            //console.log('typing status:False')
            container.innerHTML = '';
            container.innerHTML = `<div class="spnr"><div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading...</span></div>
          </div>`;
            // $.post("/recieved-gif", {
            //         value: search_memes.value
            //     },
            //     function(data, status) {
            //         //console.log(data);
            //     });
            $.get(`/recieved-gif/${search_memes.value}`, function(data, status) {
                showCustomMemes(data)
                    //console.log(data);
            });
        }
    }
}

const myInterval33 = setInterval(myTimer33, 1000);

function myTimer33() {
    if (search_memes.value.length == 0) {
        document.getElementById('container').innerHTML = '';
        if (defaultMemes) {
            document.getElementById('container').innerHTML = defaultMemes;
        }
    }
}



const showCustomMemes = (gifs) => {
    container.innerHTML = '';
    gifs["results"].forEach(async(element) => {
        const img = document.createElement("img");
        img.classList.add('memesCollec');
        img.addEventListener('click', memeClicked, false);
        img.classList.add("img")
        img.src = element["media"][0]["tinygif"]["url"];
        container.append(img);
    });

}


const showTrendingMemes = (data) => {
    container.innerHTML = '';
    data["tags"].forEach((element) => {
        const img = document.createElement("img");
        img.addEventListener('click', memeClicked, false);
        img.classList.add("img")
        img.src = element["image"];
        container.append(img);
    });
    defaultMemes = container.innerHTML;

}

const memeClicked = async() => {
    document.getElementById('meme_close_btn').click();
    var attribute = event.target.getAttribute("src");
    append_img('You', attribute, 'right', undefined, undefined, peerId, msg_No);
    socket.emit('send', attribute, room, 'image', msg_No);
    msg_No++;

    //console.log(attribute);
    await send_mp3.play();
};

const clearMemeField = () => {
    document.getElementById('meme_search').value = '';
}


// #############################################################
//##################     Handle popups   #######################
//##############################################################

document.getElementById('roomLink_popup').innerText = `https://sunnychatv2.herokuapp.com/room/${room}`
document.getElementById('roomId_popup').innerText = room;
const tooglePopUp_roomInfo = () => {
    let elem = document.getElementById('popup_roomInfo');
    if (elem.style.display == 'none') {
        elem.style.display = 'block';
        document.getElementById('container_m').style.filter = 'blur(5px)';

    } else {
        elem.style.display = 'none';
        document.getElementById('container_m').style.filter = '';

    }
}

const tooglePopUp_report = () => {
    let elem = document.getElementById('popup_report');
    if (elem.style.display == 'none') {
        elem.style.display = 'block';
        document.getElementById('container_m').style.filter = 'blur(5px)';
    } else {
        elem.style.display = 'none';
        document.getElementById('container_m').style.filter = '';

    }
}


// ################################
document.getElementById("container_m").onscroll = function() {
    myFunction()
};

let elem = document.getElementById("container_m")

function myFunction() {
    if (elem.scrollHeight - (elem.offsetHeight + elem.scrollTop) > 100 || elem.scrollHeight - (elem.offsetHeight + elem.scrollTop) > 100) {
        // console.log("hello");

        document.getElementById("scrollBtn").style.display = "block";

    } else {

        document.getElementById("scrollBtn").style.display = "none";


    }
}

const scrollBtn = () => {
    document.getElementById("container_m").scrollTop = document.getElementById("container_m").scrollHeight;
}

socket.on('block', (peerBlock) => {
    if (peerId == peerBlock) {
        blockedPopup();
        setTimeout(() => {
            leaveRoom();
        }, 2000);
    }
})

const blockedPopup = () => {
    document.getElementById('blockedPopup').style.display = 'block';
    document.getElementById('container_m').style.filter = 'blur(5px)';

}


//showing the room info to the user which is preparing to join..
const roomUsers = () => {
    $.post('/getuser', { room: room }, (result, status) => {
        console.log(result);
        if (result.result == 0) {
            document.getElementById('usersListFromFE').innerHTML = ` <div style="text-align: center;font-size: 145%;background: #154f73;color: aliceblue;">No Users inside this room </div>`
        } else {
            const str1 = `<div style=" background: #233d4c;">  <div style="text-align: center;font-size: 145%;background: #154f73;color: aliceblue;">Users inside room </div> <div style="display: flex;font-size: 130%;  width: 100%; overflow: auto; background: #233d4c; color: white; font-size: 90%; ">`
            const str3 = `</div></div></div>`
            let str2 = ``;
            for (let e in result.result) {
                str2 += `<div class="user" style=" margin: 0px 17px;text-align: center;"> <img class="imgUser" src=${e.dp} alt=""> <p>${e.name}</p>  </div>`;
            }
            document.getElementById('usersListFromFE').innerHTML = str1 + str2 + str3;
        }

    })
}
roomUsers();


const dynamicPopup = (message, messageHeader, pic) => {
    let elem = document.createElement("div");
    elem.classList.add('dynamicPopup');
    let popup = '';
    if (pic)
        popup = `<div style="position: relative;background: #e0c8c8; text-align: center; padding: 35px 10px;top: 20%;border-radius: 14px;width: 282px;margin: auto;"><img src=${pic} alt="" style=" width: 100px;height: 100px;object-fit: cover; border-radius: 4px;"> <div style="font-size: 125%;margin: 15px 0px;">${messageHeader}</div> <div>${message}</div></div> `;
    else
        popup = `<div style="position: relative;background: #e0c8c8; text-align: center; padding: 35px 10px;top: 20%;border-radius: 14px;width: 282px;margin: auto;"> <div style="font-size: 125%;margin: 15px 0px;">${messageHeader}</div> <div>${message}</div></div> `;

    elem.innerHTML = popup;
    document.body.append(elem);
    setTimeout(() => {
        elem.remove();
    }, 2200)
}
