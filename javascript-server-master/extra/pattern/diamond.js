
function diamondTraingle(rows)
{
    let string = "";
    for(let i=1; i<=rows;i++)
    {
        for(let space=rows-i; space>0; space--)
        {
            string = string + " "
        }
        for(let star = 1; star<=i; star++)
        {
          string=string + "* " 
        }
        string+= "\n"
        
    }
    for(let i=1; i<=rows;i++)
    {
        for(let space = 1; space <= i; space++)
        {
          string=string + " "
        }
        for(let star = rows-i; star>0; star--)
        {
            string=string + "* "  
        }
        string+= "\n"
        
    }

console.log(string)
}
export default diamondTraingle;