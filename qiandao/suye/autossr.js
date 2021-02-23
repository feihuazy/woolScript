let $tool = init();
const dataInfo = [
    {
        host: 'https://233yun.xyz',
        email: 'imissyoukiss7@gmail.com',
        passwd: 'imissyoukiss6',
    },
    {
        host: 'https://jsqpro.link',
        email: 'imissyoukiss7@gmail.com',
        passwd: 'imissyoukiss6',
    }
];
let reg = new RegExp("https?://", "g");

login();

async function login() {
    let text = '';
    for (let i = 0; i < dataInfo.length; i++) {
        let info = dataInfo[i];
        text += '\r\n' + await getData(info);
    }
    $tool.msg('SSR签到', '签到' + dataInfo.length + '个成功', text);
    $tool.done({});
}

function getData(info) {
    let host = info.host;
    let body = 'email=' + encodeURIComponent(info.email) + '&passwd=' + info.passwd;
    let headers = {
        'Host': host.replace(reg, ''),
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': host,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/88.0.4324.111 Mobile/15E148 Safari/604.1',
        'Connection': 'keep-alive',
        'Content-Length': '52'
    }
    let request = {
        url: host + '/auth/login',
        headers: headers,
        body: body
    }
    return new Promise(resolve => {
        try {
            $tool.post(request, (err, res, data) => {
                let checkin = {
                    url: host + '/user/checkin',
                    headers: headers,
                }
                $tool.post(checkin, (err, res, data) => {
                    try {
                        console.log(data);
                        let json = JSON.parse(data);
                        resolve(host + ':' + json.msg);
                    } catch (e) {
                        console.log(data);
                        resolve('失败');
                    }
                });
            });
        } catch (e) {
            console.log(data);
            resolve('失败');
        }
    })
}

function init() {
    const isSurge = typeof $httpClient != 'undefined';
    const isQuanX = typeof $task != 'undefined';
    const read = (key) => {
        if (isSurge) return $persistentStore.read(key);
        if (isQuanX) return $prefs.valueForKey(key);
    }
    const write = (key, val) => {
        if (isSurge) return $persistentStore.write(key, val);
        if (isQuanX) return $prefs.setValueForKey(key, val);
    }
    const msg = (title, subtitle, body) => {
        if (isSurge) $notification.post(title, subtitle, body);
        if (isQuanX) $notify(title, subtitle, body);
    }
    const log = (message) => console.log(message);
    const get = (url, cb) => {
        if (isSurge) {
            $httpClient.get(url, cb);
        }
        if (isQuanX) {
            url.method = 'GET';
            $task.fetch(url).then((resp) => cb(null, {}, resp.body));
        }
    }
    const post = (url, cb) => {
        if (isSurge) {
            $httpClient.post(url, cb);
        }
        if (isQuanX) {
            url.method = 'POST';
            $task.fetch(url).then((resp) => cb(null, {}, resp.body));
        }
    }
    const put = (url, cb) => {
        if (isSurge) {
            $httpClient.put(url, cb);
        }
        if (isQuanX) {
            url.method = 'PUT';
            $task.fetch(url).then((resp) => cb(null, {}, resp.body));
        }
    }
    const done = (value = {}) => {
        $done(value);
    }
    return {isSurge, isQuanX, msg, log, read, write, get, post, put, done}
}
