var config = require('./config.js');
var utils = require('./utils.js');

function supportLanguages() {
    return config.supportedLanguages.map(([standardLang]) => standardLang);
}

function tts(query, completion) {
    (async () => {
        const targetLanguage = utils.langMap.get(query.lang);
        if (!targetLanguage) {
            const err = new Error();
            Object.assign(err, {
                _type: 'unsupportedLanguage',
                _message: '不支持该语种',
            });
            throw err;
        }
        try {
            const resp = await $http.request({
                method: "POST",
                url: query.server,
                header: {
                    "Content-Type": "application/json",
                },
                body: {
                    voice: $option[targetLanguage + '-speaker'],
                    text: query.text,
                }
            });
            const audio = $data.fromData(resp.rawData);
            completion({
                result: {
                    "type": "base64",
                    "data": audio.toBase64(),
                    "raw": {}
                }
            });
        } catch (e) {
            $log.error(e)
        }
    })().catch((error) => {
        $log.error(error);
        completion({
            error: {
                _type: error._type || 'ttsError',
                _message: error._message || '发生错误',
                addtion: err._addtion,
            }
        });
    });
}

exports.supportLanguages = supportLanguages;
exports.tts = tts;
