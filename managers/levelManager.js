module.exports = {returnLevel,returnXPNeeded,returnXPGain}

// FORMULAS
// XP = (level/x)^y
// LEVEL = x * √XP

let x = 0.05;
let y = 1.8;

function returnLevel(xp)
{
    for(i = 0; i<=20;i++)
    {
        if(returnXPNeeded(i) >= xp) return i-1;
    }
}

function returnXPNeeded(level)
{
    return (Math.pow(level/x,y))
}

function returnXPGain()
{
    // random int between 10-20
    return Math.floor(Math.random() * (21 - 10) + 10);
}