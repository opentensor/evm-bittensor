const { convertH160ToSS58 } = require('./address-mapping.js');

async function main() {
    const ethereumAddress = "0xbdA293c21DfCaDDAeB9aa8b98455d42325599d23";

    const ss58Address = convertH160ToSS58(ethereumAddress);
    console.log(`ss58 mirror: ${ss58Address}`);
}

main().catch(console.error);
