import { ELang } from '../enum/base';
import utils from 'src/utils';

export const getEmailResetPasswordTemplate = (langCode: ELang, customerName: string, url: string) => {
  const lang = utils.getLang(langCode);

  return ` <div
  style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
  "
>
  <p>${lang.email.common.greeting}, <strong>${customerName}</strong></p>
  <p>${lang.email.resetPassword.message}</p>
  <div
    style="
      max-width: max-content;
      padding: 10px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
    "
  >
    <a href=${url}>${url}</a>
  </div>
  <p style="color: #dd4e4e; font-style: italic">
    (${lang.email.resetPassword.note})
  </p>
</div>`;
};
