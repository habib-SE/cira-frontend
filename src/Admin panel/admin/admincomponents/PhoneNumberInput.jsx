import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const PhoneNumberInput = ({ value, onChange, error, placeholder = "Phone Number" }) => {
  const [formattedValue, setFormattedValue] = useState(value);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    flag: 'https://flagcdn.com/w20/us.png'
  });

  // Country-specific digit limits and formatting
  const getCountryInfo = (countryCode) => {
    const countryLimits = {
      'US': { digits: 10, format: 'XXX-XXX-XXXX' },
      'CA': { digits: 10, format: 'XXX-XXX-XXXX' },
      'GB': { digits: 10, format: 'XXXX XXX XXX' },
      'AU': { digits: 9, format: 'XXXX XXX XXX' },
      'DE': { digits: 11, format: 'XXX XXXXXXXX' },
      'FR': { digits: 9, format: 'XX XX XX XX XX' },
      'IT': { digits: 10, format: 'XXX XXX XXXX' },
      'ES': { digits: 9, format: 'XXX XX XX XX' },
      'PK': { digits: 10, format: 'XXX-XXXXXXX' }, // Pakistan
      'IN': { digits: 10, format: 'XXXXX XXXXX' }, // India
      'BD': { digits: 10, format: 'XXXX-XXXXXX' }, // Bangladesh
      'CN': { digits: 11, format: 'XXX XXXX XXXX' }, // China
      'JP': { digits: 10, format: 'XX-XXXX-XXXX' }, // Japan
      'KR': { digits: 10, format: 'XXX-XXXX-XXXX' }, // South Korea
      'BR': { digits: 10, format: 'XX XXXXX-XXXX' }, // Brazil
      'MX': { digits: 10, format: 'XXX XXX XXXX' }, // Mexico
      'RU': { digits: 10, format: 'XXX XXX-XX-XX' }, // Russia
      'SA': { digits: 9, format: 'XXX XXX XXX' }, // Saudi Arabia
      'AE': { digits: 9, format: 'XX XXX XXXX' }, // UAE
      'EG': { digits: 10, format: 'XXX XXX XXXX' }, // Egypt
      'ZA': { digits: 9, format: 'XX XXX XXXX' }, // South Africa
      'NG': { digits: 10, format: 'XXX XXX XXXX' }, // Nigeria
      'KE': { digits: 9, format: 'XXX XXX XXX' }, // Kenya
      'TR': { digits: 10, format: 'XXX XXX XX XX' }, // Turkey
      'IR': { digits: 10, format: 'XXX XXX XXXX' }, // Iran
      'IQ': { digits: 10, format: 'XXX XXX XXXX' }, // Iraq
      'JO': { digits: 9, format: 'XX XXX XXXX' }, // Jordan
      'LB': { digits: 8, format: 'XX XXX XXX' }, // Lebanon
      'SY': { digits: 9, format: 'XXX XXX XXX' }, // Syria
      'IL': { digits: 9, format: 'XX-XXX-XXXX' }, // Israel
      'PS': { digits: 9, format: 'XX XXX XXXX' }, // Palestine
    };
    return countryLimits[countryCode] || { digits: 10, format: 'XXX XXX XXXX' };
  };

  // Comprehensive country list with flag images
  const countries = [
    { code: 'US', name: 'United States', dialCode: '+1', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: 'https://flagcdn.com/w20/ca.png' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: 'https://flagcdn.com/w20/au.png' },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: 'https://flagcdn.com/w20/de.png' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'IT', name: 'Italy', dialCode: '+39', flag: 'https://flagcdn.com/w20/it.png' },
    { code: 'ES', name: 'Spain', dialCode: '+34', flag: 'https://flagcdn.com/w20/es.png' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: 'https://flagcdn.com/w20/nl.png' },
    { code: 'BE', name: 'Belgium', dialCode: '+32', flag: 'https://flagcdn.com/w20/be.png' },
    { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: 'https://flagcdn.com/w20/ch.png' },
    { code: 'AT', name: 'Austria', dialCode: '+43', flag: 'https://flagcdn.com/w20/at.png' },
    { code: 'SE', name: 'Sweden', dialCode: '+46', flag: 'https://flagcdn.com/w20/se.png' },
    { code: 'NO', name: 'Norway', dialCode: '+47', flag: 'https://flagcdn.com/w20/no.png' },
    { code: 'DK', name: 'Denmark', dialCode: '+45', flag: 'https://flagcdn.com/w20/dk.png' },
    { code: 'FI', name: 'Finland', dialCode: '+358', flag: 'https://flagcdn.com/w20/fi.png' },
    { code: 'PL', name: 'Poland', dialCode: '+48', flag: 'https://flagcdn.com/w20/pl.png' },
    { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: 'https://flagcdn.com/w20/cz.png' },
    { code: 'HU', name: 'Hungary', dialCode: '+36', flag: 'https://flagcdn.com/w20/hu.png' },
    { code: 'RO', name: 'Romania', dialCode: '+40', flag: 'https://flagcdn.com/w20/ro.png' },
    { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: 'https://flagcdn.com/w20/bg.png' },
    { code: 'HR', name: 'Croatia', dialCode: '+385', flag: 'https://flagcdn.com/w20/hr.png' },
    { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: 'https://flagcdn.com/w20/si.png' },
    { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: 'https://flagcdn.com/w20/sk.png' },
    { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: 'https://flagcdn.com/w20/lt.png' },
    { code: 'LV', name: 'Latvia', dialCode: '+371', flag: 'https://flagcdn.com/w20/lv.png' },
    { code: 'EE', name: 'Estonia', dialCode: '+372', flag: 'https://flagcdn.com/w20/ee.png' },
    { code: 'IE', name: 'Ireland', dialCode: '+353', flag: 'https://flagcdn.com/w20/ie.png' },
    { code: 'PT', name: 'Portugal', dialCode: '+351', flag: 'https://flagcdn.com/w20/pt.png' },
    { code: 'GR', name: 'Greece', dialCode: '+30', flag: 'https://flagcdn.com/w20/gr.png' },
    { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: 'https://flagcdn.com/w20/cy.png' },
    { code: 'MT', name: 'Malta', dialCode: '+356', flag: 'https://flagcdn.com/w20/mt.png' },
    { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: 'https://flagcdn.com/w20/lu.png' },
    { code: 'IS', name: 'Iceland', dialCode: '+354', flag: 'https://flagcdn.com/w20/is.png' },
    { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: 'https://flagcdn.com/w20/li.png' },
    { code: 'MC', name: 'Monaco', dialCode: '+377', flag: 'https://flagcdn.com/w20/mc.png' },
    { code: 'SM', name: 'San Marino', dialCode: '+378', flag: 'https://flagcdn.com/w20/sm.png' },
    { code: 'VA', name: 'Vatican City', dialCode: '+379', flag: 'https://flagcdn.com/w20/va.png' },
    { code: 'AD', name: 'Andorra', dialCode: '+376', flag: 'https://flagcdn.com/w20/ad.png' },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: 'https://flagcdn.com/w20/jp.png' },
    { code: 'KR', name: 'South Korea', dialCode: '+82', flag: 'https://flagcdn.com/w20/kr.png' },
    { code: 'CN', name: 'China', dialCode: '+86', flag: 'https://flagcdn.com/w20/cn.png' },
    { code: 'IN', name: 'India', dialCode: '+91', flag: 'https://flagcdn.com/w20/in.png' },
    { code: 'TH', name: 'Thailand', dialCode: '+66', flag: 'https://flagcdn.com/w20/th.png' },
    { code: 'SG', name: 'Singapore', dialCode: '+65', flag: 'https://flagcdn.com/w20/sg.png' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: 'https://flagcdn.com/w20/my.png' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: 'https://flagcdn.com/w20/id.png' },
    { code: 'PH', name: 'Philippines', dialCode: '+63', flag: 'https://flagcdn.com/w20/ph.png' },
    { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: 'https://flagcdn.com/w20/vn.png' },
    { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: 'https://flagcdn.com/w20/tw.png' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: 'https://flagcdn.com/w20/hk.png' },
    { code: 'MO', name: 'Macau', dialCode: '+853', flag: 'https://flagcdn.com/w20/mo.png' },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: 'https://flagcdn.com/w20/br.png' },
    { code: 'AR', name: 'Argentina', dialCode: '+54', flag: 'https://flagcdn.com/w20/ar.png' },
    { code: 'CL', name: 'Chile', dialCode: '+56', flag: 'https://flagcdn.com/w20/cl.png' },
    { code: 'CO', name: 'Colombia', dialCode: '+57', flag: 'https://flagcdn.com/w20/co.png' },
    { code: 'PE', name: 'Peru', dialCode: '+51', flag: 'https://flagcdn.com/w20/pe.png' },
    { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: 'https://flagcdn.com/w20/ve.png' },
    { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: 'https://flagcdn.com/w20/ec.png' },
    { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: 'https://flagcdn.com/w20/bo.png' },
    { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: 'https://flagcdn.com/w20/py.png' },
    { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: 'https://flagcdn.com/w20/uy.png' },
    { code: 'GY', name: 'Guyana', dialCode: '+592', flag: 'https://flagcdn.com/w20/gy.png' },
    { code: 'SR', name: 'Suriname', dialCode: '+597', flag: 'https://flagcdn.com/w20/sr.png' },
    { code: 'GF', name: 'French Guiana', dialCode: '+594', flag: 'https://flagcdn.com/w20/gf.png' },
    { code: 'FK', name: 'Falkland Islands', dialCode: '+500', flag: 'https://flagcdn.com/w20/fk.png' },
    { code: 'MX', name: 'Mexico', dialCode: '+52', flag: 'https://flagcdn.com/w20/mx.png' },
    { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: 'https://flagcdn.com/w20/gt.png' },
    { code: 'BZ', name: 'Belize', dialCode: '+501', flag: 'https://flagcdn.com/w20/bz.png' },
    { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: 'https://flagcdn.com/w20/sv.png' },
    { code: 'HN', name: 'Honduras', dialCode: '+504', flag: 'https://flagcdn.com/w20/hn.png' },
    { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: 'https://flagcdn.com/w20/ni.png' },
    { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: 'https://flagcdn.com/w20/cr.png' },
    { code: 'PA', name: 'Panama', dialCode: '+507', flag: 'https://flagcdn.com/w20/pa.png' },
    { code: 'CU', name: 'Cuba', dialCode: '+53', flag: 'https://flagcdn.com/w20/cu.png' },
    { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: 'https://flagcdn.com/w20/jm.png' },
    { code: 'HT', name: 'Haiti', dialCode: '+509', flag: 'https://flagcdn.com/w20/ht.png' },
    { code: 'DO', name: 'Dominican Republic', dialCode: '+1809', flag: 'https://flagcdn.com/w20/do.png' },
    { code: 'PR', name: 'Puerto Rico', dialCode: '+1787', flag: 'https://flagcdn.com/w20/pr.png' },
    { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1868', flag: 'https://flagcdn.com/w20/tt.png' },
    { code: 'BB', name: 'Barbados', dialCode: '+1246', flag: 'https://flagcdn.com/w20/bb.png' },
    { code: 'AG', name: 'Antigua and Barbuda', dialCode: '+1268', flag: 'https://flagcdn.com/w20/ag.png' },
    { code: 'DM', name: 'Dominica', dialCode: '+1767', flag: 'https://flagcdn.com/w20/dm.png' },
    { code: 'GD', name: 'Grenada', dialCode: '+1473', flag: 'https://flagcdn.com/w20/gd.png' },
    { code: 'KN', name: 'Saint Kitts and Nevis', dialCode: '+1869', flag: 'https://flagcdn.com/w20/kn.png' },
    { code: 'LC', name: 'Saint Lucia', dialCode: '+1758', flag: 'https://flagcdn.com/w20/lc.png' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', dialCode: '+1784', flag: 'https://flagcdn.com/w20/vc.png' },
    { code: 'BS', name: 'Bahamas', dialCode: '+1242', flag: 'https://flagcdn.com/w20/bs.png' },
    { code: 'RU', name: 'Russia', dialCode: '+7', flag: 'https://flagcdn.com/w20/ru.png' },
    { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: 'https://flagcdn.com/w20/ua.png' },
    { code: 'BY', name: 'Belarus', dialCode: '+375', flag: 'https://flagcdn.com/w20/by.png' },
    { code: 'MD', name: 'Moldova', dialCode: '+373', flag: 'https://flagcdn.com/w20/md.png' },
    { code: 'GE', name: 'Georgia', dialCode: '+995', flag: 'https://flagcdn.com/w20/ge.png' },
    { code: 'AM', name: 'Armenia', dialCode: '+374', flag: 'https://flagcdn.com/w20/am.png' },
    { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: 'https://flagcdn.com/w20/az.png' },
    { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: 'https://flagcdn.com/w20/kz.png' },
    { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: 'https://flagcdn.com/w20/uz.png' },
    { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: 'https://flagcdn.com/w20/tm.png' },
    { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: 'https://flagcdn.com/w20/tj.png' },
    { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: 'https://flagcdn.com/w20/kg.png' },
    { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: 'https://flagcdn.com/w20/mn.png' },
    { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: 'https://flagcdn.com/w20/af.png' },
    { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: 'https://flagcdn.com/w20/pk.png' },
    { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: 'https://flagcdn.com/w20/bd.png' },
    { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: 'https://flagcdn.com/w20/lk.png' },
    { code: 'MV', name: 'Maldives', dialCode: '+960', flag: 'https://flagcdn.com/w20/mv.png' },
    { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: 'https://flagcdn.com/w20/bt.png' },
    { code: 'NP', name: 'Nepal', dialCode: '+977', flag: 'https://flagcdn.com/w20/np.png' },
    { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: 'https://flagcdn.com/w20/mm.png' },
    { code: 'LA', name: 'Laos', dialCode: '+856', flag: 'https://flagcdn.com/w20/la.png' },
    { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: 'https://flagcdn.com/w20/kh.png' },
    { code: 'BN', name: 'Brunei', dialCode: '+673', flag: 'https://flagcdn.com/w20/bn.png' },
    { code: 'TL', name: 'East Timor', dialCode: '+670', flag: 'https://flagcdn.com/w20/tl.png' },
    { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', flag: 'https://flagcdn.com/w20/pg.png' },
    { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: 'https://flagcdn.com/w20/fj.png' },
    { code: 'SB', name: 'Solomon Islands', dialCode: '+677', flag: 'https://flagcdn.com/w20/sb.png' },
    { code: 'VU', name: 'Vanuatu', dialCode: '+678', flag: 'https://flagcdn.com/w20/vu.png' },
    { code: 'NC', name: 'New Caledonia', dialCode: '+687', flag: 'https://flagcdn.com/w20/nc.png' },
    { code: 'PF', name: 'French Polynesia', dialCode: '+689', flag: 'https://flagcdn.com/w20/pf.png' },
    { code: 'WS', name: 'Samoa', dialCode: '+685', flag: 'https://flagcdn.com/w20/ws.png' },
    { code: 'TO', name: 'Tonga', dialCode: '+676', flag: 'https://flagcdn.com/w20/to.png' },
    { code: 'KI', name: 'Kiribati', dialCode: '+686', flag: 'https://flagcdn.com/w20/ki.png' },
    { code: 'TV', name: 'Tuvalu', dialCode: '+688', flag: 'https://flagcdn.com/w20/tv.png' },
    { code: 'NR', name: 'Nauru', dialCode: '+674', flag: 'https://flagcdn.com/w20/nr.png' },
    { code: 'PW', name: 'Palau', dialCode: '+680', flag: 'https://flagcdn.com/w20/pw.png' },
    { code: 'FM', name: 'Micronesia', dialCode: '+691', flag: 'https://flagcdn.com/w20/fm.png' },
    { code: 'MH', name: 'Marshall Islands', dialCode: '+692', flag: 'https://flagcdn.com/w20/mh.png' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: 'https://flagcdn.com/w20/nz.png' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: 'https://flagcdn.com/w20/za.png' },
    { code: 'EG', name: 'Egypt', dialCode: '+20', flag: 'https://flagcdn.com/w20/eg.png' },
    { code: 'LY', name: 'Libya', dialCode: '+218', flag: 'https://flagcdn.com/w20/ly.png' },
    { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: 'https://flagcdn.com/w20/tn.png' },
    { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: 'https://flagcdn.com/w20/dz.png' },
    { code: 'MA', name: 'Morocco', dialCode: '+212', flag: 'https://flagcdn.com/w20/ma.png' },
    { code: 'SD', name: 'Sudan', dialCode: '+249', flag: 'https://flagcdn.com/w20/sd.png' },
    { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: 'https://flagcdn.com/w20/ss.png' },
    { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: 'https://flagcdn.com/w20/et.png' },
    { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: 'https://flagcdn.com/w20/er.png' },
    { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: 'https://flagcdn.com/w20/dj.png' },
    { code: 'SO', name: 'Somalia', dialCode: '+252', flag: 'https://flagcdn.com/w20/so.png' },
    { code: 'KE', name: 'Kenya', dialCode: '+254', flag: 'https://flagcdn.com/w20/ke.png' },
    { code: 'UG', name: 'Uganda', dialCode: '+256', flag: 'https://flagcdn.com/w20/ug.png' },
    { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: 'https://flagcdn.com/w20/tz.png' },
    { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: 'https://flagcdn.com/w20/rw.png' },
    { code: 'BI', name: 'Burundi', dialCode: '+257', flag: 'https://flagcdn.com/w20/bi.png' },
    { code: 'CD', name: 'Democratic Republic of the Congo', dialCode: '+243', flag: 'https://flagcdn.com/w20/cd.png' },
    { code: 'CG', name: 'Republic of the Congo', dialCode: '+242', flag: 'https://flagcdn.com/w20/cg.png' },
    { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: 'https://flagcdn.com/w20/cf.png' },
    { code: 'TD', name: 'Chad', dialCode: '+235', flag: 'https://flagcdn.com/w20/td.png' },
    { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: 'https://flagcdn.com/w20/cm.png' },
    { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: 'https://flagcdn.com/w20/gq.png' },
    { code: 'GA', name: 'Gabon', dialCode: '+241', flag: 'https://flagcdn.com/w20/ga.png' },
    { code: 'ST', name: 'São Tomé and Príncipe', dialCode: '+239', flag: 'https://flagcdn.com/w20/st.png' },
    { code: 'AO', name: 'Angola', dialCode: '+244', flag: 'https://flagcdn.com/w20/ao.png' },
    { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: 'https://flagcdn.com/w20/zm.png' },
    { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: 'https://flagcdn.com/w20/zw.png' },
    { code: 'BW', name: 'Botswana', dialCode: '+267', flag: 'https://flagcdn.com/w20/bw.png' },
    { code: 'NA', name: 'Namibia', dialCode: '+264', flag: 'https://flagcdn.com/w20/na.png' },
    { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: 'https://flagcdn.com/w20/sz.png' },
    { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: 'https://flagcdn.com/w20/ls.png' },
    { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: 'https://flagcdn.com/w20/mg.png' },
    { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: 'https://flagcdn.com/w20/mu.png' },
    { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: 'https://flagcdn.com/w20/sc.png' },
    { code: 'KM', name: 'Comoros', dialCode: '+269', flag: 'https://flagcdn.com/w20/km.png' },
    { code: 'YT', name: 'Mayotte', dialCode: '+262', flag: 'https://flagcdn.com/w20/yt.png' },
    { code: 'RE', name: 'Réunion', dialCode: '+262', flag: 'https://flagcdn.com/w20/re.png' },
    { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: 'https://flagcdn.com/w20/mz.png' },
    { code: 'MW', name: 'Malawi', dialCode: '+265', flag: 'https://flagcdn.com/w20/mw.png' },
    { code: 'GH', name: 'Ghana', dialCode: '+233', flag: 'https://flagcdn.com/w20/gh.png' },
    { code: 'TG', name: 'Togo', dialCode: '+228', flag: 'https://flagcdn.com/w20/tg.png' },
    { code: 'BJ', name: 'Benin', dialCode: '+229', flag: 'https://flagcdn.com/w20/bj.png' },
    { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: 'https://flagcdn.com/w20/bf.png' },
    { code: 'NE', name: 'Niger', dialCode: '+227', flag: 'https://flagcdn.com/w20/ne.png' },
    { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: 'https://flagcdn.com/w20/ng.png' },
    { code: 'CI', name: 'Ivory Coast', dialCode: '+225', flag: 'https://flagcdn.com/w20/ci.png' },
    { code: 'LR', name: 'Liberia', dialCode: '+231', flag: 'https://flagcdn.com/w20/lr.png' },
    { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: 'https://flagcdn.com/w20/sl.png' },
    { code: 'GN', name: 'Guinea', dialCode: '+224', flag: 'https://flagcdn.com/w20/gn.png' },
    { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: 'https://flagcdn.com/w20/gw.png' },
    { code: 'GM', name: 'Gambia', dialCode: '+220', flag: 'https://flagcdn.com/w20/gm.png' },
    { code: 'SN', name: 'Senegal', dialCode: '+221', flag: 'https://flagcdn.com/w20/sn.png' },
    { code: 'ML', name: 'Mali', dialCode: '+223', flag: 'https://flagcdn.com/w20/ml.png' },
    { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: 'https://flagcdn.com/w20/mr.png' },
    { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: 'https://flagcdn.com/w20/cv.png' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: 'https://flagcdn.com/w20/sa.png' },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: 'https://flagcdn.com/w20/ae.png' },
    { code: 'QA', name: 'Qatar', dialCode: '+974', flag: 'https://flagcdn.com/w20/qa.png' },
    { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: 'https://flagcdn.com/w20/bh.png' },
    { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: 'https://flagcdn.com/w20/kw.png' },
    { code: 'OM', name: 'Oman', dialCode: '+968', flag: 'https://flagcdn.com/w20/om.png' },
    { code: 'YE', name: 'Yemen', dialCode: '+967', flag: 'https://flagcdn.com/w20/ye.png' },
    { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: 'https://flagcdn.com/w20/iq.png' },
    { code: 'IR', name: 'Iran', dialCode: '+98', flag: 'https://flagcdn.com/w20/ir.png' },
    { code: 'TR', name: 'Turkey', dialCode: '+90', flag: 'https://flagcdn.com/w20/tr.png' },
    { code: 'IL', name: 'Israel', dialCode: '+972', flag: 'https://flagcdn.com/w20/il.png' },
    { code: 'PS', name: 'Palestine', dialCode: '+970', flag: 'https://flagcdn.com/w20/ps.png' },
    { code: 'JO', name: 'Jordan', dialCode: '+962', flag: 'https://flagcdn.com/w20/jo.png' },
    { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: 'https://flagcdn.com/w20/lb.png' },
    { code: 'SY', name: 'Syria', dialCode: '+963', flag: 'https://flagcdn.com/w20/sy.png' },
    { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: 'https://flagcdn.com/w20/cy.png' }
  ];

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );



  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowModal(false);
    setSearchTerm('');
    // Update the phone number with new country code
    if (value) {
      const phoneNumber = value.replace(/^\+\d+/, country.dialCode);
      onChange(phoneNumber);
    } else {
      onChange(country.dialCode);
    }
  };

  // Update formatted value when value prop changes
  useEffect(() => {
    if (value !== formattedValue) {
      setFormattedValue(value);
    }
  }, [value, formattedValue]);

  return (
    <div className="relative">
      {/* Use exact same Tailwind classes as other input fields */}
      <div className={`w-full pl-3 pr-3 py-2 rounded-3xl border bg-white text-gray-900 placeholder-gray-400 placeholder:text-sm text-base focus-within:outline-none focus-within:ring-2 focus-within:border-transparent transition-all duration-200 ${
        error 
          ? 'border-red-500 focus-within:ring-red-500' 
          : 'border-white focus-within:ring-pink-500'
      }`}>
        {/* Custom phone input with country selector */}
        <div className="flex items-center gap-3">
          {/* Country Selector Button */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 rounded-lg px-1 py-1"
          >
            <img 
              src={selectedCountry.flag} 
              alt={selectedCountry.name}
              className="w-5 h-5 object-cover rounded-full"
            />
            <span className="text-gray-700 text-sm font-medium">{selectedCountry.dialCode}</span>
            <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
          </button>
          
          {/* Phone Number Input */}
          <input
            type="tel"
            value={value?.replace(selectedCountry.dialCode, '') || ''}
            onChange={(e) => {
              const inputValue = e.target.value;
              const digitsOnly = inputValue.replace(/\D/g, '');
              const countryInfo = getCountryInfo(selectedCountry.code);
              
              // Limit digits based on country
              if (digitsOnly.length > countryInfo.digits) {
                return; // Don't allow more digits than country limit
              }
              
              // Format with dashes as user types
              let formatted = digitsOnly;
              if (selectedCountry.code === 'PK') {
                // Pakistan: XXX-XXXXXXX
                if (digitsOnly.length > 3) {
                  formatted = digitsOnly.slice(0, 3) + '-' + digitsOnly.slice(3);
                }
              } else if (selectedCountry.code === 'US' || selectedCountry.code === 'CA') {
                // US/Canada: XXX-XXX-XXXX
                if (digitsOnly.length > 6) {
                  formatted = digitsOnly.slice(0, 3) + '-' + digitsOnly.slice(3, 6) + '-' + digitsOnly.slice(6);
                } else if (digitsOnly.length > 3) {
                  formatted = digitsOnly.slice(0, 3) + '-' + digitsOnly.slice(3);
                }
              } else if (selectedCountry.code === 'GB') {
                // UK: XXXX XXX XXX
                if (digitsOnly.length > 7) {
                  formatted = digitsOnly.slice(0, 4) + ' ' + digitsOnly.slice(4, 7) + ' ' + digitsOnly.slice(7);
                } else if (digitsOnly.length > 4) {
                  formatted = digitsOnly.slice(0, 4) + ' ' + digitsOnly.slice(4);
                }
              } else {
                // Default formatting with dashes
                if (digitsOnly.length > 6) {
                  formatted = digitsOnly.slice(0, 3) + '-' + digitsOnly.slice(3, 6) + '-' + digitsOnly.slice(6);
                } else if (digitsOnly.length > 3) {
                  formatted = digitsOnly.slice(0, 3) + '-' + digitsOnly.slice(3);
                }
              }
              
              // Update with country code + formatted number
              onChange(selectedCountry.dialCode + formatted);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 placeholder:text-sm text-base"
          />
        </div>
      </div>

      {/* Custom Country Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md h-[70vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 text-center">Choose your country</h2>
            </div>
            
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Country List */}
            <div className="flex-1 overflow-y-auto">
              {filteredCountries.map((country, index) => (
                <div key={country.code}>
                  <button
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left"
                  >
                    <img 
                      src={country.flag} 
                      alt={country.name}
                      className="w-5 h-5 object-cover rounded-full"
                    />
                    <span className="text-gray-900 font-medium">{country.name}</span>
                    <span className="text-gray-500 ml-auto">({country.dialCode})</span>
                  </button>
                  {index < filteredCountries.length - 1 && (
                    <div className="border-b border-gray-100 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Select Button */}
            <div className="p-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-xs mt-1 text-left">{error}</p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
