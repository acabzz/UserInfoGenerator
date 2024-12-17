import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';

const unitedStates = {"AL": "Alabama","AK": "Alaska","AZ": "Arizona","AR": "Arkansas","CA": "California","CO": "Colorado","CT": "Connecticut","DE": "Delaware","FL": "Florida","GA": "Georgia","HI": "Hawaii","ID": "Idaho","IL": "Illinois","IN": "Indiana","IA": "Iowa","KS": "Kansas","KY": "Kentucky","LA": "Louisiana","ME": "Maine","MD": "Maryland","MA": "Massachusetts","MI": "Michigan","MN": "Minnesota","MS": "Mississippi","MO": "Missouri","MT": "Montana","NE": "Nebraska","NV": "Nevada","NH": "New Hampshire","NJ": "New Jersey","NM": "New Mexico","NY": "New York","NC": "North Carolina","ND": "North Dakota","OH": "Ohio","OK": "Oklahoma","OR": "Oregon","PA": "Pennsylvania","RI": "Rhode Island","SC": "South Carolina","SD": "South Dakota","TN": "Tennessee","TX": "Texas","UT": "Utah","VT": "Vermont","VA": "Virginia","WA": "Washington","WV": "West Virginia","WI": "Wisconsin","WY": "Wyoming","AS": "American Samoa","DC": "District of Columbia","FM": "Federated States of Micronesia","GU": "Guam","MH": "Marshall Islands","MP": "Northern Mariana Islands","PW": "Palau","PR": "Puerto Rico","VI": "Virgin Islands","AA": "Armed Forces Americas","AE": "Armed Forces Europe","AP": "Armed Forces Pacific"};

const australianStates = {"NSW": "New South Wales", "VIC": "Victoria", "QLD": "Queensland", "SA": "South Australia", "WA": "Western Australia", "TAS": "Tasmania", "ACT": "Australian Capital Territory", "NT": "Northern Territory"};

const canadianStates = {"AB": "Alberta", "BC": "British Columbia", "MB": "Manitoba", "NB": "New Brunswick", "NL": "Newfoundland and Labrador", "NS": "Nova Scotia", "NT": "Northwest Territories", "NU": "Nunavut", "ON": "Ontario", "PE": "Prince Edward Island", "QC": "Quebec", "SK": "Saskatchewan", "YT": "Yukon"};

const validEmailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com", "msn.com", "live.com", "protonmail.com", "zoho.com", "mail.com", "yandex.com", "rediffmail.com", "inbox.com", "hushmail.com", "fastmail.com", "gmx.com", "verizon.net", "comcast.net"];

function s(l) {
    const asmodeus = "abcdefghijklmnopqrstuvwxyz0123456789";
    const to = asmodeus.length;
    let handsome = "";
    for (let n = 0; n < l; n++) {
      handsome += asmodeus.charAt(Math.floor(Math.random() * to));
    }
    return handsome;
  }

  function n(l) {
    const asmodeus = "0123456789";
    const to = asmodeus.length;
    let handsome = "";
    for (let n = 0; n < l; n++) {
      handsome += asmodeus.charAt(Math.floor(Math.random() * to));
    }
    return handsome;
  }

  const randomFunction = ["n", "s"];
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  const selectedFunction = shuffle(randomFunction)[0];
  const randomLetters = (length) =>
    selectedFunction === "n" ? n(length) : s(length);

const app = express();

app.get('/', (req, res) => {
  res.json({Author: 'Made with ❤️ by PUSA'});
})

app.get('/:country', (req, res) => {
        let country = req.params.country || 'us';
        if(country == 'gb') {
            country = 'uk'
        }
    axios.get(`https://www.fakenamegenerator.com/gen-random-us-${country}.php`, {
        headers: {
          'Host': 'www.fakenamegenerator.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Priority': 'u=0, i',
          'TE': 'trailers'
        }
    })
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const fullName = $('.address h3').text().trim();      
        const address = $('.address .adr')
            .html() 
            .replace(/<br\s*\/?>/g, ':') 
            .trim();
        const StreetAddress = address.split(':');
        const phoneNumber = $('dt')
        .filter((index, element) => $(element).text().trim() === 'Phone') 
        .next('dd') 
        .text() 
        .trim(); 
        const nameParts = fullName.split(' '); 

        let City, ZipCode, StateCode, State, PhoneModified = phoneNumber;
        if (StreetAddress[1].includes(',')) {
            const citySplit = StreetAddress[1].split(', ');
            City = citySplit[0];
            const ZipStateSplit = citySplit[1].split(' ');
            StateCode = ZipStateSplit[0];  
            ZipCode = ZipStateSplit[1];  
            State = unitedStates[StateCode];

                if (/^\d+$/.test(ZipCode)) {
                    State = unitedStates[StateCode];
                } else {
                    State = canadianStates[StateCode];
                    ZipCode = `${ZipStateSplit[1]} ${ZipStateSplit[2]}`;
                }

                if (PhoneModified.includes('-')) {
                    const phoneParts = PhoneModified.split('-');
                    if (phoneParts.length === 3) {
                        PhoneModified = `(${phoneParts[0]}) ${phoneParts[1]}-${phoneParts[2]}`;
                    }
                    else {
                        console.log("Invalid phone number format");
                        PhoneModified = phoneNumber;
                    }
                } else {
                    PhoneModified = phoneNumber;             
                }
        } 
        else if (StreetAddress[1].match(/^[A-Za-z\s]+ \w{2,} \d+$/)) {
            const cityStateZipSplit = StreetAddress[1].split(' ');
            City = cityStateZipSplit.slice(0, -2).join(' ');  
            StateCode = cityStateZipSplit[cityStateZipSplit.length - 2]; 
            ZipCode = cityStateZipSplit[cityStateZipSplit.length - 1]; 
            State = australianStates[StateCode];
        }
        else if (StreetAddress[2].match(/^[A-Za-z\s]+ \d+$/)) {
            const cityZipSplit = StreetAddress[2].split(' ');
            City = cityZipSplit.slice(0, -1).join(' ');  
            ZipCode = cityZipSplit[cityZipSplit.length - 1]; 
        } 
        else {
            City = StreetAddress[1];
            ZipCode = StreetAddress[2];
        }  
      
          const emailDomain = shuffle(validEmailDomains)[0];
      
          const first = nameParts[0];
          const last = nameParts[2];
      
          const emailUsernames = [
            `${first.toLowerCase()}${last.toLowerCase()}`,
            `${first
              .toLowerCase()
              .substring(0, Math.floor(Math.random() * 4) + 1)}${last.toLowerCase()}`,
            `${first.toLowerCase()}${last.toLowerCase()}${randomLetters(
              Math.floor(Math.random() * 5) + 1
            )}`,
            `${first
              .toLowerCase()
              .substring(0, Math.floor(Math.random() * 4) + 1)}${last.toLowerCase()}`,
            `${first.toLowerCase()}${last.toLowerCase()}${randomLetters(
              Math.floor(Math.random() * 5) + 1
            )}`,
            `${last.toLowerCase()}${first.toLowerCase()}`,
            `${last
              .toLowerCase()
              .substring(
                0,
                Math.floor(Math.random() * 4) + 1
              )}${first.toLowerCase()}`,
            `${last.toLowerCase()}${first.toLowerCase()}${randomLetters(
              Math.floor(Math.random() * 5) + 1
            )}`,
            `${last
              .toLowerCase()
              .substring(
                0,
                Math.floor(Math.random() * 4) + 1
              )}${first.toLowerCase()}`,
            `${last.toLowerCase()}${first.toLowerCase()}${randomLetters(
              Math.floor(Math.random() * 5) + 1
            )}`,
          ];
      
          const emailUsername = shuffle(emailUsernames)[0];
          const cleanedName = emailUsername.replace(/[^A-Za-z0-9\s]/g, "");
          const EmailAddress = `${cleanedName}@${emailDomain}`;
          const chromeAgent = new UserAgent({
            userAgent: /Chrome/,
            deviceCategory: 'desktop',
            platform: /(Win|Mac)/, 
        });
          const firefoxAgent = new UserAgent({
            userAgent: /Firefox/,
            deviceCategory: 'desktop',
            platform: /(Win|Mac)/, 
        });
        
        res.json(
            { 
                Person: {
                  FirstName: nameParts[0], 
                  LastName: nameParts[2],                  
                },
                Location: {
                  StreetAddress: StreetAddress[0],
                  City: City,
                  State: State,   
                  StateCode: StateCode,
                  ZipCode: ZipCode,
                },
                Contact: {
                  PhoneNumber: PhoneModified,
                  EmailAddress: EmailAddress,                  
                },
                UserAgent: {
                  Chrome: chromeAgent.toString(),
                  Firefox: firefoxAgent.toString(),
                },
                Other: {
                  Username: emailUsername
                }
            }
        );
    })
    .catch((err) => 
        console.error(err)
    );     
})

app.listen(3000, () => {
    console.log("Server is running at port 3000");
})