export interface SignatureData {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatarUrl: string;
  loopingGifUrl: string;
  landingPageUrl: string;
  tag: string;
  isActive: boolean;
  companyLogoUrl: string;
  website: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  taglineLine1: string;
  taglineLine2: string;
}

function imgRoute(id: string, type: string, baseUrl: string): string {
  return `${baseUrl}/img/${id}/${type}`;
}

function socialIcon(href: string, bgColor: string, label: string): string {
  return `<a href="${href}" target="_blank" style="text-decoration:none; display:inline-block; margin-right:6px;">
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0;">
      <tr>
        <td width="26" height="26" align="center" valign="middle" style="background-color:${bgColor}; border-radius:13px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; color:#ffffff; line-height:26px; text-align:center;">
          ${label}
        </td>
      </tr>
    </table>
  </a>`;
}

export function generateSignatureHtml(sig: SignatureData, baseUrl: string): string {
  const logoSrc = sig.companyLogoUrl ? imgRoute(sig.id, "logo", baseUrl) : "";
  const avatarSrc = sig.avatarUrl ? imgRoute(sig.id, "avatar", baseUrl) : "";
  const avatarLink = sig.landingPageUrl || `mailto:${sig.email}`;
  const gifSrc = sig.loopingGifUrl ? imgRoute(sig.id, "gif", baseUrl) : `${baseUrl}/api/serve-gif/${sig.id}`;

  const socialIcons = `
          <td width="110" valign="middle">
            ${sig.facebookUrl ? socialIcon(sig.facebookUrl, "#1877F2", "f") : ""}
            ${sig.instagramUrl ? socialIcon(sig.instagramUrl, "#E4405F", "ig") : ""}
            ${sig.youtubeUrl ? socialIcon(sig.youtubeUrl, "#FF0000", "▶") : ""}
          </td>`;

  return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; font-family:Arial, Helvetica, sans-serif; background-color:#0d3b66;">
  <tr>
    <td colspan="3" style="padding:20px 24px 16px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          ${logoSrc ? `<td width="150" valign="middle">
            <a href="${sig.landingPageUrl || '#'}" target="_blank" style="text-decoration:none;">
              <img src="${logoSrc}" width="130" height="90" alt="Company Logo" style="display:block; border:1px solid #2f5f8f; border-radius:14px; width:130px; height:90px; object-fit:contain; background-color:#ffffff;" />
            </a>
          </td>` : ""}

          <td valign="top" style="padding:0 15px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-size:26px; line-height:28px; font-weight:bold; color:#ffffff; padding-bottom:2px;">
                  ${sig.name}
                </td>
              </tr>
              <tr>
                <td style="font-size:14px; line-height:18px; color:#a9c6e0; padding-bottom:6px;">
                  ${sig.title}
                </td>
              </tr>
              <tr>
                <td style="border-top:2px solid #7bb32e; font-size:1px; line-height:1px; padding:0;">&nbsp;</td>
              </tr>
              <tr><td style="height:8px; line-height:8px; font-size:1px;">&nbsp;</td></tr>
              <tr>
                <td style="font-size:13px; line-height:20px; color:#ffffff;">
                  &#128222; ${sig.phone}
                </td>
              </tr>
              <tr>
                <td style="font-size:13px; line-height:20px; color:#ffffff;">
                  &#9993; <a href="mailto:${sig.email}" style="color:#ffffff; text-decoration:none;">${sig.email}</a>
                  ${sig.website ? `&nbsp;&nbsp;&#127760; <a href="https://${sig.website}" target="_blank" style="color:#ffffff; text-decoration:none;">${sig.website}</a>` : ""}
                </td>
              </tr>
              ${sig.address ? `<tr>
                <td style="font-size:13px; line-height:20px; color:#ffffff;">
                  &#128205; ${sig.address}
                </td>
              </tr>` : ""}
            </table>
          </td>

          ${avatarSrc ? `<td width="100" valign="middle" style="text-align:right;">
            <a href="${avatarLink}" target="_blank" style="text-decoration:none;">
              <img src="${avatarSrc}" width="90" height="90" alt="${sig.name}" style="display:inline-block; border:2px solid #ffffff; border-radius:16px; width:90px; height:90px; object-fit:cover; background-color:#ffffff;" />
            </a>
          </td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top:2px solid #2f5f8f; font-size:1px; line-height:1px; padding:0;">&nbsp;</td>
  </tr>
  <tr>
    <td colspan="3" style="padding:14px 24px 20px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          ${socialIcons}
          <td valign="middle" style="text-align:right;">
            ${sig.taglineLine1 ? `<div style="font-size:14px; color:#a9c6e0; line-height:16px;">${sig.taglineLine1}</div>` : ""}
            ${sig.taglineLine2 ? `<div style="font-size:18px; font-weight:bold; color:#ffffff; line-height:20px;">${sig.taglineLine2}</div>` : ""}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
