module.exports = function (str) {
    if(isNaN(str)){
         message.channel.send('<:wrong:746313186315337728> Kinly enter a positive integer') 
         return false
    }
    if(str <=0){
         message.channel.send('<:wrong:746313186315337728> The entry cannot be below than or equal to 0. Setup Aboarted') 
         return false
    }    
};