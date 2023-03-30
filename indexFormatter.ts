export class IndexFormatter{
    public format_index(content: string[]){
        let titleIndexs=new Array<number>(6);
        for(var i=0;i<titleIndexs.length;i++){
            titleIndexs[i]=0;
        }
        content.forEach((line,lineIndex,content)=>{
            let nowTitleLevel=getTitleLevel(line);
            if(nowTitleLevel>0){
                titleIndexs[nowTitleLevel-1]++;//增加当前级别序号
                let indexText=' ';
                for(var j=0;j<titleIndexs.length;j++){
                    if(j<nowTitleLevel){
                        indexText=indexText+titleIndexs[j]+'.';//构造序号字符串
                    }
                    else if(j>=nowTitleLevel){
                        titleIndexs[j]=0;//重置等级更低的序号
                    }
                }
                //匹配：1.只含#的行，末尾 2.标题，#和标题内容之间
                let re=/(?<=^#+)(( +([0-9]+.)* *)|$)/ 
                content[lineIndex]=line.replace(re,indexText+' ')
            }
        })
    }
    //返回#数量
}

function getTitleLevel(line:string):number{
    let level=0;
    for(var char of line){
        if(char=='#'){
            level++;
        }
        else{
            break;
        }
    }
    return level;
}