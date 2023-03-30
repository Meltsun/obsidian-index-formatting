export class IndexFormatter{
    public format_index(content: string[]){
        let isCodeBlock=false;
        let titleIndexs=new Array<number>(6);
        for(var i=0;i<titleIndexs.length;i++){
            titleIndexs[i]=0;
        }
        content.forEach((line,lineIndex,content)=>{
            let [lineType,nowLevel]=getTitleLevel(line);
            if(lineType==lineTypes.codeBlockEdge){
                isCodeBlock=!isCodeBlock;
            }
            else if(lineType==lineTypes.title && !isCodeBlock){
                titleIndexs[nowLevel-1]++;//this level`s index +1
                let indexText=' ';
                for(var j=0;j<titleIndexs.length;j++){
                    if(j<nowLevel){
                        indexText=indexText+titleIndexs[j]+'.';//index string
                    }
                    else if(j>=nowLevel){
                        titleIndexs[j]=0;//set lower level index 0
                    }
                }
                //match：
                //1.# only lines, the end 
                //2.markdown title
                let re=/(?<=^#+)(( +([0-9]+.)* *)|$)/ 
                content[lineIndex]=line.replace(re,indexText+' ')
            }
        })
    }
}

enum lineTypes{
    title,
    orderedList,
    codeBlockEdge,
    others
}

function getTitleLevel(line:string):[lineTypes,number]{
    if(line.startsWith("```")){
        return [lineTypes.codeBlockEdge, 0]
    }
    let level=0;
    for(var char of line){
        if(char=='#'){
            level++;
        }
        else{
            break;
        }
    }
    if(level>0){
        return [lineTypes.title,level];
    }
    else{
        return [lineTypes.others,0]
    }
}