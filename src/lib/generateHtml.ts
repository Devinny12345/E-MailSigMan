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

function proxyUrl(url: string, baseUrl: string): string {
  if (!url || !url.includes("blob.vercel-storage.com")) return url;
  return `${baseUrl}/api/serve-image/${encodeURIComponent(url)}`;
}

export function generateSignatureHtml(sig: SignatureData, baseUrl: string): string {
  const gifUrl = `${baseUrl}/api/serve-gif/${sig.id}`;

  const socialIcons = `
          <td width="110" valign="middle">
            ${sig.facebookUrl ? `<a href="${sig.facebookUrl}" style="text-decoration:none; display:inline-block; margin-right:6px;">
              <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                <circle cx="13" cy="13" r="13" fill="#1877F2"/>
                <path d="M15.4 8.6h1.6V5.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.1H8.3v3h2.6v7.1h3.1v-7.1h2.5l.4-3h-2.9v-1.9c0-.9.2-1.4 1.4-1.4Z" fill="#ffffff"/>
              </svg>
            </a>` : ""}
            ${sig.instagramUrl ? `<a href="${sig.instagramUrl}" style="text-decoration:none; display:inline-block; margin-right:6px;">
              <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#FEDA75"/>
                    <stop offset="35%" stop-color="#D62976"/>
                    <stop offset="70%" stop-color="#962FBF"/>
                    <stop offset="100%" stop-color="#4F5BD5"/>
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="26" height="26" rx="7" fill="url(#igGrad)"/>
                <rect x="6.5" y="6.5" width="13" height="13" rx="4" fill="none" stroke="#ffffff" stroke-width="1.6"/>
                <circle cx="13" cy="13" r="3.4" fill="none" stroke="#ffffff" stroke-width="1.6"/>
                <circle cx="17.3" cy="8.7" r="1" fill="#ffffff"/>
              </svg>
            </a>` : ""}
            ${sig.youtubeUrl ? `<a href="${sig.youtubeUrl}" style="text-decoration:none; display:inline-block;">
              <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="3" width="26" height="20" rx="5" fill="#FF0000"/>
                <path d="M11 8.5 17.5 13 11 17.5Z" fill="#ffffff"/>
              </svg>
            </a>` : ""}
          </td>`;

  return `<table cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; font-family:Arial, Helvetica, sans-serif; background-color:#0d3b66;">
  <tr>
    <td colspan="3" style="padding:20px 24px 16px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          ${sig.companyLogoUrl ? `<td width="150" valign="middle">
            <a href="${sig.landingPageUrl || '#'}" style="text-decoration:none;">
              <img src="${sig.companyLogoUrl}" width="130" height="90" alt="Company Logo" style="display:block; border:1px solid #2f5f8f; border-radius:14px; width:130px; height:90px; object-fit:contain; background-color:#ffffff;" />
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
                  ${sig.website ? `&nbsp;&nbsp;&#127760; <a href="https://${sig.website}" style="color:#ffffff; text-decoration:none;">${sig.website}</a>` : ""}
                </td>
              </tr>
              ${sig.address ? `<tr>
                <td style="font-size:13px; line-height:20px; color:#ffffff;">
                  &#128205; ${sig.address}
                </td>
              </tr>` : ""}
            </table>
          </td>

          ${sig.avatarUrl ? `<td width="100" valign="middle" style="text-align:right;">
            <img src="${sig.avatarUrl}" width="90" height="90" alt="${sig.name}" style="display:inline-block; border:2px solid #ffffff; border-radius:16px; width:90px; height:90px; object-fit:cover; background-color:#ffffff;" />
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
