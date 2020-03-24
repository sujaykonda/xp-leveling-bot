var Discord = require("discord.js")
var auth = require("./auth.json")
var Canvas = require("canvas")
var client = new Discord.Client();
var prefix = "r!"

const maxBar = 356;

String.prototype.splitSpace = function(){
    var msgSplit = [];
    var currSplit = "";
    for(var i = 0; i < this.length; i++){
        if(this[i] == " " && i != 0){
            msgSplit.push(currSplit)
            currSplit = ""
        }
        if(this[i] != " "){
            currSplit += this[i]
        }
    }
    msgSplit.push(currSplit)
    return msgSplit
}
client.on("ready", ()=>{
    console.log("Logged In")
    
})
client.on("message", async (msg) =>{
    const message = msg.content.toLowerCase();
    if(message.startsWith(prefix)){
        const nonPrefix = message.substring(prefix.length)
        const msgSplit = nonPrefix.splitSpace();
        const command = msgSplit[0];
        const args = msgSplit.splice(1);
        switch (command){
            case "displayimage":
                if(args.length != 1){
                    return;
                }
                const totalbar = 100;
                const canvas = Canvas.createCanvas(500, 500);
                const ctx = canvas.getContext('2d');
                // Since the image takes time to load, you should await it
                const background = await Canvas.loadImage('./EmptyXPBar.png');
                // This uses the canvas dimensions to stretch the image onto the entire canvas
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                // Sets the font of the text
                ctx.font = '60px sans-serif';
                // Select the style that will be used to fill the text in
                ctx.fillStyle = '#ffffff';
	            // Draw a rectangle with the dimensions of the entire canvas
                ctx.fillRect(canvas.width/6, canvas.height/1.68, maxBar*parseInt(args[0])/totalbar, 51);
                // Actually fill the text with a solid color
                ctx.fillText(msg.author.username, canvas.width / 2.3, canvas.height / 2);
                // Wait for Canvas to load the image
                const avatar = await Canvas.loadImage(msg.author.displayAvatarURL({ format: 'jpg' }));
                // Draw a shape onto the main canvas
                ctx.drawImage(avatar, canvas.width/4, canvas.height/2.5, 70, 70);
                // Use helpful Attachment class structure to process the file for you
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
                msg.reply("Image: ", attachment)
                
        }
    }
})
client.login(auth.token)