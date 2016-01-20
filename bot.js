var requestify = require('requestify'),
    word = require('./word.js'),
    config  = require('./config.js');
function get_messages() {
    requestify.post('https://api.vk.com/method/messages.get?filters=1&access_token='+config.token+'&v=5', {})
        .then(function(response) {
            data = JSON.parse(response.body);
            var count = data.response.count;
            console.log("Кол-во сообщений : "+ count);
            for (var i = 0; i < count; i++) {
                var id = data.response.items[i].id;
                var message = data.response.items[i].body;
                var user_id = data.response.items[i].user_id;
                if (message.toLowerCase().indexOf('Привет'.toLowerCase()) == 0) {
                    send_message(hi(), user_id, id);
                }
				else if (message.toLowerCase().indexOf('Как дела ?'.toLowerCase()) == 0) {
                    send_message(kakdela(), user_id, id);
                }
                else if (message.toLowerCase()== 'Погода'.toLowerCase()) {
                   weather(user_id, id);
                }else
				{  send_message('Я не понял. Я робот. Я понимаю только: '+config.komands+'', user_id, id);}	
            }
        });
}
setInterval(get_messages, 10000);
function kakdela() {
    var kakdela = word.kakdela;
    var number = getRandom(0,kakdela.length);
	var kakdela_message = kakdela[number]
    return kakdela_message;
}

function hi() {
    var hi = word.hi;
    var number = getRandom(0,hi.length);
	var hi_message = hi[number]
    return hi_message;
}
function weather(user_id, id) {
    requestify.get(config.site+'?weather=1', { })
        .then(function(response) {
data = response.body;
send_message(data, user_id, id);
        });
}

function getRandom(min, max)
{
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

function send_message(texts, user_id, id) {
    console.log('Отправили : ' + texts);
    requestify.post('https://api.vk.com/method/messages.send?user_id=' + user_id + '&message=' + texts + '&access_token='+config.token+'&v=5.42', {})
        .then(function(response) {
            data = JSON.parse(response.body);
            
        });
}
function newstatus(time) {
    console.log(time);
    requestify.post('https://api.vk.com/method/status.set?text=' + time + '&access_token='+config.token+'&v=5', { })
        .then(function(response) {
            data = JSON.parse(response.body);
            var messages = data.response;
            var count = 0;
            for (var k in messages) {
                if (messages.hasOwnProperty(k)) {
                    ++count;
                }

            }
        });
}
function clock() {
    var d = new Date();
    var month_num = d.getMonth()
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();

    month = new Array("января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря");

    if (day <= 9) day = "0" + day;
    if (hours <= 9) hours = "0" + hours;
    if (minutes <= 9) minutes = "0" + minutes;
    if (seconds <= 9) seconds = "0" + seconds;

    date_time = "Сегодня - " + day + " " + month[month_num] + " " + d.getFullYear() +
        " г. Текущее время - " + hours + ":" + minutes + ":" + seconds;

    newstatus(date_time);
}



function textcase(i, words) {
  if (typeof words === 'string') words = words.split(' ')

  var w;
  if (i > 4 && i < 21) {
      w = words[2];
  } else {
      var m = i % 10;
      if (m == 1) {
          w = words[0];
      } else if (m > 1 && m < 5) {
          w = words[1];
      } else {
          w = words[2];
      }
  }

  return i + ' ' + w;
}