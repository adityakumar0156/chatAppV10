const express = require('express');
const app = express();
const server = require('http').Server(app);
const request = require('request');
const bodyParser = require('body-parser');
const anonym = require('./files/anonymous.js');

var ExpressPeerServer = require('peer').ExpressPeerServer;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var options = {
    debug: true,
    allow_discovery: true
}

app.set('view engine', 'ejs');


// peerjs is the path that the peerjs server will be connected to.
app.use('/peerjs', ExpressPeerServer(server, options));

app.use('/static', express.static('static'));

let roomGmails = {};
let blockedGmailObj = {};
let room_char_list = {};
let room_name_dp = {};

const containsGmail = (roomVal, gmail) => {
    let arr = roomGmails[roomVal];
    for (let i in arr) {
        if (arr[i] == gmail) return true;
    }
    return false;
}

const blockedGmail = (roomVal, gmail) => {
    let arr = blockedGmailObj[roomVal];
    for (let i in arr) {
        if (arr[i] == gmail) return true;
    }
    return false;
}


const getChar = (roomid) => { //joining k waqt
    let arr = room_char_list[roomid];
    if (arr) {} else {
        room_char_list[roomid] = [...anonym.anonymous_name];
    }
    arr = room_char_list[roomid];
    if (arr.length == 0) return "-1";
    const char = arr[Math.floor(Math.random() * arr.length)];
    let dp = anonym.anonymous_dp[char];
    if (char == 'Doge Builder' || char == 'Cheems Vidhayak') {
        dp = dp.replace(".", `${Math.floor(Math.random() * 6)}.`)
    }
    return { character: char, dp: dp };
}

const popChar = (roomid, char) => { // joinig k baad
    const arr = room_char_list[roomid];
    const index = arr.indexOf(char);
    if (index > -1) {
        arr.splice(index, 1); // 2nd parameter means remove one item only
        return "1";
    }
    return "-1";

}

const pushChar = (roomid, char) => { //leaving k waqt
    room_char_list[roomid].push(char);

}



// ################################################################
// ########################  Server Routes  #######################
// ################################################################

app.post('/getchar', (req, res) => {
    const obj = getChar(req.body.room);
    if (obj == "-1") res.json({ status: "error" })
    else res.json({ name: obj.character, dp: obj.dp, list: room_char_list, status: "success" });
})
app.post('/popchar', (req, res) => {
    console.log("Called: /popchar ");
    const val = popChar(req.body.room, req.body.name);
    if (val == "1") res.json({ status: "success" })
    else res.json({ status: "error" })
})
app.post('/pushchar', (req, res) => {
    console.log("Called: /pushchar");
    const val = pushChar(req.body.room, req.body.name);
    res.json({ status: "success" });
})

app.post('/checkchar', (req, res) => {
    console.log("Called: /checkchar");
    const char = req.body.char;
    const room = req.body.room;
    if (room_char_list[room]) {
        for (let c in room_char_list[room]) {
            if (room_char_list[room][c] == char) {
                res.json({ status: "available" });
                return;
            }
        }
        res.json({ status: "not-available" });
    } else {
        res.json({ status: "available" });

    }
})

app.post('/removegmail', (req, res) => {
    console.log("Called:/removegmail")
    let gmail = req.body.gmail;
    let arr = roomGmails[req.body.room];
    console.log(arr);
    const index = arr.indexOf(gmail);
    console.log(index, gmail);
    if (index > -1) {
        arr.splice(index, 1);
        res.json({ status: "success" });
    } else {
        console.log(arr);
        res.json({ status: "RESULT:failed(/removegmail)" });
    }
})

app.post('/pushgmail', (req, res) => {
    console.log("Called:/pushgmail");
    //append this gmail
    let gmail = req.body.gmail;
    let room = req.body.room;
    if (roomGmails[room]) {
        roomGmails[room] = [];
        roomGmails[room].push(gmail);
    } else {
        roomGmails[room] = [gmail];
    }
    console.log(roomGmails);
    res.json({ status: "success" });
})
app.post('/cleanroom', (req, res) => {
    console.log("Called:/cleanroom")
    let room = req.body.room
    delete roomGmails[room];
    delete blockedGmailObj[room];
    res.json({ status: "success" });
})

app.post('/blockgmail', (req, res) => {
    console.log("Called: /blockgmail")
    let gmail = req.body.gmail;
    let roomVal = req.body.room;
    if (blockedGmailObj[roomVal]) {
        blockedGmailObj[roomVal].push(gmail);
    } else {
        blockedGmailObj[roomVal] = [gmail];
    }
    console.log(blockedGmailObj[roomVal]);
    res.json({ status: "success" })
})

app.post('/adduser', (req, res) => {
    const room = req.body.room;
    const name = req.body.name;
    const dp = req.body.dp;
    const key = req.body.key;
    if (room_name_dp[room]) {
        room_name_dp[room].push({ name: name, dp: dp, key: key });
        res.json({ message: "user pushed  to FE successfully" });
    } else {
        room_name_dp[room] = [{ name: name, dp: dp, key: key }];
        res.json({ message: "user added  to FE successfully" });
    }
    console.log("Called: /adduser", room_name_dp[room], { room: room });
});

app.post('/removeuser', (req, res) => {
    const room = req.body.room;
    const key = req.body.key;
    //removing a particular user form the user list
    if (room_name_dp[room]) {
        for (let u in room_name_dp[room]) {
            if (room_name_dp[room][u].key == key) {
                room_name_dp[room].splice(u, 1);
                res.json({ status: 'success', message: 'user removed successfully' });
                break;
            }
        }
    } else { //room is empty 
        res.json({ message: "Error (/removeuser called but no one is in the room)" })
    }
    console.log("Called: /removeuser");
});

app.post('/getuser', (req, res) => {
    console.log("Called : /getuser");
    const room = req.body.room;
    if (room_name_dp[room]) {
        res.json({ status: "success", result: room_name_dp[room] })

    } else {
        res.json({ status: "success", result: 0 })

    }
})


app.post('/room', (req, res) => {
    console.log("\n\n##### START #####\n called:/room")
    const name = req.body.name;
    const dp = req.body.dp;
    const room = req.body.room;
    const gmail = req.body.gmail;
    console.log(blockedGmail(room, gmail), containsGmail(room, gmail));
    if (blockedGmail(room, gmail) || containsGmail(room, gmail)) {

        res.render('denied.ejs', { name: name, room: room, dp: dp, gmail: gmail });

    } else {

        console.log("name:", name, " dp:", dp, " Room: ", room, "gmail:", gmail);
        res.render('index.ejs', { name: name, room: room, dp: dp, gmail: gmail });

    }
})

app.get('/', (req, res) => {
    res.render('leave.ejs', { room: "" });
})

app.get('/trending-memes', (req, resp) => {
    console.log('on trending memes route');
    request(`https://g.tenor.com/v1/categories?key=58MHVZMINMH9`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        resp.json(body);
    });

})

app.get('/recieved-gif', (req, resp) => {

})
app.get('/room/:room', (req, res) => {
    res.render('leave2.ejs', { room: req.params["room"] });

})
app.get('/recieved-gif/:value', (req, resp) => {
    console.log('custom gif:', req.body);
    request(`https://g.tenor.com/v1/search?q=${req.params['value']}&key=58MHVZMINMH9&limit=36`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        resp.json(body);

    });
})

app.post('/recieved-gif', (req, resp) => {
    console.log(req.body);
    request(`https://g.tenor.com/v1/search?q=${req}&key=58MHVZMINMH9&limit=25`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        resp.json(body);

    });
})




server.listen(process.env.PORT || 8887, () => {
    console.log("App is listening at port 8887")
})