/**
 * Сервис отправки писем для приложения «Предписания СП».
 * Работает в вашем Google-аккаунте и отправляет письма с вашего Gmail.
 * 1) script.google.com → «Новый проект» → вставьте этот код целиком вместо того, что там есть.
 * 2) Замените ТОКЕН ниже на любой свой набор букв и цифр (его же впишете в приложении в поле «Код доступа»).
 * 3) «Начать развертывание» → «Новое развертывание» → тип «Веб-приложение»:
 *    «Запуск от имени» — Я, «У кого есть доступ» — Все. Нажмите «Начать развертывание», разрешите доступ к Gmail.
 * 4) Скопируйте «URL веб-приложения» (заканчивается на /exec) в приложение: ⚙ → Почта → «Ссылка сервиса отправки».
 */
const TOKEN = 'ЗАМЕНИТЕ-НА-СВОЙ-КОД';

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.token !== TOKEN) return out_({ ok: false, error: 'неверный код доступа' });
    if (!d.to) return out_({ ok: false, error: 'не указан адресат' });
    const files = (d.files || []).map(function (f) {
      return Utilities.newBlob(Utilities.base64Decode(f.data), f.type || 'application/octet-stream', f.name);
    });
    const opt = { name: 'Предписания СП', attachments: files };
    if (d.cc) opt.cc = d.cc;
    MailApp.sendEmail(d.to, d.subject || 'Предписание', d.body || '', opt);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function doGet() { return out_({ ok: true, service: 'predpisaniya-mail' }); }

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
