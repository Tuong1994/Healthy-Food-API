import { ELang } from 'src/common/enum/base';
import { EmailContactDto } from '../email.dto';
import utils from 'src/utils';

export const getEmailContactTemplate = (langCode: ELang, data: EmailContactDto) => {
  const lang = utils.getLang(langCode);
  const { fullName, phone, email } = data;
  
  return `<div
   style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
  "
>
  <p>${lang.email.common.greeting}, <strong>${fullName}</strong></p>
  <p>${lang.email.contact.appreciate}</p>
  <p>${lang.email.common.content}</p>
  <div style="padding-left: 20px">
    <div
        style="
          max-width: max-content;
          padding: 10px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
        "
      >
    <div style="display: flex; align-items: center">
      <span style="width: 100px; margin-right: 10px">${lang.email.label.customerName}:</span>
      <strong>${fullName}</strong>
    </div>
    <div style="display: flex; align-items: center">
      <span style="width: 100px; margin-right: 10px">${lang.email.label.email}:</span>
      <strong>${email}</strong>
    </div>
    <div style="display: flex; align-items: center">
      <span style="width: 100px; margin-right: 10px">${lang.email.label.phone}:</span>
      <strong>${utils.formatPhoneNumber(phone)}</strong>
    </div>
    </div>
  </div>
</div>`;
};
