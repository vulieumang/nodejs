const puppeteer = require('puppeteer');

let electronicUrl = 'https://lrepacks.net/repaki-sistemnyh-programm/79-reg-organizer.html';
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(electronicUrl);

    let electronicData = await page.evaluate(() => {
        let products = [];
        let product_wrapper = document.querySelectorAll('.post.full-width');
        product_wrapper.forEach((product) => {
            let dataJson = {};
            try {
               
                // dataJson.title2 = product.querySelector('.entry-title').innerText;
                // dataJson.img = product.querySelector('.highslide').getAttribute("href");
                // dataJson.content = product.querySelector('.entry-content').innerText;

                dataJson.img = product.querySelector('.highslide').getAttribute("href");
                dataJson.title = product.querySelector('.entry-title > font > font').innerText;
                dataJson.content = product.querySelector('.entry-content').innerText;
            }
            catch (err) {
                console.log(err)
            }
            products.push(dataJson);
            
        });
        return products;
    });
    console.log(electronicData);
   
    await browser.close();
})();
