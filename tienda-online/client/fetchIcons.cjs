const fs = require('fs');
const https = require('https');

const icons = {
  1: 't-shirt',
  2: 'hoodie',
  3: 'pants',
  4: 'dress',
  5: 'sneaker'
};

const getSvg = (name) => {
  return new Promise((resolve, reject) => {
    https.get(`https://raw.githubusercontent.com/phosphor-icons/core/main/raw/regular/${name}.svg`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
};

async function updateHome() {
  let homeContent = fs.readFileSync('./src/pages/Home.tsx', 'utf8');
  
  for (const id in icons) {
    const svgData = await getSvg(icons[id]);
    
    // Reactify the SVG
    const cleanSvg = svgData
      .replace(/<rect[^>]*>/, '') // remove background rect
      .replace(/<svg[^>]*>/, '<svg width="44" height="44" viewBox="0 0 256 256">')
      .replace(/currentColor/g, '#fff')
      .replace(/stroke-width="16"/g, 'strokeWidth="12"')
      .replace(/stroke-linecap/g, 'strokeLinecap')
      .replace(/stroke-linejoin/g, 'strokeLinejoin');
    
    // Find the category block based on id
    const regex = new RegExp(`({\\s*id:\\s*${id},\\s*name:\\s*'[^']+',\\s*icon:\\s*\\()\\s*<svg[\\s\\S]*?<\\/svg>\\s*(\\)\\s*})`, 'm');
    
    homeContent = homeContent.replace(regex, `$1\n      ${cleanSvg}\n    $2`);
  }
  
  fs.writeFileSync('./src/pages/Home.tsx', homeContent);
  console.log('Updated Home.tsx successfully!');
}

updateHome();
